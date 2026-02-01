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

      <!-- Signup Form -->
      <GlassCard class="mb-6">
        <form @submit.prevent="handleSignup" class="space-y-6">
          <h2
            :class="[
              'text-2xl',
              'font-semibold',
              'text-center',
              'mb-6',
              isDark ? 'text-white' : 'text-gray-800'
            ]"
          >
            Create Account
          </h2>

          <!-- Error Message -->
          <div
            v-if="error"
            class="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm"
          >
            {{ error }}
          </div>

          <!-- Name Input -->
          <GlassInput
            v-model="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            required
          />

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

          <!-- Confirm Password Input -->
          <GlassInput
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            required
          />

          <!-- Password Strength Indicator -->
          <div v-if="password" class="space-y-2">
            <div class="flex justify-between text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <span>Password strength</span>
              <span :class="strengthColor">{{ strengthLabel }}</span>
            </div>
            <div class="h-2 rounded-full bg-black/20">
              <div
                class="h-full rounded-full smooth-transition"
                :class="[strengthColor, 'bg-current']"
                :style="{ width: `${strength}%` }"
              ></div>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <label class="flex items-start gap-3 cursor-pointer text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            <input
              v-model="agreeToTerms"
              type="checkbox"
              class="w-4 h-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              I agree to the
              <a href="#" class="hover:underline" :class="isDark ? 'text-indigo-400' : 'text-indigo-600'">
                Terms of Service
              </a>
              and
              <a href="#" class="hover:underline" :class="isDark ? 'text-indigo-400' : 'text-indigo-600'">
                Privacy Policy
              </a>
            </span>
          </label>

          <!-- Signup Button -->
          <GlassButton
            type="submit"
            class="w-full"
            :loading="loading"
            :disabled="!isFormValid"
          >
            Create Account
          </GlassButton>

          <!-- Login Link -->
          <p
            :class="[
              'text-center',
              'text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            ]"
          >
            Already have an account?
            <router-link
              to="/login"
              :class="[
                'font-semibold',
                'hover:underline',
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              ]"
            >
              Sign in
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const loading = ref(false)
const error = ref('')

const strength = computed(() => {
  if (!password.value) return 0
  let score = 0
  if (password.value.length >= 8) score += 25
  if (password.value.match(/[a-z]/) && password.value.match(/[A-Z]/)) score += 25
  if (password.value.match(/\d/)) score += 25
  if (password.value.match(/[^a-zA-Z\d]/)) score += 25
  return score
})

const strengthLabel = computed(() => {
  if (strength.value < 25) return 'Weak'
  if (strength.value < 50) return 'Fair'
  if (strength.value < 75) return 'Good'
  return 'Strong'
})

const strengthColor = computed(() => {
  if (strength.value < 25) return 'text-red-500'
  if (strength.value < 50) return 'text-yellow-500'
  if (strength.value < 75) return 'text-blue-500'
  return 'text-green-500'
})

const isFormValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    agreeToTerms.value
  )
})

async function handleSignup() {
  loading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      return
    }

    const userData = {
      id: Date.now(),
      name: name.value,
      email: email.value
    }

    authStore.setUser(userData)
    authStore.setToken('demo-token-' + Date.now())

    router.push('/')
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
