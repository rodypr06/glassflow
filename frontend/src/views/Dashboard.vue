<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav
      :class="[
        'fixed',
        'top-0',
        'left-0',
        'right-0',
        'z-50',
        'px-6',
        'py-4',
        isDark ? 'glass-nav-dark' : 'glass-nav-light'
      ]"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3">
          <div
            :class="[
              'w-10',
              'h-10',
              'rounded-xl',
              'bg-gradient-to-br',
              'from-indigo-500',
              'to-purple-500',
              'flex',
              'items-center',
              'justify-center',
              'text-white',
              'font-bold',
              'text-lg'
            ]"
          >
            G
          </div>
          <span
            :class="[
              'text-xl',
              'font-bold',
              isDark ? 'text-white' : 'text-gray-800'
            ]"
          >
            GlassFlow
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            :class="[
              'text-sm',
              'font-medium',
              'smooth-transition',
              $route.path === link.path
                ? 'text-indigo-500'
                : isDark
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            {{ link.name }}
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center gap-4">
          <button
            @click="logout"
            :class="[
              'text-sm',
              'font-medium',
              'hover:underline',
              isDark ? 'text-gray-300' : 'text-gray-600'
            ]"
          >
            Logout
          </button>
          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg"
            :class="isDark ? 'bg-white/10' : 'bg-black/10'"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="w-6 h-6"
              :class="isDark ? 'text-white' : 'text-gray-800'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              :class="isDark ? 'text-white' : 'text-gray-800'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        :class="[
          'md:hidden',
          'mt-4',
          'p-4',
          'rounded-xl',
          'space-y-3',
          isDark ? 'glass-card-dark' : 'glass-card-light'
        ]"
      >
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          :class="[
            'block',
            'py-2',
            'px-4',
            'rounded-lg',
            'text-sm',
            'font-medium',
            'smooth-transition',
            $route.path === link.path
              ? 'bg-indigo-500/20 text-indigo-500'
              : isDark
              ? 'text-gray-300 hover:bg-white/10'
              : 'text-gray-600 hover:bg-black/10'
          ]"
          @click="mobileMenuOpen = false"
        >
          {{ link.name }}
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-24 pb-12 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1
            :class="[
              'text-3xl',
              'font-bold',
              'mb-2',
              isDark ? 'text-white' : 'text-gray-800'
            ]"
          >
            Welcome back, {{ authStore.user?.name || 'User' }}!
          </h1>
          <p :class="['text-lg', isDark ? 'text-gray-400' : 'text-gray-600']">
            Here's your financial overview for {{ currentMonth }}
          </p>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard>
            <div class="flex items-center justify-between">
              <div>
                <p :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
                  Monthly Expenses
                </p>
                <p
                  :class="[
                    'text-2xl',
                    'font-bold',
                    'mt-1',
                    isDark ? 'text-white' : 'text-gray-800'
                  ]"
                >
                  ${{ monthlyExpenses.toLocaleString() }}
                </p>
              </div>
              <div
                :class="[
                  'p-3',
                  'rounded-xl',
                  'bg-gradient-to-br',
                  'from-indigo-500',
                  'to-purple-500'
                ]"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div class="flex items-center justify-between">
              <div>
                <p :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
                  Upcoming Bills
                </p>
                <p
                  :class="[
                    'text-2xl',
                    'font-bold',
                    'mt-1',
                    isDark ? 'text-white' : 'text-gray-800'
                  ]"
                >
                  {{ upcomingBills }}
                </p>
              </div>
              <div
                :class="[
                  'p-3',
                  'rounded-xl',
                  'bg-gradient-to-br',
                  'from-yellow-500',
                  'to-orange-500'
                ]"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div class="flex items-center justify-between">
              <div>
                <p :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
                  Active Subscriptions
                </p>
                <p
                  :class="[
                    'text-2xl',
                    'font-bold',
                    'mt-1',
                    isDark ? 'text-white' : 'text-gray-800'
                  ]"
                >
                  {{ activeSubscriptions }}
                </p>
              </div>
              <div
                :class="[
                  'p-3',
                  'rounded-xl',
                  'bg-gradient-to-br',
                  'from-blue-500',
                  'to-cyan-500'
                ]"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div class="flex items-center justify-between">
              <div>
                <p :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
                  Total Debt
                </p>
                <p
                  :class="[
                    'text-2xl',
                    'font-bold',
                    'mt-1',
                    isDark ? 'text-white' : 'text-gray-800'
                  ]"
                >
                  ${{ totalDebt.toLocaleString() }}
                </p>
              </div>
              <div
                :class="[
                  'p-3',
                  'rounded-xl',
                  'bg-gradient-to-br',
                  'from-rose-500',
                  'to-pink-500'
                ]"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </GlassCard>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Chart Section -->
          <div class="lg:col-span-2">
            <ChartCard
              type="doughnut"
              title="Expense Breakdown"
              subtitle="This month's spending by category"
              :data="expenseData"
              height="350px"
            />
          </div>

          <!-- Quote & Quick Actions -->
          <div class="space-y-6">
            <QuoteCard />

            <!-- Quick Actions -->
            <GlassCard>
              <h3
                :class="[
                  'text-lg',
                  'font-semibold',
                  'mb-4',
                  isDark ? 'text-white' : 'text-gray-800'
                ]"
              >
                Quick Actions
              </h3>
              <div class="space-y-3">
                <GlassButton
                  class="w-full"
                  @click="$router.push('/bills')"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Bill
                </GlassButton>
                <GlassButton
                  class="w-full"
                  @click="$router.push('/subscriptions')"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Subscription
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore, useBillStore, useCreditCardStore, useLoanStore } from '@/stores/data'
import GlassCard from '@/components/GlassCard.vue'
import GlassButton from '@/components/GlassButton.vue'
import Footer from '@/components/Footer.vue'
import QuoteCard from '@/components/QuoteCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isDark = computed(() => themeStore.isDark)

const mobileMenuOpen = ref(false)
const monthlyExpenses = ref(0)
const upcomingBills = ref(0)
const activeSubscriptions = ref(0)
const totalDebt = ref(0)

const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Subscriptions', path: '/subscriptions' },
  { name: 'Memberships', path: '/memberships' },
  { name: 'Bills', path: '/bills' },
  { name: 'Credit Cards', path: '/credit-cards' },
  { name: 'Loans', path: '/loans' },
  { name: 'Settings', path: '/settings' }
]

const currentMonth = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const expenseData = computed(() => ({
  labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Others'],
  datasets: [{
    data: [1200, 450, 200, 150, 300, 250],
    backgroundColor: [
      '#6366f1',
      '#a855f7',
      '#3b82f6',
      '#10b981',
      '#f43f5e',
      '#f59e0b'
    ]
  }]
}))

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  // Load data from stores
  monthlyExpenses.value = 2550
  upcomingBills.value = 5
  activeSubscriptions.value = 8
  totalDebt.value = 15420
})
</script>
