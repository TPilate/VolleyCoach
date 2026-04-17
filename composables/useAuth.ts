import { ref } from 'vue'

/**
 * Composable for authentication - handles login, register, logout
 */
export const useAuth = () => {
  const user = ref<any>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<string | null>(null)

  /**
   * Register new user
   */
  const register = async (email: string, password: string, fullName?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email,
          password,
          fullName,
        },
      })

      if (response.success) {
        console.log('Registration successful! Please check your email.')
        return { success: true, user: response.data?.user }
      }
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || 'Registration failed'
      error.value = errorMessage
      console.error('Register error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password,
        },
      })

      if (response.success && response.data) {
        // Store token
        token.value = response.data.accessToken
        sessionStorage.setItem('auth-token', response.data.accessToken)

        // Store user
        user.value = response.data.user
        isAuthenticated.value = true

        console.log('Login successful!')
        return { success: true, user: response.data.user }
      }
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || 'Login failed'
      error.value = errorMessage
      console.error('Login error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      // Clear state
      user.value = null
      token.value = null
      isAuthenticated.value = false
      sessionStorage.removeItem('auth-token')

      console.log('Logout successful!')
      return { success: true }
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || 'Logout failed'
      error.value = errorMessage
      console.error('Logout error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get current user
   */
  const getCurrentUser = async () => {
    if (!token.value) {
      return null
    }

    try {
      const response = await $fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (response.success && response.data) {
        user.value = response.data
        isAuthenticated.value = true
        return response.data
      }
    } catch (err: any) {
      console.error('Get user error:', err)
      // Token might be invalid, clear it
      token.value = null
      sessionStorage.removeItem('auth-token')
      isAuthenticated.value = false
      return null
    }
  }

  /**
   * Initialize auth state (check if token exists on app load)
   */
  const initAuth = async () => {
    // Try to get stored token from sessionStorage
    try {
      const storedToken = sessionStorage.getItem('auth-token')
      if (storedToken) {
        token.value = storedToken
        await getCurrentUser()
      }
    } catch (err) {
      // sessionStorage might not be available during SSR
      console.debug('Could not access sessionStorage', err)
    }
  }

  // Initialize auth when composable is first used (auto-runs on client)
  initAuth()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    register,
    login,
    logout,
    getCurrentUser,
    initAuth,
  }
}
