<template>
  <div>
    <!-- Initializing State -->
    <div
      v-if="session.isInitializing"
      class="h-screen w-screen flex flex-col items-center justify-center bg-gray-50"
    >
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"
      ></div>
      <p class="text-sm text-gray-500 font-medium">Loading Frappe Education...</p>
    </div>

    <!-- Public pages (like Login) render without sidebar/navbar -->
    <div
      v-else-if="$route.meta?.isPublic"
      class="h-screen w-screen flex items-center justify-center bg-gray-50"
    >
      <router-view />
    </div>

    <!-- Authenticated pages render inside portal layout -->
    <div v-else class="flex h-screen w-screen">
      <div class="h-full border-r bg-gray-50">
        <Sidebar />
      </div>
      <div class="flex-1 flex flex-col h-full overflow-auto">
        <Navbar />

        <!-- Role Notices for Administrator or Users without Student Record -->
        <div
          v-if="session.isAdministrator"
          class="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900"
        >
          <div class="flex items-center space-x-2">
            <span
              class="font-semibold px-2 py-0.5 bg-amber-200 text-amber-900 rounded"
              >Admin Notice</span
            >
            <span
              >You are logged in as <strong>Administrator</strong>. The Student
              Portal is designed for students. To manage institutional data, open
              the Desk.</span
            >
          </div>
          <a
            href="/app/education"
            class="font-semibold text-amber-900 hover:underline"
            >Open Desk (/app) &rarr;</a
          >
        </div>

        <div
          v-else-if="!session.hasStudentRecord"
          class="bg-blue-50 border-b border-blue-200 px-4 py-2.5 flex items-center justify-between text-xs text-blue-900"
        >
          <div class="flex items-center space-x-2">
            <span
              class="font-semibold px-2 py-0.5 bg-blue-200 text-blue-900 rounded"
              >No Student Profile</span
            >
            <span
              >Your account ({{ session.user }}) is not associated with any
              Student record.</span
            >
          </div>
          <a href="/app" class="font-semibold text-blue-900 hover:underline"
            >Go to Desk &rarr;</a
          >
        </div>

        <router-view class="flex-1 overflow-auto" />
      </div>
    </div>
  </div>
  <Toasts />
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import { RouterView, useRoute } from 'vue-router'
import { Toasts } from 'frappe-ui'
import { sessionStore } from '@/stores/session'

const session = sessionStore()
const $route = useRoute()
</script>
