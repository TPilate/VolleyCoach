---
name: nuxt-best-practices
description: Build scalable Nuxt 3+ applications with clean architecture, RESTful APIs, and TypeScript
---

# Nuxt Best Practices: Scalable Frontend & Backend Architecture

Build clean, maintainable Nuxt 3+ applications with proper project structure, API design, and TypeScript practices. This skill covers both frontend components and backend server functionality.

## When to Use This Skill

Use this skill when:
- **Creating new API endpoints** (`server/api/` routes)
- **Building frontend components and pages** (`.vue` files)
- **Setting up project structure** and organizing files
- **Implementing authentication & middleware**
- **Designing APIs** and request/response patterns
- **Managing state** with composables
- **Defining TypeScript models and types**
- **Reviewing code for architectural consistency**

## Core Principles

1. **REST API Design**: Follow REST conventions (GET, POST, PUT, DELETE) with clear URL patterns
2. **Type Safety**: Use TypeScript for all code, define explicit types for models and API responses
3. **Separation of Concerns**: Keep server logic (`server/`), client logic (`composables/`, `components/`), and types (`types/`) separate
4. **Error Handling**: Implement consistent error handling with proper HTTP status codes
5. **Validation**: Validate all user input at the API boundary
6. **Clean Architecture**: Organize code by feature/domain, not by layer
7. **Composable-First**: Use composables for shared client logic, not global state mixins

---

## Project Structure Reference

```
project-root/
├── server/
│   ├── api/                 # API endpoints (auto-routed)
│   │   ├── users/
│   │   │   ├── index.get.ts       # GET /api/users
│   │   │   ├── index.post.ts      # POST /api/users
│   │   │   └── [id].get.ts        # GET /api/users/:id
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   └── logout.post.ts
│   │   └── hello.ts               # /api/hello
│   ├── middleware/          # Cross-cutting concerns
│   │   ├── auth.ts          # Token verification
│   │   └── log.ts           # Request logging
│   ├── routes/              # Custom routes (sitemap, etc)
│   │   └── sitemap.xml.ts
│   └── utils/               # Server utilities
│       ├── database.ts
│       ├── auth.ts
│       └── validation.ts
├── composables/             # Reusable client logic
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── useUser.ts
├── components/              # Vue components
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   └── common/
│       └── Button.vue
├── pages/                   # Route pages (auto-routed)
│   ├── index.vue
│   ├── dashboard.vue
│   ├── auth/
│   │   ├── login.vue
│   │   └── register.vue
│   └── [slug].vue
├── middleware/              # Route middleware & guards
│   ├── auth.ts
│   └── admin.global.ts
├── types/                   # TypeScript definitions
│   ├── models.ts            # Data models
│   ├── api.ts               # API response types
│   └── common.ts
├── utils/                   # Client utilities
│   ├── api.ts               # API client
│   ├── validators.ts
│   └── helpers.ts
├── layouts/                 # Layout templates
│   ├── default.vue
│   └── auth.vue
└── public/                  # Static assets
    ├── favicon.ico
    └── robots.txt
```

---

## Backend (Server) Best Practices

### 1. API Endpoint Patterns

**GET Endpoint - List with Pagination**
```typescript
// server/api/users/index.get.ts
export default defineEventHandler(async (event) => {
  try {
    // Extract and validate query parameters
    const { page = 1, limit = 10, sort = 'createdAt' } = getQuery(event)
    
    // Fetch with validation
    const users = await fetchUsers({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: sort as string
    })
    
    return {
      success: true,
      data: users,
      meta: { page, limit, total: users.length }
    }
  } catch (error) {
    throw createError({
      status: 500,
      message: 'Failed to fetch users'
    })
  }
})
```

**GET Endpoint - Single Resource by ID**
```typescript
// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      status: 400,
      message: 'User ID is required'
    })
  }
  
  const user = await getUserById(id)
  
  if (!user) {
    throw createError({
      status: 404,
      message: 'User not found'
    })
  }
  
  return {
    success: true,
    data: user
  }
})
```

