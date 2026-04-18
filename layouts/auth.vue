<template>
  <div class="bg-gradient-to-r from-[#f8f9fa] to-white min-h-screen flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between px-8 py-6">
      <div class="text-2xl font-bold">
        <span class="text-blue-600">Volley</span><span class="text-gray-900">Coach</span>
      </div>
      <div class="text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-blue-600 font-semibold hover:underline">
          Sign In
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<style scoped></style>
