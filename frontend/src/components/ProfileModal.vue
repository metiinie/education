<template>
  <Dialog
    v-model="showProfileDialog"
    :options="{
      title: 'Student Profile',
      size: 'xl',
    }"
  >
    <template #body-content>
      <div class="text-base">
        <div class="flex flex-col gap-4">
          <div
            class="flex items-center border-b border-solid border-gray-200 pb-4 gap-3"
          >
            <Avatar
              size="3xl"
              class="h-12 w-12"
              :label="studentInfo.student_name || 'Student'"
              :image="studentInfo.image || null"
            />
            <div class="flex flex-col gap-0.5">
              <p class="text-lg font-semibold text-gray-900">
                {{ studentInfo.student_name || 'Student' }}
              </p>
              <p class="text-sm text-gray-500">
                {{ studentInfo.student_email_id || studentInfo.email_address || '-' }}
              </p>
            </div>
          </div>

          <div>
            <div class="flex flex-col sm:flex-row gap-4">
              <div
                v-for="section in infoFormat"
                :key="section.section"
                class="flex-1 flex flex-col gap-3"
              >
                <div v-for="field in section.fields" :key="field.label">
                  <div
                    class="flex items-center"
                    v-if="field.label !== 'Address'"
                  >
                    <p class="w-1/2 text-sm text-gray-500">
                      {{ field.label }}:
                    </p>
                    <p class="w-1/2 text-sm font-medium text-gray-800">
                      {{ field.value }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-start mt-3 pt-3 border-t border-gray-100">
              <p class="w-1/4 text-sm text-gray-500">Address:</p>
              <p class="w-3/4 text-sm font-medium text-gray-800">
                {{ formattedAddress }}
              </p>
            </div>
          </div>

          <div
            class="flex items-center bg-blue-50/70 p-2.5 text-blue-800 text-xs rounded-lg mt-2"
          >
            <FeatherIcon name="info" class="h-4 w-4 mr-2 flex-shrink-0" />
            <span>In case of any incorrect details, please contact your school administrator.</span>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { Dialog, Avatar, FeatherIcon } from 'frappe-ui'
import { inject, computed } from 'vue'
import { studentStore } from '@/stores/student'

const { getStudentInfo } = studentStore()
const showProfileDialog = inject('showProfileDialog')

const studentInfo = computed(() => getStudentInfo().value || {})

const formattedAddress = computed(() => {
  const s = studentInfo.value
  return (
    [
      s?.address_line_1,
      s?.address_line_2,
      s?.city,
      s?.pincode,
      s?.state,
      s?.country,
    ]
      .map((item) => item?.trim())
      .filter(Boolean)
      .join(', ') || '-'
  )
})

const infoFormat = computed(() => [
  {
    section: 'section 1',
    fields: [
      {
        label: 'Student ID',
        value: studentInfo.value.name || '-',
      },
      {
        label: 'Mobile Number',
        value: studentInfo.value.student_mobile_number || '-',
      },
      {
        label: 'Joining Date',
        value: studentInfo.value.joining_date || '-',
      },
      {
        label: 'Date of Birth',
        value: studentInfo.value.date_of_birth || '-',
      },
    ],
  },
  {
    section: 'section 2',
    fields: [
      {
        label: 'Blood Group',
        value: studentInfo.value.blood_group || '-',
      },
      {
        label: 'Gender',
        value: studentInfo.value.gender || '-',
      },
      {
        label: 'Nationality',
        value: studentInfo.value.nationality || '-',
      },
    ],
  },
])
</script>
