import { createRouter, createWebHistory } from 'vue-router'
import { sessionStore } from '@/stores/session'

const routes = [
  {
    path: '/',
    redirect: '/schedule',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('@/pages/Schedule.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/grades',
    name: 'Grades',
    component: () => import('@/pages/Grades.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/fees',
    name: 'Fees',
    component: () => import('@/pages/Fees.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: () => import('@/pages/Attendance.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    redirect: (to) => {
      const session = sessionStore()
      return session.isLoggedIn ? '/schedule' : '/login'
    },
  },
]

const router = createRouter({
  history: createWebHistory('/student-portal'),
  routes,
})

router.beforeEach(async (to, from) => {
  const session = sessionStore()

  // 1. Ensure authentication is fully initialized before deciding on route access
  if (!session.isInitialized) {
    await session.initSession()
  }

  // 2. Handle public routes (e.g. Login)
  if (to.meta.isPublic) {
    if (session.isLoggedIn) {
      const target = to.query.redirect || '/schedule'
      if (to.path !== target) {
        return target
      }
    }
    return true
  }

  // 3. Handle protected routes (require authentication)
  if (!session.isLoggedIn) {
    if (to.name === 'Login' || to.path === '/login') {
      return true
    }
    return {
      name: 'Login',
      query: { redirect: to.fullPath },
    }
  }

  // 4. Authenticated user allowed to access requested route
  return true
})

export default router
