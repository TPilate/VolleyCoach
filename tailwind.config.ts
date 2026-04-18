/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // VolleyCoach Design System Colors
        primary: {
          50: '#f0f6ff',
          100: '#e0ecff',
          200: '#c1d9ff',
          300: '#a1beff',
          400: '#85adff',
          500: '#6b9cff',
          600: '#0058bc', // Primary brand color
          700: '#0050a8',
          800: '#004898',
          900: '#004088',
        },
        secondary: {
          50: '#f9f5ff',
          100: '#f3ebff',
          200: '#e7d7ff',
          300: '#dbc3ff',
          400: '#cfafff',
          500: '#c39bff',
          600: '#9e72ff',
          700: '#884eff',
          800: '#722aff',
          900: '#5c06ff',
        },
        tertiary: {
          50: '#f5f6ff',
          100: '#ebeeff',
          200: '#d7ddff',
          300: '#c3ccff',
          400: '#afbbff',
          500: '#9baaf',
          600: '#5b6fff',
          700: '#3d4dff',
          800: '#1f2bff',
          900: '#0109ff',
        },
        surface: {
          50: '#fefbfe',
          100: '#f8f9fa',
          200: '#f3f4f5',
          300: '#ededef',
          400: '#e1e3e4',
          500: '#d5d7da',
          600: '#c1c5ca',
          700: '#989fa7',
          800: '#414755',
          900: '#191c1d',
        },
        on: {
          primary: '#ffffff',
          secondary: '#ffffff',
          tertiary: '#ffffff',
          surface: '#191c1d',
        },
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['2.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'title-md': ['1.125rem', { lineHeight: '1.3', fontWeight: '500' }],
        'body-md': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label-md': ['0.75rem', { lineHeight: '1.33', fontWeight: '600' }],
      },
      borderRadius: {
        full: '9999px',
        xl: '1.5rem',
        lg: '1rem',
        md: '0.75rem',
      },
      boxShadow: {
        soft: '0px 4px 16px rgba(25, 28, 29, 0.08)',
        medium: '0px 8px 24px rgba(25, 28, 29, 0.12)',
        lg: '0px 16px 40px rgba(25, 28, 29, 0.14)',
        xl: '0px 32px 64px rgba(25, 28, 29, 0.16)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
