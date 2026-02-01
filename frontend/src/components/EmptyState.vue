<template>
  <div
    :class="[
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'p-12',
      'text-center',
      isDark ? 'empty-state-dark' : 'empty-state-light'
    ]"
  >
    <!-- Icon or Illustration -->
    <div
      :class="[
        'mb-6',
        'flex',
        'items-center',
        'justify-center',
        'w-24',
        'h-24',
        'rounded-full',
        isDark ? 'empty-icon-dark' : 'empty-icon-light'
      ]"
    >
      <!-- Default: Empty Box Icon -->
      <svg
        v-if="!customIcon"
        class="w-12 h-12"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        ></path>
      </svg>

      <!-- Custom Icon Slot -->
      <slot v-else name="icon"></slot>
    </div>

    <!-- Title -->
    <h3
      :class="[
        'text-xl',
        'font-semibold',
        'mb-2',
        isDark ? 'text-gray-200' : 'text-gray-900'
      ]"
    >
      {{ title }}
    </h3>

    <!-- Description -->
    <p
      :class="[
        'max-w-md',
        'mb-6',
        isDark ? 'text-gray-400' : 'text-gray-500'
      ]"
    >
      {{ description }}
    </p>

    <!-- Action Button -->
    <GlassButton
      v-if="actionLabel"
      @click="$emit('action')"
      :size="actionSize"
    >
      <component :is="actionIcon" v-if="actionIcon" class="w-5 h-5 mr-2" />
      {{ actionLabel }}
    </GlassButton>

    <!-- Custom Content Slot -->
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import GlassButton from './GlassButton.vue'

defineEmits(['action'])

const props = defineProps({
  title: {
    type: String,
    default: 'No items found'
  },
  description: {
    type: String,
    default: 'There are no items to display at the moment.'
  },
  actionLabel: {
    type: String,
    default: ''
  },
  actionSize: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  actionIcon: {
    type: [Object, Function],
    default: null
  },
  customIcon: {
    type: Boolean,
    default: false
  }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>

<style scoped>
/* Empty State - Light Theme */
.empty-state-light {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.empty-icon-light {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

/* Empty State - Dark Theme */
.empty-state-dark {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-icon-dark {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15));
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
}
</style>
