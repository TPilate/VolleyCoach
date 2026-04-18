// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Directory structure (using root level components)
  srcDir: '.',

  // Runtime configuration
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  // Global CSS
  css: [
    '~/assets/styles/app.css',
  ],

  // PostCSS configuration (Tailwind v4)
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // Modules
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
  ],

  // Supabase configuration
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/auth/login',
      callback: '/',
      exclude: ['/auth/login', '/auth/register'],
    },
  },

  // Component auto-import from root directory
  components: {
    global: true,
    dirs: [
      {
        path: '~/components/base',
      },
      {
        path: '~/components/features',
      },
      {
        path: '~/components/layout',
      },
    ],
  },

  // Composable auto-import
  imports: {
    autoImport: true,
    dirs: ['composables'],
  },

  // Experimental features
  experimental: {
    componentIslands: true,
  },
})
