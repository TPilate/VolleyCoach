<template>
  <div class="min-h-screen flex items-center justify-center pb-32 pt-20 px-8">
    <div class="flex gap-24 items-center max-w-6xl w-full">
      <!-- Left Side: Value Proposition -->
      <div class="hidden lg:flex flex-col gap-12 max-w-xl flex-1">
        <!-- Headline -->
        <div class="space-y-2">
          <h1 class="text-7xl font-extrabold text-gray-900 tracking-tight">
            Elevate<br />Your<br />
            <span class="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Program.
            </span>
          </h1>
          <!-- Underline accent -->
          <div class="w-32 h-1 bg-blue-100 rounded-full transform -rotate-2 mt-2" />
        </div>

        <!-- Description -->
        <p class="text-lg text-gray-600 leading-relaxed">
          Join the elite network of volleyball coaches leveraging high-performance analytics and film review to build
          championship teams.
        </p>

        <!-- Stats Cards -->
        <div class="space-y-4">
          <!-- Film Review Card -->
          <div
            class="bg-white border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow transform -rotate-3">
            <div class="flex gap-4 items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="mdi:video-outline" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">FILM REVIEW</p>
                <p class="text-sm font-semibold text-gray-900">Automated Clipping</p>
              </div>
            </div>
            <div class="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full w-2/3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" />
            </div>
          </div>

          <!-- Analytics Card -->
          <div
            class="bg-white border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow transform rotate-3">
            <div class="flex gap-4 items-center">
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="mdi:chart-line" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p class="text-xs font-bold text-orange-600 uppercase tracking-widest">ANALYTICS</p>
                <p class="text-2xl font-extrabold text-gray-900">94%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Registration Form -->
      <div class="w-full max-w-lg flex-1">
        <div class="bg-white/95 backdrop-blur-lg border border-gray-200/30 rounded-3xl p-12 shadow-2xl">
          <!-- Progress Indicator -->
          <div class="mb-8 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-blue-600 uppercase tracking-widest">STEP 1 OF 3</span>
              <span class="text-xs font-semibold text-gray-500 uppercase">Profile Setup</span>
            </div>
            <div class="flex gap-2">
              <div class="flex-1 h-1 bg-blue-600 rounded-full" />
              <div class="flex-1 h-1 bg-gray-300 rounded-full" />
              <div class="flex-1 h-1 bg-gray-300 rounded-full" />
            </div>
          </div>

          <!-- Form Title -->
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Create Your Profile</h2>

          <!-- Error Message -->
          <Transition name="fade">
            <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </Transition>

          <!-- Form -->
          <form @submit.prevent="submitStep1" class="space-y-6">
            <!-- Full Name Input -->
            <div class="space-y-2">
              <label for="fullName" class="text-sm font-semibold text-gray-900">Full Name</label>
              <div class="relative">
                <Icon name="mdi:account"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="fullName" v-model="formData.fullName" type="text" placeholder="Coach Miller"
                  class="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all placeholder-gray-500"
                  :class="{ 'ring-2 ring-red-500': formErrors.fullName }" />
              </div>
              <Transition name="fade">
                <p v-if="formErrors.fullName" class="text-xs text-red-600">{{ formErrors.fullName }}</p>
              </Transition>
            </div>

            <!-- Email Input -->
            <div class="space-y-2">
              <label for="email" class="text-sm font-semibold text-gray-900">Work Email</label>
              <div class="relative">
                <Icon name="mdi:email-outline"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="email" v-model="formData.email" type="email" placeholder="coach@university.edu"
                  class="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all placeholder-gray-500"
                  :class="{ 'ring-2 ring-red-500': formErrors.email }" />
              </div>
              <Transition name="fade">
                <p v-if="formErrors.email" class="text-xs text-red-600">{{ formErrors.email }}</p>
              </Transition>
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <label for="password" class="text-sm font-semibold text-gray-900">Password</label>
              <div class="relative">
                <Icon name="mdi:lock-outline"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="password" v-model="formData.password" :type="isPasswordVisible ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all placeholder-gray-500"
                  :class="{ 'ring-2 ring-red-500': formErrors.password }" />
                <button type="button" @click="togglePasswordVisibility"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Icon :name="isPasswordVisible ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
                </button>
              </div>
              <Transition name="fade">
                <p v-if="formErrors.password" class="text-xs text-red-600">{{ formErrors.password }}</p>
              </Transition>
              <p class="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="loading"
              class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8">
              <span v-if="!loading">Continue to Role →</span>
              <span v-else class="flex items-center justify-center gap-2">
                <Icon name="mdi:loading" class="w-5 h-5 animate-spin" />
                Creating account...
              </span>
            </button>
          </form>

          <!-- Terms Footer -->
          <p class="text-center text-xs text-gray-500 mt-8">
            By proceeding, you agree to VolleyCoach's
            <a href="#" class="text-blue-600 hover:underline">Terms of Service</a>
            and
            <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegisterForm } from '~/composables/useRegisterForm'

definePageMeta({
  layout: 'auth',
})

const {
  loading,
  error,
  formData,
  formErrors,
  isPasswordVisible,
  submitStep1,
  togglePasswordVisibility,
} = useRegisterForm()
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
