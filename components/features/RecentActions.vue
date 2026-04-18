<template>
  <div class="relative overflow-hidden rounded-3xl p-8 transition-all duration-300" :class="{
    'bg-linear-to-br from-surface-700/40 to-surface-800/40 backdrop-blur-xl': isDark,
    'bg-white/40 backdrop-blur-xl': !isDark,
  }">
    <!-- Title -->
    <h3 class="mb-6 font-manrope text-xl font-semibold transition-colors duration-300"
      :class="isDark ? 'text-white' : 'text-surface-900'">
      Recent Actions
    </h3>

    <!-- Actions List -->
    <div class="space-y-4">
      <div v-for="action in actions" :key="action.id"
        class="flex items-center justify-between rounded-2xl p-4 transition-colors duration-300" :class="{
          'hover:bg-surface-700/30': isDark,
          'hover:bg-surface-100/50': !isDark,
        }">
        <!-- User Info -->
        <div class="flex items-center gap-3">
          <!-- User Avatar -->
          <div
            class="relative flex size-10 items-center justify-center rounded-full font-semibold transition-colors duration-300"
            :class="isDark
                ? 'bg-primary-400/20 text-primary-400'
                : 'bg-primary-100 text-primary-600'
              ">
            {{ action.userAvatar }}
          </div>

          <!-- User Details -->
          <div class="flex flex-col">
            <p class="text-sm font-semibold transition-colors duration-300"
              :class="isDark ? 'text-white' : 'text-surface-900'">
              {{ action.userName }}
            </p>
            <p class="text-xs transition-colors duration-300" :class="isDark ? 'text-surface-500' : 'text-surface-500'">
              {{ action.action }}
            </p>
          </div>
        </div>

        <!-- Points and Time -->
        <div class="flex flex-col items-end gap-1">
          <p class="text-sm font-semibold transition-colors duration-300" :class="getValueColor(action.type)">
            {{ action.value }}
          </p>
          <p class="text-xs transition-colors duration-300" :class="isDark ? 'text-surface-500' : 'text-surface-500'">
            {{ action.timestamp }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'
import type { RecentAction } from '~/stores/dashboardStore'

const props = defineProps<{
  actions: RecentAction[]
}>()

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const getValueColor = (type: string) => {
  const colorMap: Record<string, string> = {
    pass: isDark.value ? 'text-green-400' : 'text-green-600',
    error: isDark.value ? 'text-red-400' : 'text-red-600',
    block: isDark.value ? 'text-blue-400' : 'text-blue-600',
    kill: isDark.value ? 'text-orange-400' : 'text-orange-600',
  }
  return colorMap[type] || 'text-surface-400'
}
</script>

<style scoped></style>
