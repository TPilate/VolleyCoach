import { useThemeStore } from '~/stores/themeStore'
import { computed } from 'vue'

export const useTheme = () => {
  const themeStore = useThemeStore()

  return {
    isDark: computed(() => themeStore.isDark),
    toggleTheme: () => themeStore.toggleTheme(),
    setTheme: (theme: 'light' | 'dark') => themeStore.setTheme(theme),
  }
}

