import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Auth API
export const authAPI = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  }
}

// Dashboard API
export const dashboardAPI = {
  async getOverview() {
    const response = await api.get('/dashboard/overview')
    return response.data
  },

  async getQuote() {
    const response = await api.get('/dashboard/quote')
    return response.data
  }
}

// Notifications API
export const notificationsAPI = {
  async getNotifications() {
    const response = await api.get('/notifications')
    return response.data
  },

  async markAsRead(id) {
    const response = await api.put(`/notifications/${id}/read`)
    return response.data
  },

  async markAllAsRead() {
    const response = await api.put('/notifications/read-all')
    return response.data
  }
}

// Settings API
export const settingsAPI = {
  async updateSettings(settings) {
    const response = await api.put('/settings', settings)
    return response.data
  },

  async getSettings() {
    const response = await api.get('/settings')
    return response.data
  }
}
