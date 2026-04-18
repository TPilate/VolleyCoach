<template>
  <div class="relative overflow-hidden rounded-2xl p-6 transition-all duration-300" :class="{
    'bg-linear-to-br from-surface-700/40 to-surface-800/40 backdrop-blur-xl': isDark,
    'bg-white/40 backdrop-blur-xl': !isDark,
  }">
    <!-- Header with Icon -->
    <div class="mb-4 flex items-center gap-3">
      <div class="flex size-10 items-center justify-center rounded-xl transition-colors duration-300" :class="isDark
          ? 'bg-primary-400/20 text-primary-400'
          : 'bg-primary-100 text-primary-600'
        ">
        <Icon :name="iconName" :size="20" />
      </div>
      <h4 class="font-inter text-sm font-semibold transition-colors duration-300"
        :class="isDark ? 'text-surface-300' : 'text-surface-600'">
        {{ label }}
      </h4>
    </div>

    <!-- Value -->
    <div class="flex flex-col gap-1">
      <p class="font-manrope text-3xl font-bold transition-colors duration-300"
        :class="isDark ? 'text-white' : 'text-surface-900'">
        {{ value }}
      </p>
      <p class="text-xs transition-colors duration-300" :class="isDark ? 'text-surface-500' : 'text-surface-500'">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'

const props = defineProps<{
  label: string
  value: string | number
  description?: string
  iconName: string
}>()

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>

<style scoped></style>
