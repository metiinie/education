<template>
  <div class="px-6 py-5 max-w-5xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">School Diary</h1>
        <p class="text-sm text-gray-500 mt-1">
          Teacher notes, academic observations, and daily notices
        </p>
      </div>

      <!-- Type Filter Pills -->
      <div class="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-lg">
        <button
          v-for="type in filterTypes"
          :key="type"
          @click="selectedType = type"
          class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150"
          :class="
            selectedType === type
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          "
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="logsResource.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Diary Entries List -->
    <div v-else-if="filteredLogs.length > 0" class="space-y-4">
      <div
        v-for="entry in filteredLogs"
        :key="entry.name"
        class="bg-white rounded-xl border border-gray-200/70 p-5 shadow-xs hover:border-gray-300 transition-all duration-200"
      >
        <div class="flex items-start justify-between gap-4 mb-2.5">
          <div class="flex items-center gap-2.5">
            <Badge
              :theme="typeThemeMap[entry.type] || 'gray'"
              variant="subtle"
              size="md"
              :label="entry.type || 'General'"
            />
            <span
              v-if="entry.student_batch"
              class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
            >
              {{ entry.student_batch }}
            </span>
          </div>
          <span class="text-xs text-gray-500 whitespace-nowrap">
            {{ formatDate(entry.date) }}
          </span>
        </div>

        <div
          class="text-sm text-gray-800 leading-relaxed whitespace-pre-line mt-3"
          v-html="entry.log"
        ></div>

        <div
          v-if="entry.academic_year || entry.program"
          class="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400"
        >
          <span v-if="entry.program">Program: {{ entry.program }}</span>
          <span v-if="entry.academic_year">Year: {{ entry.academic_year }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <MissingData message="No diary entries found for this filter" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Badge, createResource } from 'frappe-ui'
import { studentStore } from '@/stores/student'
import MissingData from '@/components/MissingData.vue'
import dayjs from 'dayjs'

const { getStudentInfo } = studentStore()
const studentInfo = computed(() => getStudentInfo().value)

const filterTypes = ['All', 'Academic', 'General', 'Achievement', 'Medical']
const selectedType = ref('All')

const typeThemeMap = {
  Academic: 'blue',
  General: 'gray',
  Achievement: 'purple',
  Medical: 'red',
}

const logsResource = createResource({
  url: 'education.education.api.get_student_logs',
  params: {
    student: studentInfo.value?.name,
  },
  auto: true,
})

const filteredLogs = computed(() => {
  const list = logsResource.data || []
  if (selectedType.value === 'All') return list
  return list.filter((item) => item.type === selectedType.value)
})

function formatDate(date) {
  if (!date) return ''
  return dayjs(date).format('MMM D, YYYY')
}
</script>
