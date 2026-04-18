<template>
  <div class="mx-auto max-w-6xl">
    <!-- Welcome Header -->
    <div class="mb-12">
      <h1 class="mb-2 font-manrope text-5xl font-bold tracking-tight transition-colors duration-300"
        :class="isDark ? 'text-white' : 'text-surface-900'">
        Welcome back, Coach {{ dashboardStore.coachName }}
      </h1>
      <p class="font-inter text-lg transition-colors duration-300"
        :class="isDark ? 'text-surface-400' : 'text-surface-600'">
        Ready to optimize today's performance.
      </p>
    </div>

    <!-- Bento Grid Layout -->
    <div class="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Next Training Card - Large (2 columns) -->
      <div class="lg:col-span-2">
        <TrainingCard :training="dashboardStore.upcomingTraining" />
      </div>

      <!-- Metric Cards Column -->
      <div class="flex flex-col gap-6">
        <MetricCard label="Active Players" :value="dashboardStore.stats.activePlayersCount" icon-name="mdi:people" />
        <MetricCard label="Exercises in Library" :value="dashboardStore.stats.exercisesInLibraryCount"
          icon-name="mdi:book" />
      </div>
    </div>

    <!-- Bottom Row: Performance & Recent Actions -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Performance Chart -->
      <PerformanceChart :win-rate="dashboardStore.stats.winRate"
        :performance-metrics="dashboardStore.stats.performanceMetrics" />

      <!-- Recent Actions -->
      <RecentActions :actions="dashboardStore.stats.recentActions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useThemeStore } from '~/stores/themeStore'
import { useDashboardStore } from '~/stores/dashboardStore'

// Initialize stores
const themeStore = useThemeStore()
const dashboardStore = useDashboardStore()

// Initialize dashboard on mount
onMounted(() => {
  dashboardStore.initializeDashboard()
})

const isDark = computed(() => themeStore.isDark)

// Meta tags
useHead({
  title: 'Dashboard - VolleyCoach',
  meta: [
    {
      name: 'description',
      content: 'VolleyCoach Dashboard - Manage your volleyball team and training sessions',
    },
  ],
})
</script>

<style scoped>
/* Dashboard page specific styles */
</style>
