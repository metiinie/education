<template>
  <div class="px-5 py-4">
    <div class="flex items-center justify-between mb-4" v-if="allPrograms.length > 0">
      <Dropdown :options="allPrograms">
        <template #default="{ open }">
          <Button :label="selectedProgram || 'Select Program'">
            <template #suffix>
              <FeatherIcon
                :name="open ? 'chevron-up' : 'chevron-down'"
                class="h-4 text-gray-600"
              />
            </template>
          </Button>
        </template>
      </Dropdown>
    </div>

    <!-- Loading State -->
    <div v-if="grades.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Grades Table -->
    <div v-else-if="tableData.rows.length > 0">
      <ListView
        class="h-full min-h-[300px]"
        :columns="tableData.columns"
        :rows="tableData.rows"
        :options="{
          selectable: false,
          showTooltip: false,
        }"
        row-key="course"
      />
    </div>

    <!-- Empty State -->
    <div v-else>
      <MissingData message="No grades found for the selected program" />
    </div>
  </div>
</template>

<script setup>
import {
  Dropdown,
  FeatherIcon,
  ListView,
  Button,
  createResource,
  createListResource,
} from 'frappe-ui'
import { ref, computed, watch } from 'vue'
import { studentStore } from '@/stores/student'
import { groupBy } from '@/utils'
import MissingData from '@/components/MissingData.vue'

const { getCurrentProgram, getStudentInfo } = studentStore()

const studentInfo = computed(() => getStudentInfo().value)
const currentProgram = computed(() => getCurrentProgram().value)

const allPrograms = ref([])
const selectedProgram = ref('')

const defaultColumns = [
  { label: 'Course', key: 'course' },
  { label: 'Batch', key: 'batch' },
]

const tableData = ref({
  columns: [...defaultColumns],
  rows: [],
})

const student_programs = createResource({
  url: 'education.education.api.get_student_programs',
  makeParams() {
    return {
      student: studentInfo.value?.name,
    }
  },
  onSuccess: (response) => {
    let programs = []
    if (Array.isArray(response)) {
      response.forEach((program) => {
        programs.push({
          label: program.program,
          onClick: () => {
            selectedProgram.value = program.program
          },
        })
      })
    }
    allPrograms.value = programs
    if (!selectedProgram.value && programs.length > 0) {
      selectedProgram.value =
        currentProgram.value?.program || programs[programs.length - 1]?.label || ''
    }
  },
  auto: true,
})

const grades = createListResource({
  doctype: 'Assessment Result',
  fields: [
    'name',
    'student_group',
    'course',
    'assessment_group',
    'total_score',
    'maximum_score',
    'grade',
  ],
  filters: {
    student: studentInfo.value?.name,
    program: currentProgram.value?.program,
  },
  onSuccess: (response) => {
    tableData.value.columns = [...defaultColumns]
    tableData.value.rows = []

    if (!response || response.length === 0) return

    let conductedExams = groupBy(response, (row) => row.assessment_group)
    let exams = Object.keys(conductedExams)
    updateColumns(exams)

    let courses = groupBy(response, (row) => row.course)
    let newRows = []
    Object.keys(courses).forEach((course) => {
      let row = {}
      row.course = course
      row.batch = courses[course][0]?.student_group || '-'
      exams.forEach((exam) => {
        let examData = conductedExams[exam]?.find((r) => r.course === course)
        row[exam] = examData
          ? `${examData.total_score}/${examData.maximum_score}${
              examData.grade ? ` (${examData.grade})` : ''
            }`
          : '-'
      })
      newRows.push(row)
    })
    tableData.value.rows = newRows
  },
  auto: true,
})

// Watch for program selection changes to reload grades
watch(selectedProgram, (newProgram) => {
  if (newProgram && studentInfo.value?.name) {
    grades.update({
      filters: {
        student: studentInfo.value.name,
        program: newProgram,
      },
    })
    grades.reload()
  }
})

// Watch for initial student data hydration
watch(
  () => studentInfo.value?.name,
  (name) => {
    if (name) {
      student_programs.reload()
    }
  }
)

const updateColumns = (exams) => {
  exams.forEach((exam) => {
    tableData.value.columns.push({
      label: exam,
      key: exam,
    })
  })
}
</script>
