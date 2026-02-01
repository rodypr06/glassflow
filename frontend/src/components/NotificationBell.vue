<template>
  <div class="relative" ref="dropdownRef">
    <!-- Bell Button -->
    <button
      @click="toggleDropdown"
      :class="[
        'relative',
        'p-2',
        'rounded-xl',
        'transition-all',
        'hover:scale-105',
        isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
      ]"
    >
      <!-- Bell Icon -->
      <svg
        class="w-6 h-6"
        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        ></path>
      </svg>

      <!-- Badge Count -->
      <span
        v-if="unreadCount > 0"
        :class="[
          'absolute',
          '-top-1',
          '-right-1',
          'min-w-[20px]',
          'h-5',
          'px-1',
          'flex',
          'items-center',
          'justify-center',
          'text-xs',
          'font-bold',
          'text-white',
          'rounded-full',
          unreadCount > 9 ? 'text-[10px]' : 'text-xs'
        ]"
        style="background: linear-gradient(135deg, #ef4444, #dc2626);"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="dropdown-enter"
      enter-from-class="dropdown-enter-from"
      enter-to-class="dropdown-enter-to"
      leave-active-class="dropdown-leave"
      leave-from-class="dropdown-leave-from"
      leave-to-class="dropdown-leave-to"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute',
          'right-0',
          'mt-2',
          'w-80',
          'max-h-96',
          'overflow-y-auto',
          'rounded-2xl',
          'shadow-2xl',
          'z-50',
          isDark ? 'notification-dropdown-dark' : 'notification-dropdown-light'
        ]"
      >
        <!-- Header -->
        <div
          :class="[
            'sticky',
            'top-0',
            'px-4',
            'py-3',
            'border-b',
            'flex',
            'items-center',
            'justify-between',
            isDark ? 'border-white/10' : 'border-black/10'
          ]"
        >
          <h3
            :class="[
              'font-semibold',
              isDark ? 'text-gray-200' : 'text-gray-900'
            ]"
          >
            Notifications
          </h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            :class="[
              'text-xs',
              'font-medium',
              'px-2',
              'py-1',
              'rounded-lg',
              'transition-colors',
              isDark ? 'text-blue-400 hover:bg-white/10' : 'text-blue-600 hover:bg-black/5'
            ]"
          >
            Mark all read
          </button>
        </div>

        <!-- Notifications List -->
        <div v-if="notifications.length > 0">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            :class="[
              'px-4',
              'py-3',
              'border-b',
              'cursor-pointer',
              'transition-colors',
              'hover:bg-black/5',
              'dark:hover:bg-white/5',
              'last:border-b-0',
              !notification.read ? isDark ? 'bg-white/5' : 'bg-blue-50/50' : '',
              isDark ? 'border-white/5' : 'border-black/5'
            ]"
          >
            <div class="flex items-start gap-3">
              <!-- Notification Icon -->
              <div
                :class="[
                  'w-8',
                  'h-8',
                  'rounded-full',
                  'flex',
                  'items-center',
                  'justify-center',
                  'flex-shrink-0',
                  getNotificationIconClass(notification.type)
                ]"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="getNotificationIconPath(notification.type)"
                  ></path>
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'text-sm',
                    'font-medium',
                    'truncate',
                    !notification.read ? isDark ? 'text-white' : 'text-gray-900' : isDark ? 'text-gray-300' : 'text-gray-600'
                  ]"
                >
                  {{ notification.title }}
                </p>
                <p
                  :class="[
                    'text-xs',
                    'mt-0.5',
                    'truncate',
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  ]"
                >
                  {{ notification.message }}
                </p>
                <p
                  :class="[
                    'text-xs',
                    'mt-1',
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  ]"
                >
                  {{ formatRelativeTime(notification.createdAt) }}
                </p>
              </div>

              <!-- Delete Button -->
              <button
                @click.stop="deleteNotification(notification.id)"
                :class="[
                  'p-1',
                  'rounded-lg',
                  'transition-colors',
                  'hover:bg-red-500/10',
                  'hover:text-red-500',
                  isDark ? 'text-gray-500' : 'text-gray-400'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="px-4 py-12 text-center"
        >
          <svg
            class="w-12 h-12 mx-auto mb-3"
            :class="isDark ? 'text-gray-600' : 'text-gray-400'"
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
          <p
            :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-500']"
          >
            No notifications yet
          </p>
        </div>

        <!-- Footer -->
        <div
          v-if="notifications.length > 0"
          :class="[
            'sticky',
            'bottom-0',
            'px-4',
            'py-3',
            'border-t',
            'text-center',
            isDark ? 'border-white/10 bg-black/50' : 'border-black/10 bg-white/50'
          ]"
        >
          <router-link
            to="/settings"
            @click="closeDropdown"
            :class="[
              'text-sm',
              'font-medium',
              'transition-colors',
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            ]"
          >
            View all notifications
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { notificationsAPI } from '@/services/api'

const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const isOpen = ref(false)
const dropdownRef = ref(null)
const notifications = ref([])
const refreshInterval = ref(null)

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const fetchNotifications = async () => {
  try {
    const response = await notificationsAPI.getNotifications()
    notifications.value = response.data || response
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  }
}

const markAsRead = async (id) => {
  try {
    await notificationsAPI.markAsRead(id)
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await notificationsAPI.markAllAsRead()
    notifications.value.forEach(n => n.read = true)
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

const deleteNotification = async (id) => {
  try {
    // Note: API should support deletion
    notifications.value = notifications.value.filter(n => n.id !== id)
  } catch (error) {
    console.error('Failed to delete notification:', error)
  }
}

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }

  if (notification.link) {
    router.push(notification.link)
  } else if (notification.action) {
    // Handle action if needed
  }

  closeDropdown()
}

const getNotificationIconClass = (type) => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    bill: 'bg-purple-500',
    subscription: 'bg-pink-500',
    membership: 'bg-indigo-500'
  }
  return classes[type] || 'bg-gray-500'
}

const getNotificationIconPath = (type) => {
  const paths = {
    success: 'M5 13l4 4L19 7',
    error: 'M6 18L18 6M6 6l12 12',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    bill: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    subscription: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    membership: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  }
  return paths[type] || paths.info
}

const formatRelativeTime = (date) => {
  const now = new Date()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const diffMs = now - dateObj
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  fetchNotifications()
  document.addEventListener('click', handleClickOutside)

  // Auto-refresh notifications every 30 seconds
  refreshInterval.value = setInterval(fetchNotifications, 30000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
/* Dropdown - Light Theme */
.notification-dropdown-light {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Dropdown - Dark Theme */
.notification-dropdown-dark {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Dropdown animations */
.dropdown-enter {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-leave {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}
</style>
