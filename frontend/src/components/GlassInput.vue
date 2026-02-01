<template>
  <div class="w-full">
    <label
      v-if="label"
      :class="[
        'block',
        'text-sm',
        'font-medium',
        'mb-2',
        isDark ? 'text-gray-300' : 'text-gray-700'
      ]"
    >
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full',
        'px-4',
        'py-3',
        'rounded-xl',
        'outline-none',
        'smooth-transition',
        'focus:ring-2',
        'focus:ring-opacity-50',
        isDark ? 'glass-input-dark focus:ring-indigo-500 text-white' : 'glass-input-light focus:ring-indigo-500 text-gray-900',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed'
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>
