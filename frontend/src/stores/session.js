import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createResource } from 'frappe-ui'
import { usersStore } from '@/stores/user'
import { studentStore } from '@/stores/student'
import router from '@/router'

export const sessionStore = defineStore('education-session', () => {
  const isInitializing = ref(true)
  const isInitialized = ref(false)
  const authError = ref(null)

  function sessionUser() {
    let cookies = new URLSearchParams(document.cookie.split('; ').join('&'))
    let _sessionUser = cookies.get('user_id')
    if (!_sessionUser || _sessionUser === 'Guest') {
      return null
    }
    return decodeURIComponent(_sessionUser)
  }

  const user = ref(sessionUser())
  const isLoggedIn = computed(() => !!user.value && user.value !== 'Guest')
  const isAdministrator = computed(() => user.value === 'Administrator')
  const hasStudentRecord = computed(() => {
    const s = studentStore()
    return !!(s.studentInfo?.name || s.studentInfo?.value?.name)
  })

  // Initialize and verify session against backend
  async function initSession() {
    isInitializing.value = true
    authError.value = null
    try {
      const currentCookieUser = sessionUser()
      if (!currentCookieUser) {
        user.value = null
        isInitialized.value = true
        isInitializing.value = false
        return
      }

      user.value = currentCookieUser
      const userStore = usersStore()
      const student = studentStore()

      // Fetch live user info from backend
      await userStore.user.reload()
      if (userStore.user.data?.name) {
        user.value = userStore.user.data.name
      }

      // If user is not Administrator, load student profile
      if (user.value && user.value !== 'Administrator') {
        await student.student.reload()
      }
    } catch (err) {
      console.warn('Session verification error or unauthenticated session:', err)
      user.value = null
      authError.value = err
    } finally {
      isInitializing.value = false
      isInitialized.value = true
    }
  }

  const login = createResource({
    url: 'login',
    onError(err) {
      authError.value = err?.messages?.[0] || 'Invalid email or password'
      throw err
    },
    async onSuccess() {
      authError.value = null
      user.value = sessionUser()
      const userStore = usersStore()
      const student = studentStore()

      try {
        await userStore.user.reload()
        if (userStore.user.data?.name) {
          user.value = userStore.user.data.name
        }
        if (user.value && user.value !== 'Administrator') {
          await student.student.reload()
        }
      } catch (e) {
        console.warn('Post-login hydration error:', e)
      }

      isInitialized.value = true
      isInitializing.value = false
      login.reset()

      // Navigate to preserved destination or default to root
      const redirectPath = router.currentRoute.value.query?.redirect || '/'
      router.replace(redirectPath)
    },
  })

  const logout = createResource({
    url: 'logout',
    async onSuccess() {
      user.value = null
      authError.value = null
      isInitialized.value = true
      isInitializing.value = false

      const userStore = usersStore()
      userStore.user.data = []

      const student = studentStore()
      student.studentInfo.value = {}
      student.currentProgram.value = {}
      student.studentGroups.value = []

      router.push({ name: 'Login' })
    },
  })

  return {
    user,
    isLoggedIn,
    isAdministrator,
    hasStudentRecord,
    isInitializing,
    isInitialized,
    authError,
    initSession,
    login,
    logout,
  }
})
