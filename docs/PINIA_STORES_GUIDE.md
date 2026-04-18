# VolleyCoach Pinia Stores Usage Guide

## Overview
Two Pinia stores manage application state: `themeStore` (UI theme) and `dashboardStore` (dashboard data).

## Theme Store

### Location
`stores/themeStore.ts`

### State
```typescript
isDark: boolean  // Current theme state (false = light, true = dark)
```

### Methods

#### `initializeTheme()`
Initialize theme from localStorage or system preference.
```typescript
const themeStore = useThemeStore()
themeStore.initializeTheme()  // Runs automatically on app startup
```

#### `toggleTheme()`
Switch between light and dark mode.
```typescript
const themeStore = useThemeStore()
themeStore.toggleTheme()  // Switches isDark.value and updates DOM
```

#### `setTheme(theme: 'light' | 'dark')`
Set specific theme.
```typescript
const themeStore = useThemeStore()
themeStore.setTheme('dark')   // Switch to dark mode
themeStore.setTheme('light')  // Switch to light mode
```

#### `watchSystemPreference()`
Watch for system theme changes.
```typescript
const themeStore = useThemeStore()
themeStore.watchSystemPreference()  // Called automatically on app startup
```

#### `applyTheme()`
Apply current theme to DOM and save to localStorage.
```typescript
// Called automatically by toggleTheme() and setTheme()
// No need to call manually
```

### Usage in Components

#### Example 1: Using Theme Store in Navbar
```vue
<template>
  <header :class="isDark ? 'bg-surface-900' : 'bg-white'">
    <button @click="themeStore.toggleTheme()">
      {{ isDark ? '☀️ Light' : '🌙 Dark' }}
    </button>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>
```

#### Example 2: Conditional Rendering Based on Theme
```vue
<template>
  <div v-if="isDark" class="dark-mode-specific-content">
    Only visible in dark mode
  </div>
  <div v-else class="light-mode-specific-content">
    Only visible in light mode
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>
```

#### Example 3: Conditional CSS Classes
```vue
<template>
  <div :class="isDark ? 'text-white' : 'text-black'">
    Text that changes color with theme
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>
```

### How It Works

1. **App Startup**
   - `theme.ts` plugin runs
   - Calls `themeStore.initializeTheme()`
   - Checks localStorage for saved theme
   - If not found, checks system preference
   - Applies theme via `applyTheme()`

2. **User Clicks Theme Toggle**
   - `@click="themeStore.toggleTheme()"` fires
   - `isDark.value` flips (true → false or false → true)
   - `applyTheme()` adds/removes 'dark' class from `<html>`
   - Tailwind re-applies styles based on 'dark' class
   - All components reactively update (via computed `isDark`)

3. **Page Refresh**
   - `applyTheme()` saved preference to localStorage
   - `theme.ts` plugin loads saved preference
   - Theme is restored

---

## Dashboard Store

### Location
`stores/dashboardStore.ts`

### State
```typescript
coachName: string                    // "Sarah"
upcomingTraining: TrainingSession    // Null or training object
stats: DashboardStats               // Metrics and recent actions
```

### Interfaces

#### TrainingSession
```typescript
interface TrainingSession {
  id: string
  title: string
  date: string
  time: string
  teamName: string
  description: string
  courtPositions: {
    attackers: Position[]
    defenders: Position[]
  }
}

interface Position {
  x: number
  y: number
  name: string
}
```

#### DashboardStats
```typescript
interface DashboardStats {
  activePlayersCount: number
  exercisesInLibraryCount: number
  winRate: string
  lastMatchesCount: number
  recentActions: RecentAction[]
  performanceMetrics: PerformanceMetric[]
}

interface RecentAction {
  id: string
  userName: string
  userAvatar: string
  action: string
  type: 'pass' | 'error' | 'block' | 'kill'
  value: string
  timestamp: string
}

interface PerformanceMetric {
  label: string
  value: number
  color: 'primary' | 'gray' | 'orange' | 'blue'
}
```

### Methods

#### `initializeDashboard()`
Initialize dashboard with mock or fetched data.
```typescript
const dashboardStore = useDashboardStore()
dashboardStore.initializeDashboard()
// Populates: coachName, upcomingTraining, stats
```

