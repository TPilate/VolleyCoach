<template>
  <div class="min-h-screen flex items-center justify-center pb-32 pt-20 px-8">
    <div class="w-full max-w-lg">
      <!-- Back to Home -->
      <div class="mb-8">
        <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2">
          <Icon name="mdi:arrow-left" class="w-5 h-5" />
          Back
        </NuxtLink>
      </div>

      <div class="bg-white/95 backdrop-blur-lg border border-gray-200/30 rounded-3xl p-12 shadow-2xl">
        <!-- Form Title -->
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p class="text-gray-600 mb-8">Sign in to your VolleyCoach account</p>

        <!-- Error Message -->
        <Transition name="fade">
          <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </Transition>

        <!-- Form -->
        <form @submit.prevent="submitLogin" class="space-y-6">
          <!-- Email Input -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-semibold text-gray-900">Work Email</label>
            <div class="relative">
              <Icon name="mdi:email-outline"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input id="email" v-model="email" type="email" placeholder="coach@university.edu"
                class="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all placeholder-gray-500"
                :class="{ 'ring-2 ring-red-500': emailError }" />
            </div>
            <Transition name="fade">
              <p v-if="emailError" class="text-xs text-red-600">{{ emailError }}</p>
            </Transition>
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-semibold text-gray-900">Password</label>
              <a href="#" class="text-xs text-blue-600 hover:underline">Forgot?</a>
            </div>
            <div class="relative">
              <Icon name="mdi:lock-outline"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input id="password" v-model="password" :type="isPasswordVisible ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all placeholder-gray-500"
                :class="{ 'ring-2 ring-red-500': passwordError }" />
              <button type="button" @click="isPasswordVisible = !isPasswordVisible"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <Icon :name="isPasswordVisible ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
              </button>
            </div>
            <Transition name="fade">
              <p v-if="passwordError" class="text-xs text-red-600">{{ passwordError }}</p>
            </Transition>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="loading"
            class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8">
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center justify-center gap-2">
              <Icon name="mdi:loading" class="w-5 h-5 animate-spin" />
              Signing in...
            </span>
          </button>
        </form>

        <!-- Sign Up Link -->
        <p class="text-center text-sm text-gray-600 mt-8">
          Don't have an account?
          <NuxtLink to="/auth/register" class="text-blue-600 font-semibold hover:underline">
            Sign Up
          </NuxtLink>
        </p>

        <!-- Terms Footer -->
        <p class="text-center text-xs text-gray-500 mt-8">
          By signing in, you agree to VolleyCoach's
          <a href="#" class="text-blue-600 hover:underline">Terms of Service</a>
          and
          <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth',
})

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const isPasswordVisible = ref(false)

const emailError = ref('')
const passwordError = ref('')

const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

const submitLogin = async () => {
  emailError.value = ''
  passwordError.value = ''
  error.value = null

  let isValid = true

  if (!email.value.trim()) {
    emailError.value = 'Email is required'
    isValid = false
  } else if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
    isValid = false
  }

  if (!isValid) return

  loading.value = true

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (response) {
      // Navigate to dashboard or home
      await router.push('/')
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
