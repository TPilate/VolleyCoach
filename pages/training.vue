<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="font-manrope text-5xl font-bold tracking-tight transition-colors duration-300"
      :class="isDark ? 'text-white' : 'text-surface-900'">
      Training Sessions
    </h1>
    <p class="font-inter text-lg transition-colors duration-300 mt-2"
      :class="isDark ? 'text-surface-400' : 'text-surface-600'">
      Plan and manage training sessions.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

useHead({
  title: 'Training Sessions - VolleyCoach',
  meta: [
    {
      name: 'description',
      content: 'Plan and manage training sessions',
    },
  ],
})
</script>