**POST Endpoint - Create Resource**
```typescript
// server/api/users/index.post.ts
import { validateUserInput } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate input before processing
    const validationResult = validateUserInput(body)
    if (!validationResult.valid) {
      throw createError({
        status: 400,
        message: 'Validation failed',
        data: validationResult.errors
      })
    }
    
    // Create resource
    const user = await createUser(body)
    
    setResponseStatus(event, 201) // 201 Created
    return {
      success: true,
      data: user,
      message: 'User created successfully'
    }
  } catch (error) {
    throw createError({
      status: 500,
      message: error.message || 'Failed to create user'
    })
  }
})
```

**PUT/PATCH Endpoint - Update Resource**
```typescript
// server/api/users/[id].put.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // Validate (partial for updates)
  const validationResult = validateUserInput(body, { partial: true })
  if (!validationResult.valid) {
    throw createError({
      status: 400,
      message: 'Validation failed',
      data: validationResult.errors
    })
  }
  
  const user = await updateUser(id, body)
  
  if (!user) {
    throw createError({
      status: 404,
      message: 'User not found'
    })
  }
  
  return {
    success: true,
    data: user,
    message: 'User updated successfully'
  }
})
```

**DELETE Endpoint**
```typescript
// server/api/users/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const deleted = await deleteUser(id)
  
  if (!deleted) {
    throw createError({
      status: 404,
      message: 'User not found'
    })
  }
  
  setResponseStatus(event, 204) // 204 No Content
  return null
})
```

### 2. Server Middleware for Cross-Cutting Concerns

**Authentication Middleware**
```typescript
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (token) {
    try {
      const decoded = verifyToken(token)
      event.context.auth = {
        token,
        user: decoded
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      // Continue without auth (let routes decide if auth is required)
    }
  }
})
```

**Request Logging Middleware**
```typescript
// server/middleware/log.ts
export default defineEventHandler((event) => {
  const start = Date.now()
  
  onAfterResponse(event, () => {
    const duration = Date.now() - start
    console.log(`[${event.node.req.method}] ${event.node.req.url} - ${duration}ms`)
  })
})
```

### 3. Error Handling Pattern

```typescript
// server/utils/errors.ts
export class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}

// In API endpoints:
export default defineEventHandler(async (event) => {
  try {
    // ... logic ...
  } catch (error) {
    if (error instanceof ValidationError) {
      throw createError({
        status: 400,
        message: 'Validation failed',
        data: error.errors
      })
    }
    
    throw createError({
      status: 500,
      message: 'Internal server error'
    })
  }
})
```

### 4. Environment Variables & Configuration

```typescript
// server/utils/config.ts
export const config = {
  database: {
    url: process.env.DATABASE_URL,
    timeout: parseInt(process.env.DB_TIMEOUT || '5000')
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    tokenExpiry: process.env.TOKEN_EXPIRY || '24h'
  },
  api: {
    version: process.env.API_VERSION || 'v1'
  }
}
```

---

## Frontend Best Practices

### 1. Composables - Reusable Client Logic

**Authentication Composable**
```typescript
// composables/useAuth.ts
import type { User } from '~/types/models'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const state = reactive<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    error: null
  })

  const login = async (email: string, password: string) => {
    state.isLoading = true
    state.error = null
    
    try {
      const { data, token } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      state.user = data
      state.token = token
      localStorage.setItem('auth_token', token)
    } catch (error) {
      state.error = error.message || 'Login failed'
    } finally {
      state.isLoading = false
    }
  }

  const logout = () => {
    state.user = null
    state.token = null
    localStorage.removeItem('auth_token')
  }

  return {
    ...toRefs(state),
    login,
    logout
  }
}
```

**Data Fetching Composable**
```typescript
// composables/useFetch.ts
export const useFetchData = <T>(url: string) => {
  const data = ref<T | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const fetch = async () => {
    try {
      isLoading.value = true
      error.value = null
      data.value = await $fetch(url)
    } catch (err) {
      error.value = err.message || 'Failed to fetch data'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => fetch())

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    refetch: fetch
  }
}
```

### 2. Components - Structure & Props

