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
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-24 pb-12 px-6">
      <div class="max-w-7xl mx-auto">
        <h1
          :class="[
            'text-3xl',
            'font-bold',
            'mb-4',
            isDark ? 'text-white' : 'text-gray-800'
          ]"
        >
          Subscriptions
        </h1>
        <GlassCard class="p-12 text-center">
          <EmptyState
            title="Subscriptions Coming Soon"
            message="Track all your recurring subscriptions and memberships in one place."
          />
        </GlassCard>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import Footer from '@/components/Footer.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>
