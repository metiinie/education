<template>
  <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
    <div class="text-center mb-8">
      <div class="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-inner">
        <School class="w-8 h-8" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Frappe Education</h2>
      <p class="text-sm text-gray-500 mt-1">Student & Guardian Portal</p>
    </div>

    <form class="space-y-4" @submit.prevent="submit">
      <div>
        <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
          Email or User ID
        </label>
        <Input
          required
          v-model="email"
          type="text"
          placeholder="e.g. student@school.edu"
          class="w-full"
          :disabled="session.login.loading"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
          Password
        </label>
        <Input
          required
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full"
          :disabled="session.login.loading"
        />
      </div>

      <div
        v-if="errorMessage"
        class="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg flex items-center space-x-2"
      >
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>

      <Button
        :loading="session.login.loading"
        variant="solid"
        class="w-full justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
      >
        Sign In
      </Button>
    </form>

    <div class="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
      Administrator or Teacher? Access the
      <a href="/app/education" class="text-blue-600 font-medium hover:underline">Frappe Desk</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Input, Button } from 'frappe-ui'
import { sessionStore } from '@/stores/session'
import { School } from 'lucide-vue-next'

const session = sessionStore()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

function submit() {
  if (session.login.loading) return
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password'
    return
  }

  errorMessage.value = ''
  session.login.submit(
    {
      usr: email.value.trim(),
      pwd: password.value,
    },
    {
      onError(err) {
        errorMessage.value =
          err?.messages?.[0] || 'Invalid credentials. Please verify your user ID and password.'
      },
    }
  )
}
</script>
