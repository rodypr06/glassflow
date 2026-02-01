<template>
  <GlassCard class="h-full">
    <div v-if="title" class="mb-4">
      <h3
        :class="[
          'text-lg',
          'font-semibold',
          isDark ? 'text-white' : 'text-gray-800'
        ]"
      >
        {{ title }}
      </h3>
      <p v-if="subtitle" :class="['text-sm', 'mt-1', isDark ? 'text-gray-400' : 'text-gray-500']">
        {{ subtitle }}
      </p>
    </div>

    <div class="relative" :style="{ height: height }">
      <canvas v-if="chartData" ref="chartCanvas"></canvas>
      <div v-else class="flex items-center justify-center h-full">
        <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-500']">
          No data available
        </p>
      </div>
    </div>
  </GlassCard>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import GlassCard from './GlassCard.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  type: {
    type: String,
    default: 'bar',
    validator: (value) => ['line', 'bar', 'pie', 'doughnut'].includes(value)
  },
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '300px'
  }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const chartCanvas = ref(null)
let chartInstance = null

const chartData = computed(() => {
  if (!props.data.labels || !props.data.datasets) return null

  return {
    labels: props.data.labels,
    datasets: props.data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || getDefaultColors(dataset.data?.length || 1),
      borderColor: dataset.borderColor || getDefaultColors(dataset.data?.length || 1, true),
      borderWidth: dataset.borderWidth || 2,
      tension: dataset.tension ?? 0.4,
      fill: dataset.fill ?? false
    }))
  }
})

const chartOptions = computed(() => {
  const textColor = isDark.value ? '#e5e7eb' : '#374151'
  const gridColor = isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: props.type === 'pie' || props.type === 'doughnut',
        position: 'bottom',
        labels: {
          color: textColor,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: props.type === 'pie' || props.type === 'doughnut' ? {} : {
      x: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        }
      },
      y: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        },
        beginAtZero: true
      }
    }
  }

  return { ...defaultOptions, ...props.options }
})

function getDefaultColors(count, lighten = false) {
  const colors = [
    '#6366f1', // Indigo
    '#a855f7', // Purple
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f43f5e', // Rose
    '#f59e0b', // Amber
    '#06b6d4', // Cyan
    '#ec4899'  // Pink
  ]

  if (count === 1) return colors[0]

  const result = []
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length])
  }
  return result
}

function createChart() {
  if (!chartCanvas.value || !chartData.value) return

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new ChartJS(ctx, {
    type: props.type,
    data: chartData.value,
    options: chartOptions.value
  })
}

function updateChart() {
  if (chartInstance) {
    chartInstance.data = chartData.value
    chartInstance.options = chartOptions.value
    chartInstance.update()
  }
}

watch([chartData, chartOptions, isDark], () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  // Small delay to ensure canvas is ready
  setTimeout(createChart, 100)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
