<template>
  <Teleport to="body">
    <Transition
      enter-active-class="toast-enter"
      enter-from-class="toast-enter-from"
      enter-to-class="toast-enter-to"
      leave-active-class="toast-leave"
      leave-from-class="toast-leave-from"
      leave-to-class="toast-leave-to"
    >
      <div
        v-if="show"
        :class="[
          'fixed',
          'top-4',
          'right-4',
          'z-50',
          'max-w-sm',
          'w-full',
          'p-4',
          'rounded-xl',
          'shadow-xl',
          'flex',
          'items-start',
          'gap-3',
          isDark ? 'toast-dark' : 'toast-light',
          variantClass
        ]"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5">
          <!-- Success Icon -->
          <svg
            v-if="variant === 'success'"
            class="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>

          <!-- Error Icon -->
          <svg
            v-else-if="variant === 'error'"
            class="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>

          <!-- Warning Icon -->
          <svg
            v-else-if="variant === 'warning'"
            class="w-6 h-6 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>

          <!-- Info Icon -->
          <svg
            v-else
            class="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- Title -->
          <h4
            v-if="title"
            :class="[
              'font-semibold',
              'text-sm',
              'mb-1',
              isDark ? 'text-gray-200' : 'text-gray-900'
            ]"
          >
            {{ title }}
          </h4>

          <!-- Message -->
          <p
            :class="[
              'text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            ]"
          >
            {{ message }}
          </p>
        </div>

        <!-- Dismiss Button -->
        <button
          @click="dismiss"
          :class="[
            'flex-shrink-0',
            'p-1',
            'rounded-lg',
            'hover:bg-black/10',
            'dark:hover:bg-white/10',
            'transition-colors'
          ]"
        >
          <svg
            class="w-5 h-5"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <!-- Progress Bar -->
        <div
          v-if="showProgress && duration > 0"
          class="absolute bottom-0 left-0 h-1 rounded-b-xl transition-all ease-linear"
          :style="{ width: progressPercent + '%', backgroundColor: progressColor }"
        ></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  },
  showProgress: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['dismiss'])

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const progressPercent = ref(100)
const timer = ref(null)
const progressTimer = ref(null)

const variantClass = computed(() => {
  const variants = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-yellow-500',
    info: 'border-l-4 border-blue-500'
  }
  return variants[props.variant]
})

const progressColor = computed(() => {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }
  return colors[props.variant]
})

const dismiss = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
  }
  emit('dismiss')
}

const startProgress = () => {
  if (props.duration <= 0) return

  const interval = 50
  const decrement = (interval / props.duration) * 100

  progressTimer.value = setInterval(() => {
    progressPercent.value = Math.max(0, progressPercent.value - decrement)
  }, interval)
}

const stopProgress = () => {
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    progressPercent.value = 100
    startProgress()

    if (props.duration > 0) {
      timer.value = setTimeout(() => {
        dismiss()
      }, props.duration)
    }
  } else {
    stopProgress()
  }
})

onUnmounted(() => {
  dismiss()
})
</script>

<style scoped>
/* Toast - Light Theme */
.toast-light {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Toast - Dark Theme */
.toast-dark {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Slide-in animation */
.toast-enter {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
