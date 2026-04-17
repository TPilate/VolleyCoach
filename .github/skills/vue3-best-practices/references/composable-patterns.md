# Composable Patterns & Best Practices

## Pattern 1: Data Fetching Composable

```typescript
// composables/useFetch.ts
import { ref, onMounted, onUnmounted } from 'vue'

interface UseFetchOptions {
  immediate?: boolean
  onError?: (error: Error) => void
}

export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
) {
  const { immediate = true, onError } = options
  
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  let abortController: AbortController | null = null

  async function fetch() {
    loading.value = true
    error.value = null
    abortController = new AbortController()

    try {
      const response = await window.fetch(url, {
        signal: abortController.signal,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      data.value = await response.json()
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        error.value = err
        onError?.(err)
      }
    } finally {
      loading.value = false
    }
  }

  function refetch() {
    return fetch()
  }

  function abort() {
    abortController?.abort()
  }

  onMounted(() => {
    if (immediate) fetch()
  })

  onUnmounted(() => {
    abort()
  })

  return { data, error, loading, fetch: refetch, abort }
}
```

## Pattern 2: Form Composable

```typescript
// composables/useForm.ts
import { ref, reactive, computed } from 'vue'

interface FormState {
  [key: string]: any
}

interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

interface ValidationRules {
  [key: string]: ValidationRule[]
}

export function useForm<T extends FormState = FormState>(
  initialState: T,
  rules: ValidationRules = {}
) {
  const formData = reactive<T>(initialState)
  const touched = reactive<Record<string, boolean>>({})
  const errors = reactive<Record<string, string>>({})

  function validateField(fieldName: string): boolean {
    const value = formData[fieldName]
    const fieldRules = rules[fieldName]

    if (!fieldRules) return true

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        errors[fieldName] = rule.message
        return false
      }
    }

    delete errors[fieldName]
    return true
  }

  function validateAll(): boolean {
    let isValid = true
    for (const fieldName in rules) {
      if (!validateField(fieldName)) {
        isValid = false
      }
    }
    return isValid
  }

  function setFieldValue(fieldName: string, value: any) {
    formData[fieldName] = value
    if (touched[fieldName]) {
      validateField(fieldName)
    }
  }

  function markFieldTouched(fieldName: string) {
    touched[fieldName] = true
    validateField(fieldName)
  }

  function reset() {
    Object.assign(formData, initialState)
    Object.keys(touched).forEach(key => delete touched[key])
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const isValid = computed(() => {
    return Object.keys(rules).every(fieldName =>
      rules[fieldName].every(rule => rule.validate(formData[fieldName]))
    )
  })

  const isDirty = computed(() =>
    Object.keys(formData).some(key => formData[key] !== initialState[key])
  )

  return {
    formData,
    touched,
    errors,
    isValid,
    isDirty,
    validateField,
    validateAll,
    setFieldValue,
    markFieldTouched,
    reset,
  }
}
```

## Pattern 3: Local Storage Composable

```typescript
// composables/useLocalStorage.ts
import { ref, watch, Ref } from 'vue'

export function useLocalStorage<T = any>(
  key: string,
  initialValue: T
): [Ref<T>, (value: T) => void] {
  // Try to read from localStorage
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(
    storedValue ? JSON.parse(storedValue) : initialValue
  )

  // Sync to localStorage when value changes
  const setData = (value: T) => {
    data.value = value
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Watch for external storage changes
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      data.value = JSON.parse(e.newValue)
    }
  }

  window.addEventListener('storage', handleStorageChange)

  const cleanup = () => {
    window.removeEventListener('storage', handleStorageChange)
  }

  return [data, setData]
}
```

## Pattern 4: Async State Composable

```typescript
// composables/useAsync.ts
import { ref, watch } from 'vue'

interface UseAsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = true, onSuccess, onError } = options

  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(false)

  async function execute() {
    pending.value = true
    error.value = null

    try {
      data.value = await asyncFn()
      onSuccess?.(data.value)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      onError?.(error.value)
    } finally {
      pending.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return { data, error, pending, execute }
}
```

## Pattern 5: Countdown/Timer Composable

```typescript
// composables/useCountdown.ts
import { ref, computed } from 'vue'

export function useCountdown(initialSeconds: number) {
  const remaining = ref(initialSeconds)
  let interval: number | null = null

  const isActive = computed(() => remaining.value > 0)
  
  const formatted = computed(() => {
    const mins = Math.floor(remaining.value / 60)
    const secs = remaining.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  function start() {
    if (interval) return
    interval = window.setInterval(() => {
      if (remaining.value > 0) {
        remaining.value--
      } else {
        stop()
      }
    }, 1000)
  }

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function reset() {
    stop()
    remaining.value = initialSeconds
  }

  return { remaining, formatted, isActive, start, stop, reset }
}
```

## Pattern 6: Debounce/Throttle Composable

```typescript
// composables/useDebounce.ts
import { ref, computed, watch } from 'vue'

export function useDebounce<T>(value: any, delay: number = 300) {
  const debounced = ref(value)

  let timeout: number | null = null

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  watch(value, (newVal) => {
    clear()
    timeout = window.setTimeout(() => {
      debounced.value = newVal
    }, delay)
  })

  return { debounced, clear }
}

// Usage in component
export function useThrottle<T>(callback: (value: T) => void, delay: number = 300) {
  let lastCall = 0

  return (value: T) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      callback(value)
    }
  }
}
```

## Pattern 7: Expose Reactive State Pattern

```typescript
// composables/useCounter.ts
import { ref } from 'vue'

export function useCounter(initial: number = 0) {
  const count = ref(initial)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initial
  }

  return { count, increment, decrement, reset }
}
```

## Best Practices for Composables

✅ **Do:**
- Use `use` prefix for naming
- Export single, focused logic
- Include TypeScript types/interfaces
- Handle cleanup in `onUnmounted`
- Document parameters and return values
- Return reactive references and methods

❌ **Avoid:**
- Global state mutations (communicate via parent)
- Complex nested logic (extract into smaller composables)
- Side effects without cleanup
- Overly generic "utility" composables
- Not exporting types for better IDE support

## Composition Pattern: Combining Composables

```typescript
// composables/useUserForm.ts
import { computed } from 'vue'
import { useForm } from './useForm'
import { useAsync } from './useAsync'

interface User {
  name: string
  email: string
  password: string
}

const rules = {
  name: [{ validate: (v) => v.length > 0, message: 'Required' }],
  email: [{ validate: (v) => /@/.test(v), message: 'Invalid email' }],
  password: [{ validate: (v) => v.length >= 8, message: 'Min 8 chars' }],
}

export function useUserForm() {
  const form = useForm<User>(
    { name: '', email: '', password: '' },
    rules
  )

  const submitAsync = useAsync(
    async () => {
      if (!form.isValid.value) throw new Error('Form invalid')
      // Make API call here
      return await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(form.formData),
      })
    },
    {
      immediate: false,
      onSuccess: () => form.reset(),
    }
  )

  return { ...form, ...submitAsync }
}
```
