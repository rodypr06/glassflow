import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/Signup.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('@/views/Subscriptions.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/memberships',
      name: 'memberships',
      component: () => import('@/views/Memberships.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bills',
      name: 'bills',
      component: () => import('@/views/Bills.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/credit-cards',
      name: 'credit-cards',
      component: () => import('@/views/CreditCards.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/loans',
      name: 'loans',
      component: () => import('@/views/Loans.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/Analytics.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.loadAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if ((to.name === 'login' || to.name === 'signup') && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
