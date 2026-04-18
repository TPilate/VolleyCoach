# Auth Pages Implementation - VolleyCoach

## Overview
Created a multi-step registration and login system based on the Figma design. The registration form (Step 1 of 3) includes profile setup with Full Name, Work Email, and Password validation.

## Files Created

### Pages
1. **`pages/auth/register.vue`** - Multi-step registration form
   - Step 1: Profile Setup (Full Name, Work Email, Password)
   - Progress indicator showing 1 of 3 steps
   - Form validation with error messages
   - Loading state management
   - Responsive layout with left sidebar value proposition (desktop only)
   - Styled with Tailwind CSS following the VolleyCoach design system

2. **`pages/auth/login.vue`** - Login page
   - Email and password inputs
   - Remember me option (optional)
   - Forgot password link (placeholder)
   - Loading state management
   - Error handling
   - Sign up link to register page

### Layout
3. **`layouts/auth.vue`** - Auth-specific layout
   - Header with VolleyCoach branding
   - Sign In/Sign Up toggle in top right
   - Gradient background
   - Page slot for form content

### Composables
4. **`composables/useRegisterForm.ts`** - Registration form logic
   - Form state management
   - Validation logic (email format, password strength)
   - API submission
   - Password visibility toggle
   - Step navigation
   - Error handling

### Styling & Config
5. **`tailwind.config.ts`** - Tailwind CSS configuration
   - VolleyCoach design system colors (primary, secondary, tertiary, surface)
   - Custom typography (Manrope + Inter)
   - Custom utilities (btn-primary, btn-secondary, card-glass)
   - Extended border radius, shadows, and animations

6. **`postcss.config.js`** - PostCSS configuration
   - Tailwind CSS plugin
   - Autoprefixer for vendor prefixes

7. **`assets/styles/app.css`** - Global styles
   - Tailwind directives (@tailwind base, components, utilities)
   - Google Fonts imports (Manrope, Inter)
   - Custom component utilities

### API & Types
8. **Updated `server/api/auth/register.post.ts`**
   - Now requires `fullName` (not optional)
   - Password validation: minimum 8 characters (matching frontend)
   - Better error messages
   - Full Name metadata passed to Supabase Auth

9. **Updated `types/models.ts`**
   - Added `ApiResponse<T>` generic type
   - Exported for use across the application

### Directories Created
10. **`components/base/`** - Placeholder for reusable UI components
11. **`components/features/`** - Placeholder for feature-specific components
12. **`components/layout/`** - Placeholder for layout components

## Features Implemented

### Register Page (pages/auth/register.vue)
✅ Profile Setup form (Step 1 of 3)
✅ Full Name input with icon
✅ Work Email input with validation
✅ Password input with visibility toggle
✅ Password strength requirement display
✅ Form validation on submit
✅ Error messages for each field
✅ Loading state during submission
✅ Responsive design (hidden left sidebar on mobile)
✅ Value proposition section (left side on desktop)
- Headline: "Elevate Your Program."
- Description text
- Film Review card with progress bar
- Analytics card with stat

### Login Page (pages/auth/login.vue)
✅ Email input
✅ Password input with visibility toggle
✅ Email validation
✅ Error handling
✅ Loading state
✅ Forgot password link
✅ Sign up link
✅ Clean, minimal design

### Design System Integration
✅ Follows VolleyCoach Liquid Athletic design system
✅ No borders (uses color transitions, tonal hierarchy, white space)
✅ Glass & gradient effects on primary buttons
✅ Color palette: Primary blue (#0058bc), surface grays
✅ Typography: Manrope (headlines) + Inter (body)
✅ Rounded corners: Full roundedness on buttons (9999px)
✅ Subtle shadows and blur effects

## Usage

### Navigate to Pages
- Registration: `/auth/register`
- Login: `/auth/login`

### Using the Form
```typescript
// The register form uses the useRegisterForm() composable
import { useRegisterForm } from '~/composables/useRegisterForm'

const {
  loading,
  error,
  formData,
  formErrors,
  isPasswordVisible,
  submitStep1,
  togglePasswordVisibility,
} = useRegisterForm()
```

### Form Data Structure
```typescript
interface RegisterFormData {
  fullName: string
  email: string
  password: string
}
```

## Next Steps (Not Implemented)

These are steps 2 and 3 of the registration process that can be added:

1. **Step 2: Role Selection**
   - Coach / Player / Admin role selection
   - Role-specific information collection

2. **Step 3: Team/Profile Completion**
   - Additional profile details
   - Team selection or creation
   - Confirmation and final submission

## Environment Setup

### Install Dependencies
```bash
npm install
npm install -D tailwindcss postcss autoprefixer
```

### Required Environment Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### Build & Run
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Design System References

The implementation follows the VolleyCoach design system guidelines:
- **Light Mode (Kinetic Clarity)**: Editorial breathing room, white space emphasis
- **Core Rule 1**: No borders - use color transitions and tonal hierarchy
- **Core Rule 2**: Glass & gradient effects on primary actions
- **Core Rule 3**: Surface hierarchy with proper nesting

All colors, typography, and spacing follow the VolleyCoach guidelines for consistency.

## File Structure
```
pages/auth/
  ├─ register.vue
  └─ login.vue

layouts/
  └─ auth.vue

composables/
  ├─ useAuth.ts (existing)
  └─ useRegisterForm.ts

server/api/auth/
  ├─ register.post.ts (updated)
  ├─ login.post.ts
  └─ logout.post.ts

components/
  ├─ base/
  ├─ features/
  └─ layout/

assets/styles/
  └─ app.css (updated)

types/
  └─ models.ts (updated)

tailwind.config.ts (new)
postcss.config.js (new)
```

## Validation Rules

### Full Name
- Required
- Non-empty string

### Email
- Required
- Valid email format (RFC 5322 simplified)

### Password
- Required
- Minimum 8 characters
- Display requirement: "Must be at least 8 characters long."

## Error Handling

All form errors are displayed inline below each field:
- `formErrors.fullName` - Full name validation error
- `formErrors.email` - Email validation error
- `formErrors.password` - Password validation error
- `error` - General API error message

## Accessibility

✅ Form labels properly associated with inputs
✅ Clear error messages
✅ Password visibility toggle for better UX
✅ Focus states on all inputs
✅ Semantic HTML structure
✅ Icon labels where appropriate

## Performance

✅ Lazy-loaded layouts and pages
✅ Optimized CSS with Tailwind purging
✅ No unnecessary re-renders (Vue 3 reactivity)
✅ Efficient form validation
✅ Minimal bundle size

---

All pages are ready for use and follow Vue 3 best practices, Nuxt conventions, and the VolleyCoach design system.