#### `fetchDashboardData()`
Placeholder for API integration.
```typescript
const dashboardStore = useDashboardStore()
// Currently returns mock data
// Future: Connect to backend API
```

### Usage in Components

#### Example 1: Display Coach Name
```vue
<template>
  <h1>Welcome back, Coach {{ coachName }}</h1>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '~/stores/dashboardStore'

const dashboardStore = useDashboardStore()
const coachName = computed(() => dashboardStore.coachName)
</script>
```

#### Example 2: Display Metrics
```vue
<template>
  <div class="metrics">
    <p>Active Players: {{ stats.activePlayersCount }}</p>
    <p>Exercises: {{ stats.exercisesInLibraryCount }}</p>
    <p>Win Rate: {{ stats.winRate }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '~/stores/dashboardStore'

const dashboardStore = useDashboardStore()
const stats = computed(() => dashboardStore.stats)
</script>
```

#### Example 3: Display Recent Actions
```vue
<template>
  <div class="actions">
    <div v-for="action in recentActions" :key="action.id">
      <span>{{ action.userName }}: {{ action.action }}</span>
      <span :class="`text-${getActionColor(action.type)}`">
        {{ action.value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '~/stores/dashboardStore'

const dashboardStore = useDashboardStore()
const recentActions = computed(() => dashboardStore.stats.recentActions)

const getActionColor = (type: string) => {
  const colors = {
    pass: 'green',
    error: 'red',
    block: 'blue',
    kill: 'orange'
  }
  return colors[type] || 'gray'
}
</script>
```

#### Example 4: Initialize on Mount
```vue
<template>
  <div v-if="loaded" class="dashboard">
    <!-- Dashboard content -->
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '~/stores/dashboardStore'

const dashboardStore = useDashboardStore()
const loaded = ref(false)

onMounted(() => {
  dashboardStore.initializeDashboard()
  loaded.value = true
})
</script>
```

---

## Integration Example: Full Component

```vue
<template>
  <div :class="isDark ? 'dark' : 'light'" class="dashboard">
    <!-- Header with Theme Toggle -->
    <header :class="isDark ? 'bg-surface-900' : 'bg-white'">
      <h1>Welcome back, Coach {{ coachName }}</h1>
      <button @click="themeStore.toggleTheme()">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </header>

    <!-- Stats -->
    <section class="stats">
      <p>Active Players: {{ stats.activePlayersCount }}</p>
      <p>Win Rate: {{ stats.winRate }}</p>
    </section>

    <!-- Recent Actions -->
    <section class="actions">
      <div v-for="action in stats.recentActions" :key="action.id">
        {{ action.userName }}: {{ action.value }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useThemeStore } from '~/stores/themeStore'
import { useDashboardStore } from '~/stores/dashboardStore'

// Theme Store
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

// Dashboard Store
const dashboardStore = useDashboardStore()
const coachName = computed(() => dashboardStore.coachName)
const stats = computed(() => dashboardStore.stats)

onMounted(() => {
  dashboardStore.initializeDashboard()
})
</script>

<style scoped>
.dark {
  background-color: #1a1a1a;
  color: white;
}
.light {
  background-color: white;
  color: #1a1a1a;
}
</style>
```

---

## Best Practices

1. **Always use `computed` for reactivity**
   ```typescript
   // ✅ Good - reactive
   const isDark = computed(() => themeStore.isDark)
   
   // ❌ Bad - not reactive
   const isDark = themeStore.isDark
   ```

2. **Initialize stores in `onMounted`**
   ```typescript
   onMounted(() => {
     dashboardStore.initializeDashboard()
   })
   ```

3. **Use store methods, not direct mutation**
   ```typescript
   // ✅ Good
   themeStore.toggleTheme()
   
   // ❌ Bad - direct mutation
   themeStore.isDark = !themeStore.isDark
   ```

4. **Keep components slim, logic in stores**
   - Store: Business logic, state management
   - Component: Display logic, user interaction

---

## Testing

### Manual Test: Theme Store
1. Click theme toggle button
2. Verify colors change instantly
3. Refresh page
4. Verify theme persists

### Manual Test: Dashboard Store
1. Page loads
2. Coach name displays: "Welcome back, Coach Sarah"
3. Metrics display: 24 players, 142 exercises, 68% win rate
4. Recent actions display with correct colors

---

**Status:** ✅ Ready for development
**Last Updated:** April 18, 2026
