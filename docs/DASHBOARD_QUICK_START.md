# Dashboard Quick Start Guide

## File Locations

### Stores
- Theme Management: `stores/themeStore.ts`
- Dashboard Data: `stores/dashboardStore.ts`

### Components
- Layout:
  - `components/layout/Sidebar.vue` - Navigation sidebar
  - `components/layout/Navbar.vue` - Top navbar with theme toggle
- Features:
  - `components/features/TrainingCard.vue` - Next training session
  - `components/features/MetricCard.vue` - Quick stats (Active Players, Exercises)
  - `components/features/PerformanceChart.vue` - Team performance metrics
  - `components/features/RecentActions.vue` - Recent actions feed

### Pages & Composables
- Dashboard Page: `pages/index.vue`
- Theme Composable: `composables/useTheme.ts`
- Theme Plugin: `plugins/theme.ts`

## Key Features Implemented

✅ **Theme Switching**
- Light/Dark mode with persistent storage
- Smooth CSS transitions
- System preference detection
- Toggle button in navbar

✅ **Pinia Stores**
- `useThemeStore()` - Theme state management
- `useDashboardStore()` - Dashboard data management

✅ **Responsive Layout**
- Fixed sidebar (288px)
- Fixed navbar (80px height)
- Responsive bento grid for cards
- Mobile-friendly spacing

✅ **Design System Compliance**
- No borders (glass & tonal effects)
- Gradient CTAs
- Athletic editorial aesthetics
- Manrope + Inter typography

✅ **No Authentication Required**
- Dashboard is publicly accessible
- Can be protected with middleware if needed

## Common Tasks

### Toggle Theme Programmatically
```typescript
const themeStore = useThemeStore()
themeStore.toggleTheme()
```

### Access Current Theme
```typescript
const isDark = computed(() => themeStore.isDark)
```

### Add New Card to Dashboard
1. Create component in `components/features/`
2. Import in `pages/index.vue`
3. Add to grid layout

### Update Dashboard Stats
```typescript
const dashboard = useDashboardStore()
dashboard.stats.activePlayersCount = 30
dashboard.stats.exercisesInLibraryCount = 150
```

### Fetch Real Data
```typescript
// In dashboardStore.ts
const fetchDashboardData = async () => {
  const response = await $fetch('/api/dashboard')
  stats.value = response
}
```

## Tailwind Color Classes

```
Light mode:
- bg-surface-50 to bg-surface-900
- text-primary-600
- bg-linear-to-br from-primary-400 to-primary-600

Dark mode:
- dark:bg-surface-900
- dark:text-primary-400
- dark:bg-linear-to-br
```

## Build & Deploy

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Debug Theme

```typescript
// In browser console
localStorage.getItem('theme')  // View saved theme
localStorage.removeItem('theme')  // Reset theme
document.documentElement.classList  // Check dark class
```

## Component Props

### MetricCard
```vue
<MetricCard
  label="Active Players"
  :value="24"
  icon-name="mdi:people"
  description="Players available"
/>
```

### TrainingCard
```vue
<TrainingCard :training="dashboardStore.upcomingTraining" />
```

### PerformanceChart
```vue
<PerformanceChart
  :win-rate="dashboardStore.stats.winRate"
  :performance-metrics="dashboardStore.stats.performanceMetrics"
/>
```

### RecentActions
```vue
<RecentActions :actions="dashboardStore.stats.recentActions" />
```

## Next Steps

1. **Connect API**: Replace mock data with real API calls in `dashboardStore.ts`
2. **Add Authentication**: Use Supabase middleware if needed
3. **Customize Colors**: Update `tailwind.config.ts` color tokens
4. **Add More Pages**: Create routes for Teams, Training, Exercises, Settings
5. **Mobile Optimization**: Add responsive breakpoints for mobile
6. **Analytics**: Integrate tracking for dashboard events

---

**Last Updated**: April 18, 2026
**Status**: Ready for Development ✅
