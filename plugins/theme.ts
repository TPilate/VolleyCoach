export default defineNuxtPlugin(() => {
  if (process.client) {
    const themeStore = useThemeStore()

    // Initialize theme on app startup
    themeStore.initializeTheme()

    // Watch for system preference changes
    themeStore.watchSystemPreference()
  }
})
