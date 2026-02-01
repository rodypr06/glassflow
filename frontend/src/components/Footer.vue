<template>
  <footer
    :class="[
      'text-center',
      'py-6',
      'mt-auto',
      isDark ? 'glass-nav-dark' : 'glass-nav-light',
      isDark ? 'text-gray-300' : 'text-gray-600'
    ]"
  >
    <div class="glass-card-light dark:glass-card-dark inline-block px-6 py-3 rounded-xl">
      <p class="text-sm font-medium">
        Made with <span class="text-red-500">♥</span> by
        <a
          href="https://rodytech.net"
          target="_blank"
          rel="noopener noreferrer"
          class="text-indigo-500 hover:text-indigo-400 transition-colors font-semibold"
        >
          RodyTech
        </a>
      </p>
      <p class="text-xs mt-1 opacity-70">
        © {{ currentYear }} GlassFlow
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const currentYear = computed(() => new Date().getFullYear())
</script>
