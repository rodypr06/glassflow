<template>
  <button
    :class="[
      'px-6',
      'py-3',
      'rounded-xl',
      'font-semibold',
      'text-white',
      'shadow-lg',
      'hover:shadow-xl',
      'smooth-transition',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      isDark ? 'glass-btn-dark' : 'glass-btn-light',
      sizeClass
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="flex items-center gap-2">
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <slot />
    </span>
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

defineEmits(['click'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const sizeClass = computed(() => {
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3',
    large: 'px-8 py-4 text-lg'
  }
  return sizes[props.size]
})
</script>
