<template>
  <div class="fixed left-0 top-0 z-40 h-screen w-72 backdrop-blur-xl transition-colors duration-300" :class="{
    'bg-black/60 dark:bg-black/80': isDark,
    'bg-white/95 dark:bg-surface-900/95': !isDark,
  }" data-node-id="1:640">
    <!-- Sidebar Content -->
    <div class="flex h-full flex-col p-6">
      <!-- Header: Coach Profile -->
      <div class="mb-8 flex items-center gap-4">
        <div class="relative size-12 overflow-hidden rounded-full bg-linear-to-br from-primary-400 to-primary-600">
          <img src="https://www.figma.com/api/mcp/asset/9706bb80-d82d-417e-b522-88a8905815dc" alt="Coach Profile"
            class="size-full object-cover" />
        </div>
        <div class="flex flex-col">
          <h2 class="font-manrope text-xl font-bold transition-colors duration-300"
            :class="isDark ? 'text-white' : 'text-surface-900'">
            VolleyCoach
          </h2>
          <p class="text-sm transition-colors duration-300" :class="isDark ? 'text-surface-400' : 'text-surface-600'">
            Elite Performance
          </p>
        </div>
      </div>

      <!-- Start Match Button -->
      <button
        class="mb-8 w-full rounded-full bg-linear-to-r from-primary-600 to-primary-400 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:from-primary-700 hover:to-primary-500">
        Start Match
      </button>

      <!-- Main Navigation -->
      <nav class="mb-auto flex flex-1 flex-col gap-2">
        <!-- Dashboard Link (Active) -->
        <NuxtLink to="/" class="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300" :class="{
          'bg-surface-700/50 text-primary-400': currentRoute === 'dashboard',
          'text-surface-400 hover:bg-surface-700/30': currentRoute !== 'dashboard',
        }">
          <Icon name="mdi:view-dashboard" :size="20" :class="currentRoute === 'dashboard'
            ? 'text-primary-400'
            : 'text-surface-500'
            " />
          <span class="font-semibold transition-colors duration-300" :class="{
            'text-primary-400': currentRoute === 'dashboard',
            'text-surface-200': !isDark && currentRoute !== 'dashboard',
            'text-surface-300': isDark && currentRoute !== 'dashboard',
          }">
            Dashboard
          </span>
        </NuxtLink>

        <!-- Teams Link -->
        <NuxtLink to="/teams" class="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300" :class="{
          'text-surface-400 hover:bg-surface-700/30': true,
        }">
          <Icon name="mdi:people" :size="20" :class="isDark ? 'text-surface-500' : 'text-surface-600'
            " />
          <span class="font-semibold transition-colors duration-300"
            :class="isDark ? 'text-surface-300' : 'text-surface-400'">
            Teams
          </span>
        </NuxtLink>

        <!-- Training Link -->
        <NuxtLink to="/training" class="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
          :class="{
            'text-surface-400 hover:bg-surface-700/30': true,
          }">
          <Icon name="mdi:dumbbell" :size="20" :class="isDark ? 'text-surface-500' : 'text-surface-600'
            " />
          <span class="font-semibold transition-colors duration-300"
            :class="isDark ? 'text-surface-300' : 'text-surface-400'">
            Training
          </span>
        </NuxtLink>

        <!-- Exercises Link -->
        <NuxtLink to="/exercises" class="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
          :class="{
            'text-surface-400 hover:bg-surface-700/30': true,
          }">
          <Icon name="mdi:book" :size="20" :class="isDark ? 'text-surface-500' : 'text-surface-600'
            " />
          <span class="font-semibold transition-colors duration-300"
            :class="isDark ? 'text-surface-300' : 'text-surface-400'">
            Exercises
          </span>
        </NuxtLink>
      </nav>

      <!-- Footer Navigation -->
      <div class="flex flex-col gap-2 border-t pt-6 transition-colors duration-300"
        :class="isDark ? 'border-surface-700' : 'border-surface-200'">
        <!-- Settings Link -->
        <NuxtLink to="/settings" class="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
          :class="{
            'text-surface-400 hover:bg-surface-700/30': true,
          }">
          <Icon name="mdi:cog" :size="20" :class="isDark ? 'text-surface-500' : 'text-surface-600'
            " />
          <span class="font-semibold transition-colors duration-300"
            :class="isDark ? 'text-surface-300' : 'text-surface-400'">
            Settings
          </span>
        </NuxtLink>

        <!-- Support Link -->
        <NuxtLink to="/support" class="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
          :class="{
            'text-surface-400 hover:bg-surface-700/30': true,
          }">
          <Icon name="mdi:help-circle" :size="20" :class="isDark ? 'text-surface-500' : 'text-surface-600'
            " />
          <span class="font-semibold transition-colors duration-300"
            :class="isDark ? 'text-surface-300' : 'text-surface-400'">
            Support
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'
import { useRoute } from 'vue-router'

const themeStore = useThemeStore()
const route = useRoute()

const isDark = computed(() => themeStore.isDark)

const currentRoute = computed(() => {
  const path = route.path
  if (path === '/' || path === '/dashboard') return 'dashboard'
  return path.split('/')[1]
})
</script>

<style scoped>
/* Smooth transitions for theme changes */
</style>
