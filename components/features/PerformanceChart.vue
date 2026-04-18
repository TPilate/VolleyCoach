<template>
  <div class="relative overflow-hidden rounded-3xl p-8 transition-all duration-300" :class="{
    'bg-linear-to-br from-surface-700/40 to-surface-800/40 backdrop-blur-xl': isDark,
    'bg-white/40 backdrop-blur-xl': !isDark,
  }">
    <!-- Title -->
    <h3 class="mb-6 font-manrope text-xl font-semibold transition-colors duration-300"
      :class="isDark ? 'text-white' : 'text-surface-900'">
      Team Performance
    </h3>

    <!-- Performance Stats -->
    <div class="mb-8 space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold transition-colors duration-300"
          :class="isDark ? 'text-surface-400' : 'text-surface-600'">
          Win Rate
        </span>
        <span class="font-manrope text-2xl font-bold transition-colors duration-300"
          :class="isDark ? 'text-primary-400' : 'text-primary-600'">
          {{ winRate }}
        </span>
      </div>
      <p class="text-xs transition-colors duration-300" :class="isDark ? 'text-surface-500' : 'text-surface-500'">
        Last 10 Matches
      </p>
    </div>

    <!-- Chart Bars -->
    <div class="flex items-end justify-between gap-2">
      <div v-for="(metric, idx) in performanceMetrics" :key="idx" class="flex flex-1 flex-col items-center gap-2">
        <!-- Bar -->
        <div class="relative h-32 w-full overflow-hidden rounded-lg transition-colors duration-300" :class="{
          'bg-surface-700/30': isDark,
          'bg-surface-200/30': !isDark,
        }">
          <div class="absolute bottom-0 w-full rounded-lg transition-all duration-500"
            :class="getBarColor(metric.color)" :style="{ height: `${(metric.value / 100) * 100}%` }" />
        </div>
        <p class="text-xs font-semibold transition-colors duration-300"
          :class="isDark ? 'text-surface-400' : 'text-surface-600'">
          {{ metric.value }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'
import type { PerformanceMetric } from '~/stores/dashboardStore'

const props = defineProps<{
  winRate: string
  performanceMetrics: PerformanceMetric[]
}>()

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const getBarColor = (color: string) => {
  const colorMap: Record<string, { dark: string; light: string }> = {
    primary: {
      dark: 'bg-primary-400',
      light: 'bg-primary-600',
    },
    orange: {
      dark: 'bg-orange-400',
      light: 'bg-orange-600',
    },
    blue: {
      dark: 'bg-blue-400',
      light: 'bg-blue-600',
    },
    gray: {
      dark: 'bg-surface-500',
      light: 'bg-surface-500',
    },
  }

  const colors = colorMap[color] || colorMap.primary
  return isDark.value ? colors.dark : colors.light
}
</script>

<style scoped></style>
