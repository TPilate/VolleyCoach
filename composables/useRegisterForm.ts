import { ref, reactive, computed } from 'vue'
import type { ApiResponse } from '~/types/models'

interface RegisterFormData {
  fullName: string
  email: string
  password: string
}

interface RegisterResponse {
  user: {
    id: string
    email: string
  }
  message: string
}

export function useRegisterForm() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const step = ref(1)

  const formData = reactive<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
  })

  const formErrors = reactive({
    fullName: '',
    email: '',
    password: '',
  })

  const isPasswordVisible = ref(false)

  // Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8
  }

  const validateStep1 = (): boolean => {
    formErrors.fullName = ''
    formErrors.email = ''
    formErrors.password = ''

    let isValid = true

    if (!formData.fullName.trim()) {
      formErrors.fullName = 'Full name is required'
      isValid = false
    }

    if (!formData.email.trim()) {
      formErrors.email = 'Email is required'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      formErrors.email = 'Please enter a valid email'
      isValid = false
    }

    if (!formData.password) {
      formErrors.password = 'Password is required'
      isValid = false
    } else if (!validatePassword(formData.password)) {
      formErrors.password = 'Password must be at least 8 characters long'
      isValid = false
    }

    return isValid
  }

  const submitStep1 = async () => {
    if (!validateStep1()) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<RegisterResponse>>('/api/auth/register', {
        method: 'POST',
        body: {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
      })

      if (response) {
        // Move to step 2
        step.value = 2
        error.value = null
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Registration failed. Please try again.'
    } finally {
      loading.value = false
    }
  }

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value
  }

  const resetForm = () => {
    formData.fullName = ''
    formData.email = ''
    formData.password = ''
    formErrors.fullName = ''
    formErrors.email = ''
    formErrors.password = ''
    error.value = null
    step.value = 1
    isPasswordVisible.value = false
  }

  return {
    // State
    loading,
    error,
    step,
    formData,
    formErrors,
    isPasswordVisible,

    // Methods
    submitStep1,
    togglePasswordVisibility,
    resetForm,
    validateEmail,
    validatePassword,
  }
}
