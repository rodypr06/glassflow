<template>
  <GlassCard
    :class="[
      'relative',
      'overflow-hidden',
      'cursor-pointer',
      'group'
    ]"
    @click="refreshQuote"
  >
    <!-- Random gradient background -->
    <div
      :class="[
        'absolute',
        'inset-0',
        'opacity-20',
        'transition-all',
        'duration-700',
        gradientClass
      ]"
    ></div>

    <!-- Content -->
    <div class="relative z-10">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <!-- Quote Icon -->
          <svg
            class="w-8 h-8 mb-3 opacity-50"
            :class="isDark ? 'text-white' : 'text-gray-600'"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <!-- Quote Text -->
          <blockquote
            :class="[
              'text-lg',
              'font-medium',
              'leading-relaxed',
              'mb-3',
              isDark ? 'text-gray-100' : 'text-gray-800'
            ]"
          >
            "{{ currentQuote.text }}"
          </blockquote>

          <!-- Author -->
          <cite
            :class="[
              'block',
              'text-sm',
              'font-semibold',
              'not-italic',
              isDark ? 'text-indigo-400' : 'text-indigo-600'
            ]"
          >
            — {{ currentQuote.author }}
          </cite>
        </div>

        <!-- Refresh Button -->
        <button
          :class="[
            'p-2',
            'rounded-full',
            'transition-all',
            'duration-300',
            'group-hover:rotate-180',
            'hover:scale-110',
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-black/10 hover:bg-black/20 text-gray-600'
          ]"
          aria-label="Refresh quote"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </GlassCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import GlassCard from './GlassCard.vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const quotes = [
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "Beware of little expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "The rich invest their money and spend what is left. The poor spend their money and invest what is left.", author: "Robert Kiyosaki" },
  { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
  { text: "It's not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
  { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
  { text: "The art is not in making money, but in keeping it.", author: "Proverb" },
  { text: "A penny saved is a penny earned.", author: "Benjamin Franklin" },
  { text: "Don't work for money. Make it work for you.", author: "Robert Kiyosaki" },
  { text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought, and so broadens the mind.", author: "T.T. Munger" },
  { text: "Money grows on the tree of persistence.", author: "Japanese Proverb" },
  { text: "Time is more valuable than money. You can get more money, but you cannot get more time.", author: "Jim Rohn" },
  { text: "Invest in yourself. Your knowledge is the engine of your wealth.", author: "Robert Kiyosaki" },
  { text: "Compound interest is the eighth wonder of the world.", author: "Albert Einstein" }
]

const gradients = [
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-blue-500 to-cyan-500',
  'bg-gradient-to-br from-green-500 to-teal-500',
  'bg-gradient-to-br from-orange-500 to-red-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500',
  'bg-gradient-to-br from-pink-500 to-rose-500'
]

const currentQuote = ref(quotes[0])
const currentGradient = ref(0)
const loading = ref(false)

const gradientClass = computed(() => gradients[currentGradient.value])

function refreshQuote() {
  loading.value = true
  setTimeout(() => {
    // Pick a random quote different from current
    let newQuote
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)]
    } while (newQuote.text === currentQuote.value.text && quotes.length > 1)

    currentQuote.value = newQuote
    currentGradient.value = Math.floor(Math.random() * gradients.length)
    loading.value = false
  }, 500)
}

onMounted(() => {
  currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
  currentGradient.value = Math.floor(Math.random() * gradients.length)
})
</script>
