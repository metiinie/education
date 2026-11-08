import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createResource } from 'frappe-ui'

export const studentStore = defineStore('education-student', () => {
  const studentInfo = ref({})
  const currentProgram = ref({})
  const studentGroups = ref([])

  const student = createResource({
    url: 'education.education.api.get_student_info',
    onSuccess(info) {
      if (!info) {
        studentInfo.value = {}
        currentProgram.value = {}
        studentGroups.value = []
        return
      }
      currentProgram.value = info.current_program || {}
      delete info.current_program
      studentGroups.value = info.student_batches || info.student_groups || []
      delete info.student_batches
      delete info.student_groups
      studentInfo.value = info
    },
    onError(err) {
      studentInfo.value = {}
      currentProgram.value = {}
      studentGroups.value = []
      console.warn('Student info fetch error:', err)
    },
  })

  function getStudentInfo() {
    return studentInfo
  }
  function getCurrentProgram() {
    return currentProgram
  }
  function getStudentGroups() {
    return studentGroups
  }

  return {
    student,
    studentInfo,
    currentProgram,
    studentGroups,
    getStudentInfo,
    getCurrentProgram,
    getStudentGroups,
  }
})
