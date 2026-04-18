<template>
  <header class="fixed right-0 top-0 z-30 h-20 backdrop-blur-md transition-colors duration-300" :class="{
    'bg-black/40': isDark,
    'bg-white/80 dark:bg-surface-900/80': !isDark,
  }" style="width: calc(100% - 288px)">
    <div class="flex h-full items-center justify-between px-10">
      <!-- Left: Logo -->
      <h1 class="font-manrope text-2xl font-extrabold transition-colors duration-300"
        :class="isDark ? 'text-white' : 'text-surface-900'">
        VolleyCoach
      </h1>

      <!-- Right: Actions & User -->
      <div class="flex items-center gap-6">
        <!-- Notifications Button -->
        <button class="rounded-full p-2 transition-colors duration-300" :class="{
          'hover:bg-surface-700/50': isDark,
          'hover:bg-surface-200': !isDark,
        }" title="Notifications">
          <Icon name="mdi:bell" :size="20" :class="isDark ? 'text-surface-300' : 'text-surface-700'" />
        </button>

        <!-- Calendar Button -->
        <button class="rounded-full p-2 transition-colors duration-300" :class="{
          'hover:bg-surface-700/50': isDark,
          'hover:bg-surface-200': !isDark,
        }" title="Calendar">
          <Icon name="mdi:calendar" :size="20" :class="isDark ? 'text-surface-300' : 'text-surface-700'" />
        </button>

        <!-- New Session Button -->
        <button class="rounded-full px-4 py-2 font-semibold transition-colors duration-300" :class="{
          'bg-primary-400/10 text-primary-400 hover:bg-primary-400/20': true,
        }">
          <span class="text-sm">New Session</span>
        </button>

        <!-- Theme Toggle Button -->
        <button @click="themeStore.toggleTheme()" class="rounded-full p-2 transition-colors duration-300" :class="{
          'hover:bg-surface-700/50': isDark,
          'hover:bg-surface-200': !isDark,
        }" :title="isDark ? 'Light Mode' : 'Dark Mode'">
          <Icon :name="isDark ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'" :size="20"
            :class="isDark ? 'text-surface-300' : 'text-surface-700'" />
        </button>

        <!-- User Avatar -->
        <div class="relative size-10 overflow-hidden rounded-full bg-linear-to-br from-primary-400 to-primary-600">
          <img src="https://www.figma.com/api/mcp/asset/dde56009-b210-4d8d-9447-9b0234996013" alt="User Avatar"
            class="size-full object-cover" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()

const isDark = computed(() => themeStore.isDark)
</script>

<style scoped></style>
