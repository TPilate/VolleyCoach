# TypeScript Best Practices for Vue 3

## Interface/Type Definitions

### Component Props Interface

```typescript
// Define props interface for type safety
interface Props {
  id: number
  title: string
  description?: string
  items: Array<{ id: number; label: string }>
  status: 'pending' | 'success' | 'error'
  onUpdate?: (value: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  items: () => [],
  onUpdate: undefined,
})
```

### Component Emits Interface

```typescript
// Type your emits with named tuple syntax (Vue 3.3+)
const emit = defineEmits<{
  submit: [formData: Record<string, any>]
  cancel: []
  'update:modelValue': [value: string]
  'custom-event': [data: CustomData]
}>()

// Type definition for complex payload
interface CustomData {
  timestamp: number
  userId: string
  action: 'click' | 'hover' | 'focus'
}
```

### Form Data Interface

```typescript
// Define form structure types
interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

interface ValidationError {
  field: string
  message: string
  code: 'REQUIRED' | 'INVALID_FORMAT' | 'TOO_SHORT'
}

interface FormState {
  data: LoginForm
  errors: ValidationError[]
  isDirty: boolean
  isSubmitting: boolean
}
```

### API Response Types

```typescript
// Define API response structures
interface ApiResponse<T> {
  success: boolean
  data: T
  error?: {
    code: string
    message: string
  }
  timestamp: number
}

interface UserResponse {
  id: number
  name: string
  email: string
  createdAt: Date
}

// Usage in composable
async function fetchUser(id: number): Promise<ApiResponse<UserResponse>> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}
```

## Advanced Type Patterns

### Utility Types

```typescript
// Extract value type from ref
import type { Ref, UnwrapRef } from 'vue'

const counter = ref(0)
type CounterType = UnwrapRef<typeof counter> // number

// Make all properties optional
interface User {
  name: string
  email: string
}
type PartialUser = Partial<User>

// Make all properties required
type RequiredUser = Required<User>

// Extract keys from type
type UserKeys = keyof User // 'name' | 'email'

// Record type for key-value maps
type StatusFlags = Record<'pending' | 'success' | 'error', boolean>
const flags: StatusFlags = {
  pending: false,
  success: true,
  error: false,
}
```

### Discriminated Unions

```typescript
// Type-safe state management using discriminated unions
type FormState =
  | { status: 'idle'; data: null }
  | { status: 'loading'; data: null }
  | { status: 'success'; data: UserData }
  | { status: 'error'; data: null; error: Error }

const state: FormState = { status: 'idle', data: null }

if (state.status === 'success') {
  console.log(state.data) // TypeScript knows data is UserData
} else if (state.status === 'error') {
  console.log(state.error) // TypeScript knows error exists
}
```

### Generic Composables

```typescript
// Generic useFetch with proper typing
export function useFetch<T = unknown>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    try {
      const res = await window.fetch(url)
      data.value = (await res.json()) as T
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, fetch }
}

// Usage with specific type
interface User {
  id: number
  name: string
}

const { data: user } = useFetch<User>('/api/user')
// user is Ref<User | null>
```

### Factory Pattern with Types

```typescript
// Strongly typed store factory
export function createCounterStore(initial: number = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)

  function increment(by: number = 1) {
    count.value += by
  }

  function reset() {
    count.value = initial
  }

  return { count, doubled, increment, reset } as const
}

// Type inference preserves method signatures
type CounterStore = ReturnType<typeof createCounterStore>
```

## Component Type Safety Patterns

### Generic Component

```typescript
// Generic component for list rendering
<script setup lang="ts" generic="T extends { id: number | string }">
import type { VNode } from 'vue'

interface Props {
  items: T[]
  selectedId?: T['id']
}

const emit = defineEmits<{
  select: [item: T]
}>()

const props = withDefaults(defineProps<Props>(), {
  selectedId: undefined,
})

function handleSelect(item: T) {
  emit('select', item)
}
</script>

<template>
  <div class="list">
    <div
      v-for="item in items"
      :key="item.id"
      class="item"
      :class="{ selected: item.id === selectedId }"
      @click="handleSelect(item)"
    >
      <slot :item="item">{{ item }}</slot>
    </div>
  </div>
</template>
```

### Type-Safe Event Handlers

```typescript
// Properly typed event handlers
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  console.log(target.value)
}

function handleClick(event: MouseEvent) {
  console.log(event.clientX, event.clientY)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
  }
}
```

### Ref Template Type Safety

```typescript
// Properly type template refs
import type { ComponentInstance } from 'vue'

const inputRef = ref<HTMLInputElement>()
const componentRef = ref<InstanceType<typeof MyComponent>>()

function focusInput() {
  inputRef.value?.focus()
}

function callComponentMethod() {
  componentRef.value?.somePublicMethod()
}
```

## Typing External Libraries

### Vue Router

```typescript
import { useRouter, useRoute } from 'vue-router'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

const router: Router = useRouter()
const route: RouteLocationNormalizedLoaded = useRoute()

const userId: string | string[] | undefined = route.params.id
```

### Pinia Store

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  interface User {
    id: number
    name: string
  }

  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => user.value !== null)

  function setUser(newUser: User) {
    user.value = newUser
  }

  return { user, isLoggedIn, setUser }
})
```

## Enum Usage for Type Safety

```typescript
// Use enums for status/type constants
enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

function showToast(message: string, type: ToastType = ToastType.Info) {
  // Implementation
}

showToast('Success!', ToastType.Success)
```

## Type-Safe API Call Pattern

```typescript
// Comprehensive API typing pattern
interface ApiErrorResponse {
  code: string
  message: string
  details?: Record<string, any>
}

interface ApiSuccessResponse<T> {
  data: T
  timestamp: string
}

type ApiResponse<T> = 
  | ApiSuccessResponse<T>
  | ApiErrorResponse

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, options)
  const json: ApiResponse<T> = await response.json()

  if ('data' in json) {
    return json.data
  } else {
    throw new Error(json.message)
  }
}

// Usage
interface Product {
  id: number
  name: string
  price: number
}

const product = await apiCall<Product>('/api/products/1')
// product is typed as Product
```

## Avoid These Typing Mistakes

❌ **Avoid implicit any:**
```typescript
// Bad
function process(data) { ... }
```

✅ **Be explicit:**
```typescript
// Good
function process(data: unknown) { ... }
function process(data: Record<string, any>) { ... }
function process<T>(data: T) { ... }
```

❌ **Avoid over-complicated unions:**
```typescript
// Bad
type Status = 'pending' | 'loading' | 'success' | 'error' | 'unknown'
```

✅ **Use discriminated unions:**
```typescript
// Good
type Status =
  | { state: 'pending' }
  | { state: 'loading' }
  | { state: 'success'; data: T }
  | { state: 'error'; error: Error }
```
