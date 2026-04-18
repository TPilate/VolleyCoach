<template>
  <div class="min-h-screen transition-colors duration-300" :class="{
    'bg-linear-to-br from-surface-900 via-surface-800 to-surface-900': isDark,
    'bg-linear-to-br from-surface-50 via-surface-100 to-surface-50': !isDark,
  }">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Navbar -->
    <Navbar />

    <!-- Page Content -->
    <main class="ml-72 mt-20 p-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>

<style scoped>
/* Default layout styles */
</style>
