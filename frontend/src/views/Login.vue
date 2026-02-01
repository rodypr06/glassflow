<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1
          :class="[
            'text-4xl',
            'font-bold',
            'mb-2',
            isDark ? 'text-white' : 'text-gray-800'
          ]"
        >
          GlassFlow
        </h1>
        <p :class="['text-lg', isDark ? 'text-gray-300' : 'text-gray-600']">
          Personal Finance Management
        </p>
      </div>

      <!-- Login Form -->
      <GlassCard class="mb-6">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <h2
            :class="[
              'text-2xl',
              'font-semibold',
              'text-center',
              'mb-6',
              isDark ? 'text-white' : 'text-gray-800'
            ]"
          >
            Welcome Back
          </h2>

          <!-- Error Message -->
          <div
            v-if="error"
            class="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm"
          >
            {{ error }}
          </div>

          <!-- Email Input -->
          <GlassInput
            v-model="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            required
          />

          <!-- Password Input -->
          <GlassInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
          />

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <a
              href="#"
              :class="[
                'hover:underline',
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              ]"
            >
              Forgot password?
            </a>
          </div>

          <!-- Login Button -->
          <GlassButton
            type="submit"
            class="w-full"
            :loading="loading"
          >
            Sign In
          </GlassButton>

          <!-- Sign Up Link -->
          <p
            :class="[
              'text-center',
              'text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            ]"
          >
            Don't have an account?
            <router-link
              to="/signup"
              :class="[
                'font-semibold',
                'hover:underline',
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              ]"
            >
              Sign up
            </router-link>
          </p>
        </form>
      </GlassCard>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import GlassCard from '@/components/GlassCard.vue'
import GlassButton from '@/components/GlassButton.vue'
import GlassInput from '@/components/GlassInput.vue'
import Footer from '@/components/Footer.vue'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isDark = computed(() => themeStore.isDark)

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo purposes, accept any email/password
    if (email.value && password.value) {
      const userData = {
        id: 1,
        name: email.value.split('@')[0],
        email: email.value
      }

      authStore.setUser(userData)
      authStore.setToken('demo-token-' + Date.now())

      router.push('/')
    } else {
      error.value = 'Please enter both email and password'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
