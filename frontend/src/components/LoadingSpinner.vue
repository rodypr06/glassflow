<template>
  <div class="flex flex-col items-center justify-center p-8">
    <!-- Glassmorphic Spinner -->
    <div
      :class="[
        'relative',
        'w-16',
        'h-16',
        'rounded-full',
        isDark ? 'glass-spinner-dark' : 'glass-spinner-light'
      ]"
    >
      <!-- Animated border -->
      <div
        :class="[
          'absolute',
          'inset-0',
          'rounded-full',
          'animate-spin',
          isDark ? 'spinner-border-dark' : 'spinner-border-light'
        ]"
        style="border-top-color: transparent; border-right-color: transparent;"
      ></div>

      <!-- Inner circle -->
      <div
        :class="[
          'absolute',
          'top-2',
          'left-2',
          'right-2',
          'bottom-2',
          'rounded-full',
          isDark ? 'bg-gray-800' : 'bg-white/50'
        ]"
      ></div>
    </div>

    <!-- Loading message -->
    <p
      v-if="message"
      :class="[
        'mt-4',
        'text-sm',
        'font-medium',
        isDark ? 'text-gray-300' : 'text-gray-600'
      ]"
    >
      {{ message }}
    </p>

    <!-- Optional: Subtitle -->
    <p
      v-if="subtitle"
      :class="[
        'mt-2',
        'text-xs',
        isDark ? 'text-gray-500' : 'text-gray-400'
      ]"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

defineProps({
  message: {
    type: String,
    default: 'Loading...'
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>

<style scoped>
/* Glass Spinner - Light Theme */
.glass-spinner-light {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.spinner-border-light {
  border: 3px solid var(--color-accent-primary, #6366f1);
  opacity: 0.8;
}

/* Glass Spinner - Dark Theme */
.glass-spinner-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.spinner-border-dark {
  border: 3px solid var(--color-accent-primary, #6366f1);
  opacity: 0.6;
}
</style>
