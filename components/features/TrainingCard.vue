<template>
  <div class="relative overflow-hidden rounded-3xl p-8 transition-all duration-300" :class="{
    'bg-linear-to-br from-surface-700/50 to-surface-800/50 backdrop-blur-2xl': isDark,
    'bg-white/50 backdrop-blur-2xl': !isDark,
  }">
    <!-- Background Elements -->
    <div class="absolute inset-0 pointer-events-none opacity-20"
      :class="isDark ? 'bg-primary-500/20' : 'bg-primary-100/20'" />

    <!-- Content -->
    <div class="relative z-10">
      <!-- Header with Time Badge -->
      <div class="mb-6 flex items-start justify-between">
        <h3 class="font-manrope text-2xl font-semibold transition-colors duration-300"
          :class="isDark ? 'text-white' : 'text-surface-900'">
          Next Training
        </h3>
        <div class="inline-flex items-center gap-2 rounded-full px-3 py-1 transition-colors duration-300" :class="{
          'bg-orange-600/40 text-orange-300': isDark,
          'bg-orange-100 text-orange-700': !isDark,
        }">
          <div class="size-2 rounded-full transition-colors duration-300"
            :class="isDark ? 'bg-orange-400' : 'bg-orange-500'" />
          <span class="text-xs font-semibold tracking-wider">
            {{ training?.date.toUpperCase() }} {{ training?.time }}
          </span>
        </div>
      </div>

      <!-- Training Title -->
      <div class="mb-6">
        <h4 class="font-inter text-xl font-medium transition-colors duration-300"
          :class="isDark ? 'text-primary-400' : 'text-primary-600'">
          {{ training?.teamName }}
        </h4>
      </div>

      <!-- Description -->
      <p class="mb-8 max-w-lg text-sm transition-colors duration-300"
        :class="isDark ? 'text-surface-400' : 'text-surface-600'">
        {{ training?.description }}
      </p>

      <!-- Court Visualization -->
      <div v-if="training?.court" class="relative mb-6 h-48 rounded-2xl border transition-colors duration-300" :class="{
        'border-surface-600/30 bg-surface-900/50': isDark,
        'border-surface-300/50 bg-surface-100/50': !isDark,
      }">
        <!-- Court Grid -->
        <div class="absolute inset-0 flex items-center justify-center">
          <!-- Simple Court Representation -->
          <div class="flex gap-4">
            <div class="rounded-lg border-2 transition-colors duration-300"
              :class="isDark ? 'border-surface-600' : 'border-surface-300'" style="width: 80px; height: 120px">
              <!-- Attackers -->
              <div v-for="(pos, idx) in training.court.positions.filter(
                (p) => p.type === 'attacker'
              )" :key="`attacker-${idx}`"
                class="absolute size-3 rounded-full bg-primary-400 transition-all duration-300" :style="{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }" />
            </div>
            <div class="rounded-lg border-2 transition-colors duration-300"
              :class="isDark ? 'border-surface-600' : 'border-surface-300'" style="width: 80px; height: 120px">
              <!-- Defenders -->
              <div v-for="(pos, idx) in training.court.positions.filter(
                (p) => p.type === 'defender'
              )" :key="`defender-${idx}`"
                class="absolute size-3 rounded-full bg-orange-400 transition-all duration-300" :style="{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'
import type { TrainingSession } from '~/stores/dashboardStore'

const props = defineProps<{
  training: TrainingSession | null
}>()

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>

<style scoped></style>
