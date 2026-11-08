<template>
  <div class="px-6 py-6 max-w-6xl space-y-6">
    <!-- Welcome Header Card -->
    <div
      class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden"
    >
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-medium text-blue-100 mb-3">
          <span>🎓</span>
          <span>Academic Portal</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome back, {{ studentInfo?.student_name || 'Student' }}!
        </h1>
        <p class="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
          Here is your educational dashboard for
          <strong class="text-white">{{ currentProgram?.program || 'your enrolled program' }}</strong>.
        </p>
      </div>

      <div class="absolute -right-6 -bottom-8 opacity-10 pointer-events-none">
        <GraduationCap class="w-64 h-64 text-white" />
      </div>
    </div>

    <!-- Quick Navigation Hub -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <router-link
        to="/schedule"
        class="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 group flex items-start justify-between"
      >
        <div>
          <div class="p-2.5 bg-blue-50 text-blue-600 rounded-lg w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
            <CalendarCheck class="w-5 h-5" />
          </div>
          <h3 class="font-semibold text-gray-900 mt-4 text-base">Timetable</h3>
          <p class="text-xs text-gray-500 mt-1">Class schedule & rooms</p>
        </div>
        <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
      </router-link>

      <router-link
        to="/grades"
        class="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 group flex items-start justify-between"
      >
        <div>
          <div class="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
            <GraduationCap class="w-5 h-5" />
          </div>
          <h3 class="font-semibold text-gray-900 mt-4 text-base">Grades</h3>
          <p class="text-xs text-gray-500 mt-1">Report cards & exam scores</p>
        </div>
        <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-200" />
      </router-link>

      <router-link
        to="/fees"
        class="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 group flex items-start justify-between"
      >
        <div>
          <div class="p-2.5 bg-amber-50 text-amber-600 rounded-lg w-fit group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
            <Banknote class="w-5 h-5" />
          </div>
          <h3 class="font-semibold text-gray-900 mt-4 text-base">Fees</h3>
          <p class="text-xs text-gray-500 mt-1">Invoices & payment records</p>
        </div>
        <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-200" />
      </router-link>

      <router-link
        to="/attendance"
        class="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 group flex items-start justify-between"
      >
        <div>
          <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
            <UserCheck class="w-5 h-5" />
          </div>
          <h3 class="font-semibold text-gray-900 mt-4 text-base">Attendance</h3>
          <p class="text-xs text-gray-500 mt-1">Calendar & monthly status</p>
        </div>
        <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" />
      </router-link>
    </div>

    <!-- Today's Classes & Info Split -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Today's Schedule -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 class="font-bold text-gray-900 text-base">Today's Classes</h2>
            <p class="text-xs text-gray-500 mt-0.5">{{ todayFormatted }}</p>
          </div>
          <router-link
            to="/schedule"
            class="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Full Timetable &rarr;
          </router-link>
        </div>

        <div v-if="todaySchedule.length > 0" class="divide-y divide-gray-100 mt-2">
          <div
            v-for="item in todaySchedule"
            :key="item.name"
            class="py-3.5 flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="item.color ? `bg-${item.color}-500` : 'bg-blue-500'"></span>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ item.title || item.subject }}</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  <span v-if="item.faculty">Prof. {{ item.faculty }} &bull; </span>
                  <span v-if="item.room">Room: {{ item.room }}</span>
                </p>
              </div>
            </div>

            <div class="text-right">
              <span class="text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200/60">
                {{ formatTime(item.from_time) }} - {{ formatTime(item.to_time) }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="py-12 text-center text-gray-400">
          <CalendarCheck class="w-10 h-10 mx-auto stroke-[1.5] text-gray-300 mb-2" />
          <p class="text-sm font-medium text-gray-600">No classes scheduled for today</p>
          <p class="text-xs text-gray-400 mt-1">Enjoy your study break or review notes in your diary</p>
        </div>
      </div>

      <!-- Quick Info / Student Snapshot -->
      <div class="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs space-y-4">
        <h2 class="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">
          Student Profile
        </h2>

        <div class="space-y-3 text-xs">
          <div>
            <span class="text-gray-500">Student ID</span>
            <p class="font-semibold text-gray-800 text-sm mt-0.5">{{ studentInfo?.name || '-' }}</p>
          </div>
          <div>
            <span class="text-gray-500">Enrolled Program</span>
            <p class="font-semibold text-gray-800 text-sm mt-0.5">{{ currentProgram?.program || '-' }}</p>
          </div>
          <div>
            <span class="text-gray-500">Active Batches</span>
            <div class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="b in studentGroups"
                :key="b.label"
                class="px-2 py-0.5 bg-gray-100 font-medium text-gray-700 rounded text-xs"
              >
                {{ b.label }}
              </span>
              <span v-if="!studentGroups || studentGroups.length === 0" class="text-gray-400">-</span>
            </div>
          </div>
          <div>
            <span class="text-gray-500">Email Address</span>
            <p class="font-medium text-gray-800 mt-0.5">{{ studentInfo?.student_email_id || studentInfo?.email_address || '-' }}</p>
          </div>
        </div>

        <div class="pt-3 border-t border-gray-100 flex flex-col gap-2">
          <router-link
            to="/diary"
            class="w-full text-center py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200/70 transition-colors"
          >
            View School Diary &rarr;
          </router-link>
          <router-link
            to="/leaves"
            class="w-full text-center py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200/70 transition-colors"
          >
            Apply for Absence / Leave &rarr;
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import {
  GraduationCap,
  CalendarCheck,
  Banknote,
  UserCheck,
  ArrowRight,
} from 'lucide-vue-next'
import { createResource } from 'frappe-ui'
import { studentStore } from '@/stores/student'
import dayjs from 'dayjs'

const { getCurrentProgram, getStudentInfo, getStudentGroups } = studentStore()

const studentInfo = computed(() => getStudentInfo().value || {})
const currentProgram = computed(() => getCurrentProgram().value)
const studentGroups = computed(() => getStudentGroups().value || [])

const todayFormatted = dayjs().format('dddd, MMMM D, YYYY')
const todayDateStr = dayjs().format('YYYY-MM-DD')

const scheduleResource = createResource({
  url: 'education.education.api.get_subject_schedule_for_student',
  makeParams() {
    return {
      program_name: currentProgram.value?.program,
      student_batches: studentGroups.value,
    }
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

const todaySchedule = computed(() => {
  const all = scheduleResource.data || []
  return all.filter((item) => item.schedule_date === todayDateStr)
})

function formatTime(time) {
  if (!time) return ''
  return time.split('.')[0].slice(0, 5)
}
</script>
