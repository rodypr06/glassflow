<template>
  <div
    :class="[
      'rounded-2xl',
      'p-6',
      'smooth-transition',
      'hover:scale-[1.02]',
      isDark ? 'glass-card-dark' : 'glass-card-light'
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>
