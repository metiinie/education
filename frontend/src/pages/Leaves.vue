<template>
  <div class="px-6 py-5 max-w-6xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Leave Applications</h1>
        <p class="text-sm text-gray-500 mt-1">
          Review leave request history and submit absence notices
        </p>
      </div>

      <Button
        variant="solid"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs"
        icon-left="plus"
        label="Apply for Leave"
        @click="showLeaveDialog = true"
      />
    </div>

    <!-- Loading State -->
    <div v-if="leavesList.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Leaves Table -->
    <div
      v-else-if="tableRows.length > 0"
      class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs"
    >
      <ListView
        :columns="columns"
        :rows="tableRows"
        :options="{
          selectable: false,
          showTooltip: false,
        }"
        row-key="name"
      >
        <ListHeader>
          <ListHeaderItem
            v-for="col in columns"
            :key="col.key"
            :item="col"
            class="text-xs font-semibold text-gray-600 uppercase tracking-wider"
          />
        </ListHeader>
        <ListRow
          v-for="row in tableRows"
          :key="row.name"
          :row="row"
          v-slot="{ column, item }"
        >
          <ListRowItem :item="item" :align="column.align">
            <Badge
              v-if="column.key === 'status'"
              variant="subtle"
              :theme="statusThemeMap[item] || 'gray'"
              size="md"
              :label="item"
            />
            <span v-else class="text-sm text-gray-800">
              {{ item }}
            </span>
          </ListRowItem>
        </ListRow>
      </ListView>
    </div>

    <!-- Empty State -->
    <div v-else>
      <MissingData message="No leave applications submitted yet" />
    </div>

    <!-- Apply Leave Dialog -->
    <Dialog
      v-model="showLeaveDialog"
      :options="{
        size: '2xl',
        title: 'Apply for Leave',
      }"
    >
      <template #body-content>
        <NewLeave :newLeave="newLeave" />
      </template>
      <template #actions="{ close }">
        <div class="flex flex-row-reverse gap-2">
          <Button
            :disabled="
              !newLeave.from_date ||
              !newLeave.to_date ||
              !newLeave.total_days ||
              !newLeave.reason ||
              applyLeaveResource.loading
            "
            :loading="applyLeaveResource.loading"
            variant="solid"
            class="bg-blue-600 hover:bg-blue-700 text-white"
            label="Submit Leave"
            @click="submitLeave(close)"
          />
          <Button
            variant="subtle"
            label="Cancel"
            @click="close"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  Button,
  Badge,
  Dialog,
  ListView,
  ListHeader,
  ListHeaderItem,
  ListRow,
  ListRowItem,
  createListResource,
  createResource,
} from 'frappe-ui'
import { studentStore } from '@/stores/student'
import NewLeave from '@/components/NewLeave.vue'
import MissingData from '@/components/MissingData.vue'
import { createToast } from '@/utils'
import dayjs from 'dayjs'

const { getStudentInfo, getCurrentProgram } = studentStore()
const studentInfo = computed(() => getStudentInfo().value)
const currentProgram = computed(() => getCurrentProgram().value)

const showLeaveDialog = ref(false)

const columns = [
  { label: 'Reason', key: 'reason', width: 2 },
  { label: 'From Date', key: 'from_date', width: 1 },
  { label: 'To Date', key: 'to_date', width: 1 },
  { label: 'Days', key: 'total_leave_days', width: 1 },
  { label: 'Status', key: 'status', width: 1 },
]

const statusThemeMap = {
  Approved: 'green',
  Pending: 'amber',
  Cancelled: 'red',
}

const leavesList = createListResource({
  doctype: 'Student Leave Application',
  fields: [
    'name',
    'from_date',
    'to_date',
    'total_leave_days',
    'reason',
    'docstatus',
    'creation',
  ],
  filters: {
    student: studentInfo.value?.name,
  },
  order_by: 'creation desc',
  auto: true,
})

const tableRows = computed(() => {
  const data = leavesList.data || []
  return data.map((row) => ({
    name: row.name,
    reason: row.reason || 'General Absence',
    from_date: row.from_date ? dayjs(row.from_date).format('MMM D, YYYY') : '-',
    to_date: row.to_date ? dayjs(row.to_date).format('MMM D, YYYY') : '-',
    total_leave_days: `${row.total_leave_days || 1} day(s)`,
    status: row.docstatus === 1 ? 'Approved' : row.docstatus === 2 ? 'Cancelled' : 'Pending',
  }))
})

const newLeave = reactive({
  student: studentInfo.value?.name,
  student_name: studentInfo.value?.student_name,
  from_date: '',
  to_date: '',
  reason: '',
  total_days: 1,
})

const applyLeaveResource = createResource({
  url: 'education.education.api.apply_leave',
})

async function submitLeave(close) {
  try {
    newLeave.student = studentInfo.value?.name
    newLeave.student_name = studentInfo.value?.student_name

    await applyLeaveResource.submit({
      leave_data: newLeave,
      program_name: currentProgram.value?.program || '',
    })

    createToast({
      title: 'Leave application submitted successfully',
      icon: 'check',
      iconClasses: 'text-green-600',
    })

    // Reset form & close
    newLeave.from_date = ''
    newLeave.to_date = ''
    newLeave.reason = ''
    newLeave.total_days = 1
    close()

    leavesList.reload()
  } catch (err) {
    createToast({
      title: err?.messages?.[0] || 'Failed to submit leave',
      icon: 'x',
      iconClasses: 'text-red-600',
    })
  }
}
</script>