```typescript
// components/UserCard.vue
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button @click="handleEdit">Edit</button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/models'

interface Props {
  user: User
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<{
  edit: [user: User]
  delete: [id: string]
}>()

const handleEdit = () => {
  emit('edit', props.user)
}
</script>

<style scoped>
.user-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
```

### 3. Pages with Route Parameters

```typescript
// pages/users/[id].vue
<template>
  <div v-if="isLoading" class="loading">Loading...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else class="user-detail">
    <h1>{{ user?.name }}</h1>
    <p>Email: {{ user?.email }}</p>
  </div>
</template>

<script setup lang="ts">
import { useFetchData } from '~/composables/useFetch'

const route = useRoute()
const userId = computed(() => route.params.id)

const { data: user, isLoading, error } = useFetchData(
  computed(() => `/api/users/${userId.value}`)
)
</script>
```

### 4. Route Middleware & Guards

```typescript
// middleware/auth.ts
export default defineRouteMiddleware((to, from) => {
  const { user } = useAuth()
  
  if (!user.value && to.meta.requiresAuth) {
    return navigateTo('/auth/login')
  }
})

// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
})
</script>
```

---

## Types & Models

### Define Explicit Types

```typescript
// types/models.ts
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Team {
  id: string
  name: string
  owner: User
  members: User[]
}
```

### API Response Types

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: Record<string, any>
}

export interface ApiError {
  status: number
  message: string
  data?: Record<string, any>
}
```

---

## State Management Pattern

Use composables with `reactive` for shared state, not Pinia unless complexity demands it:

```typescript
// composables/useUserState.ts
interface UserStore {
  users: User[]
  selectedUser: User | null
  filters: { search: string; role: string }
}

const state = reactive<UserStore>({
  users: [],
  selectedUser: null,
  filters: { search: '', role: '' }
})

export const useUserStore = () => {
  const setUsers = (users: User[]) => {
    state.users = users
  }

  const selectUser = (user: User) => {
    state.selectedUser = user
  }

  return {
    ...toRefs(state),
    setUsers,
    selectUser
  }
}
```

---

## Common Pitfalls & Solutions

| Problem | Solution |
|---------|----------|
| Overly generic endpoints | Follow REST conventions: specific URLs for specific resources |
| Missing input validation | Validate all inputs at API boundary before processing |
| No error context | Include descriptive error messages and proper HTTP status codes |
| Untyped API responses | Define explicit TypeScript types for all API data |
| Global state everywhere | Use composables for local state, Pinia only when needed |
| Mixing server & client logic | Keep `server/` and client code completely separate |
| No authentication checks | Implement auth middleware and protect sensitive routes |

---

## Checklist: When Creating a New Feature

- [ ] Define TypeScript models/interfaces in `types/`
- [ ] Create server API endpoints in `server/api/` following REST patterns
- [ ] Add input validation for all POST/PUT endpoints
- [ ] Implement proper error handling with meaningful messages
- [ ] Create composables for shared client logic in `composables/`
- [ ] Build Vue components with typed props in `components/`
- [ ] Add route middleware if authentication/authorization needed
- [ ] Test API endpoints with proper edge cases
- [ ] Document any complex business logic

---

## Example: Adding a New Resource

### 1. Define the Model
```typescript
// types/models.ts
export interface Team {
  id: string
  name: string
  description: string
  createdAt: Date
}
```

### 2. Create API Endpoints
```typescript
// server/api/teams/index.get.ts - List all
// server/api/teams/index.post.ts - Create
// server/api/teams/[id].get.ts - Get one
// server/api/teams/[id].put.ts - Update
// server/api/teams/[id].delete.ts - Delete
```

### 3. Build the UI
```typescript
// composables/useTeams.ts
// components/TeamList.vue
// pages/teams/index.vue
// pages/teams/[id].vue
```

---

## When to Escalate

- **Performance issues**: Profile with DevTools, consider caching strategies
- **Complex state**: Migrate from composables to Pinia
- **Large forms**: Use VeeValidate or Formkit for advanced validation
- **Real-time updates**: Add WebSocket support with Socket.io
- **File uploads**: Implement streaming with proper progress tracking
