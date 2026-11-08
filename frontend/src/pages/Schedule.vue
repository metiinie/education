<template>
  <div class="w-full h-full">
    <Calendar
      v-if="!scheduleResource.loading && scheduleResource.data"
      :events="events"
    />
  </div>
</template>

<script setup>
import Calendar from '@/components/Calendar.vue'
import { createResource } from 'frappe-ui'
import { ref, computed, watch } from 'vue'
import { studentStore } from '@/stores/student'

const { getCurrentProgram, getStudentGroups } = studentStore()

const currentProgram = computed(() => getCurrentProgram().value)
const studentGroups = computed(() => getStudentGroups().value || [])
const events = ref([])

const scheduleResource = createResource({
  url: 'education.education.api.get_subject_schedule_for_student',
  makeParams() {
    return {
      program_name: currentProgram.value?.program,
      student_groups: studentGroups.value,
    }
  },
  onSuccess: (response) => {
    let schedule = []
    if (Array.isArray(response)) {
      response.forEach((classSchedule) => {
        schedule.push({
          title: classSchedule.title,
          with: classSchedule.faculty_name,
          name: classSchedule.name,
          room: classSchedule.room,
          date: classSchedule.schedule_date,
          from_time: classSchedule.from_time
            ? classSchedule.from_time.split('.')[0]
            : '',
          to_time: classSchedule.to_time
            ? classSchedule.to_time.split('.')[0]
            : '',
          color: classSchedule.class_schedule_color,
        })
      })
    }
    events.value = schedule
  },
  auto: true,
})

watch(
  () => [currentProgram.value?.program, studentGroups.value],
  ([prog, groups]) => {
    if (prog && groups && groups.length > 0) {
      scheduleResource.reload()
    }
  }
)
</script>

<style></style>
