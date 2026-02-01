import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  const accentColor = ref('indigo')

  // Color palettes
  const colorPalettes = {
    indigo: {
      primary: '#6366f1',
      secondary: '#a855f7',
      name: 'Indigo Purple'
    },
    blue: {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      name: 'Ocean Blue'
    },
    emerald: {
      primary: '#10b981',
      secondary: '#06b6d4',
      name: 'Emerald Teal'
    },
    rose: {
      primary: '#f43f5e',
      secondary: '#fb923c',
      name: 'Rose Sunset'
    },
    amber: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      name: 'Amber Fire'
    }
  }

  const currentPalette = computed(() => colorPalettes[accentColor.value])

  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
    saveTheme()
  }

  function setDark(dark) {
    isDark.value = dark
    applyTheme()
    saveTheme()
  }

  function setAccentColor(color) {
    if (colorPalettes[color]) {
      accentColor.value = color
      applyTheme()
      saveTheme()
    }
  }

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Apply accent colors
    const palette = currentPalette.value
    document.documentElement.style.setProperty('--color-accent-primary', palette.primary)
    document.documentElement.style.setProperty('--color-accent-secondary', palette.secondary)
  }

  function saveTheme() {
    localStorage.setItem('glassflow-theme', JSON.stringify({
      isDark: isDark.value,
      accentColor: accentColor.value
    }))
  }

  function loadTheme() {
    const saved = localStorage.getItem('glassflow-theme')
    if (saved) {
      const { isDark: savedDark, accentColor: savedAccent } = JSON.parse(saved)
      isDark.value = savedDark
      accentColor.value = savedAccent || 'indigo'
    }
  }

  function initializeTheme() {
    loadTheme()
    applyTheme()
  }

  return {
    isDark,
    accentColor,
    currentPalette,
    colorPalettes,
    toggleTheme,
    setDark,
    setAccentColor,
    initializeTheme
  }
})
