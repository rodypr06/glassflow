<template>
  <div
    id="app"
    :class="[
      'min-h-screen',
      'relative',
      'overflow-x-hidden',
      isDark ? 'dark' : '',
      'animated-bg'
    ]"
  >
    <!-- Floating Background Shapes -->
    <div class="floating-shape w-96 h-96 bg-purple-400 -top-48 -left-48 animate-float"></div>
    <div class="floating-shape w-72 h-72 bg-blue-400 top-1/4 -right-36 animate-float-delayed"></div>
    <div class="floating-shape w-64 h-64 bg-pink-400 bottom-1/4 -left-32 animate-float"></div>
    <div class="floating-shape w-80 h-80 bg-indigo-400 -bottom-40 right-1/4 animate-float-delayed"></div>

    <!-- Main Content -->
    <div class="relative z-10 min-h-screen">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

onMounted(() => {
  // Initialize theme from localStorage or system preference
  themeStore.initializeTheme()
})
</script>

<style>
#app {
  font-family: 'Inter', sans-serif;
}
</style>
