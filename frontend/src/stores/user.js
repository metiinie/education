import { defineStore } from 'pinia'
import { createResource } from 'frappe-ui'
import router from '@/router'

export const usersStore = defineStore('education-users', () => {
  const user = createResource({
    url: 'education.education.api.get_user_info',
    cache: 'User',
    initialData: null,
    onError(error) {
      if (error && error.exc_type === 'AuthenticationError') {
        if (router.currentRoute.value.name !== 'Login') {
          router.push({ name: 'Login' })
        }
      }
    },
  })

  return {
    user,
  }
})
