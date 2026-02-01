import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('glassflow-token', newToken)
    } else {
      localStorage.removeItem('glassflow-token')
    }
  }

  function setUser(userData) {
    user.value = userData
    if (userData) {
      localStorage.setItem('glassflow-user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('glassflow-user')
    }
  }

  function loadAuth() {
    const savedToken = localStorage.getItem('glassflow-token')
    const savedUser = localStorage.getItem('glassflow-user')

    if (savedToken) {
      token.value = savedToken
    }

    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('glassflow-token')
    localStorage.removeItem('glassflow-user')
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    loadAuth,
    logout
  }
})
