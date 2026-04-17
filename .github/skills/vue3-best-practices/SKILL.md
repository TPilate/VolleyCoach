---
name: vue3-best-practices
description: 'Build scalable Vue 3 applications following best practices for components, TypeScript, API selection, reactivity, and performance. Use when: creating new components, refactoring Vue code, choosing between Composition/Options API, implementing composables, optimizing performance, or setting up TypeScript.'
argument-hint: 'Describe your Vue 3 task: "Create a user profile component", "Optimize list rendering", "Set up store pattern"'
---

# Vue 3 Best Practices & Architecture

## When to Use This Skill

✅ **Use this skill when:**
- Creating new Vue 3 components or application structure
- Deciding between Composition API vs Options API
- Implementing TypeScript in Vue components
- Building reusable logic with composables
- Optimizing component performance or reactivity
- Setting up component architecture for scaling
- Refactoring existing Vue code to follow best practices
- Choosing naming conventions and file organization

## Quick Decision Guide

| Scenario | Recommendation |
|----------|---|
| Complex, scalable app | Composition API + TypeScript + Composables |
| Simple component | Options API or lightweight Composition |
| Reusable logic needed | Extract into composable with `use` prefix |
| Performance critical | Use `computed`, `v-memo`, or `shallowRef` |
| Large team project | Strict naming conventions + TypeScript types |
| Migrating from Vue 2 | Start with Options API, gradually migrate |

## Architecture & Project Structure

### Directory Organization

Organize components logically for maintainability:

```
src/
├── components/
│   ├── base/              # Reusable UI elements (BaseButton, BaseTable)
│   ├── features/          # Feature-specific components
│   └── layout/            # Layout components (Header, Footer)
├── composables/           # Reusable logic (useFetch, useRouter, useValidation)
├── stores/                # Global state (Pinia, plain reactive)
├── pages/ or views/       # Page-level components
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
├── App.vue
└── main.ts
```

### Naming Conventions

**Base Components (UI-focused):**
- Use consistent prefix: `Base`, `App`, or `V`
- Examples: `BaseButton.vue`, `AppCard.vue`, `VIcon.vue`
- Benefit: Easier to identify reusable elements and enable auto-registration

**Feature Components:**
- Use descriptive, PascalCase names
- Examples: `UserProfile.vue`, `TodoItem.vue`, `ProductCard.vue`

**Composables (Logic):**
- Use `use` prefix: `useFetch`, `useRouter`, `useValidation`, `useForm`
- Examples: `composables/useFetch.ts`, `composables/useLocalStorage.ts`

**Page Components:**
- Match route names in PascalCase
- Examples: `HomePage.vue`, `AboutPage.vue`, `ProfilePage.vue`

## API Style: Choose the Right Approach

### Composition API (Recommended for Vue 3)

**Use when:**
- Building scalable applications
- Creating complex, reusable logic
- Your team is comfortable with reactivity concepts
- You need flexible component structure

**Core Advantages:**
- Excellent for logic reuse via composables
- Tree-shaking friendly (unused code is eliminated)
- Better TypeScript support and IDE intellisense
- More intuitive for large applications

**Basic Structure:**

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

const emit = defineEmits<{
  update: [value: string]
  delete: [id: number]
}>()

const message = ref('Hello')
const doubled = computed(() => props.count * 2)

function handleClick() {
  message.value = 'Clicked!'
  emit('update', message.value)
}

onMounted(() => {
  console.log('Mounted:', props.title)
})

defineExpose({ message })
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }} (doubled: {{ doubled }})</p>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<style scoped>
h1 { color: blue; }
</style>
```

### Options API (For Simpler Components)

**Use when:**
- Building simple, lightweight components
- Migrating from Vue 2
- Preferring the "component instance" mental model
- Non-technical team members need to read code

**Core Advantages:**
- Gentler learning curve
- Automatic code organization
- Clear separation of concerns

## Reactivity Essentials

### Core Reactivity Functions

```typescript
import { ref, reactive, watch, watchEffect, computed } from 'vue'

// Single values: use ref
const count = ref(0)
count.value++  // Access with .value

// Objects: use reactive (no .value needed)
const user = reactive({ name: 'Alice', age: 25 })
user.name = 'Bob'

// Computed (read-only derived state)
const doubled = computed(() => count.value * 2)

// Watch for specific changes
watch(count, (newVal, oldVal) => {
  console.log(`Changed from ${oldVal} to ${newVal}`)
})

// Auto-track all dependencies (powerful but use carefully)
watchEffect(() => {
  console.log(`Count: ${count.value}, Name: ${user.name}`)
})
```

### Shared State Pattern (Simple Global State)

```typescript
// store.ts
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() { this.count++ },
  decrement() { this.count-- },
})
```

```vue
<!-- Component.vue -->
<script setup>
import { store } from '@/store'
</script>

<template>
  <p>Count: {{ store.count }}</p>
  <button @click="store.increment">+</button>
  <button @click="store.decrement">-</button>
</template>
```

## Component Implementation Patterns

### SFC (Single-File Component) Block Order

Always use this order for consistency:

1. `<script setup>` (or `<script>`)
2. `<template>`
3. `<style scoped>`

### Template Refs & Component Exposure

```vue
<script setup lang="ts">
import { ref } from 'vue'

const inputRef = ref<HTMLInputElement>()
const message = ref('Hello')

function reset() {
  message.value = 'Hello'
  inputRef.value?.focus()
}

// Expose to parent via template refs
defineExpose({ message, reset })
</script>

<template>
  <input ref="inputRef" v-model="message" />
</template>
```

## Composables: Logic Reuse

Extract repeated logic into composables with the `use` prefix:

```typescript
// composables/useFetch.ts
import { ref, onMounted } from 'vue'

export function useFetch(url: string) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  onMounted(async () => {
    loading.value = true
    try {
      const res = await fetch(url)
      data.value = await res.json()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  })

  return { data, error, loading }
}
```

```vue
<!-- UserList.vue -->
<script setup>
import { useFetch } from '@/composables/useFetch'

const { data: users, loading, error } = useFetch('/api/users')
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

## Performance Optimization

### 1. Computed Property Stability

Only re-run effects when the computed value actually changes:

```typescript
const isEven = computed(() => count.value % 2 === 0)
watchEffect(() => console.log(isEven.value)) // Only logs on actual changes
```

### 2. v-memo Directive

Memoize sub-trees to prevent unnecessary re-renders:

```vue
<!-- Skip re-render if dependencies unchanged -->
<div v-memo="[itemId, isSelected]">
  <p>ID: {{ itemId }}</p>
  <span>Selected: {{ isSelected }}</span>
</div>

<!-- Optimize large lists -->
<div v-for="item in items" :key="item.id" v-memo="[item.id === activeId]">
  <!-- Content only updates when active state changes -->
</div>
```

### 3. shallowRef for Large Structures

Use when working with large immutable data:

```typescript
const largeArray = shallowRef([...])

// ✓ This triggers reactivity (replace root)
largeArray.value = [...largeArray.value, newItem]

// ✗ This doesn't (nested mutation)
largeArray.value.push(newItem)
```

### 4. General Performance Best Practices

- Use `v-show` for frequently toggled elements
- Lazy-load routes and components
- Use `KeepAlive` for expensive component initialization
- Optimize images and assets
- Monitor bundle size with `npm run build`

## TypeScript Integration

### Props with Full Type Safety

```typescript
interface Props {
  title: string
  count?: number
  items: Array<{ id: number; name: string }>
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [],
})
```

### Emits with Types

```typescript
const emit = defineEmits<{
  update: [value: string]
  delete: [id: number]
  'save-draft': [content: string]
}>()

emit('update', 'new value')
emit('delete', 42)
```

### Reactive State with Types

```typescript
const message = ref<string>('Hello')
const numbers = ref<number[]>([1, 2, 3])
const user = reactive<User>({ id: 1, name: 'Alice' })
```

## Development Workflow

### Step-by-Step: Create a New Component

1. **Determine scope**: Is this base/feature/page/layout?
2. **Choose API style**: Composition (recommended) or Options?
3. **Define Props** with TypeScript interfaces
4. **Set up State** (ref/reactive/computed)
5. **Implement Methods** and lifecycle hooks
6. **Add Template** with proper structure
7. **Scope Styles** with `<style scoped>`
8. **Export** with `defineExpose` if needed by parents

### Step-by-Step: Extract Reusable Logic

1. **Identify** repeated logic across components
2. **Create** file in `composables/` with `use` prefix
3. **Export** reactive state and methods
4. **Document** parameters and return types
5. **Import** in components using the composable
6. **Test** in isolation to ensure reusability

## Checklist for Code Review

- [ ] Component follows naming convention
- [ ] Using Composition API with `<script setup lang="ts">`
- [ ] Props have TypeScript types
- [ ] Emits are properly typed
- [ ] Reactive state uses appropriate patterns (ref/reactive/computed)
- [ ] Reusable logic extracted to composables
- [ ] Lifecycle hooks follow Vue 3 patterns
- [ ] Styles are scoped (no CSS leaks)
- [ ] No console warnings or errors
- [ ] Component is testable and modular

## Reference Materials

For detailed examples and patterns, see:
- [Component Template Reference](./references/component-templates.md)
- [Composable Patterns](./references/composable-patterns.md)
- [TypeScript Best Practices](./references/typescript-patterns.md)
- [Performance Optimization Guide](./references/performance-optimization.md)

## Common Pitfalls to Avoid

❌ **Don't:**
- Mix Composition API and Options API in the same component
- Use inline computed values in templates (e.g., `:active="{ isActive: item.id === selected }"`)
- Forget to use `.value` when accessing ref in script
- Create new object/array instances in props (use computed instead)
- Use `watch` with deep: true unnecessarily (performance cost)

✅ **Do:**
- Keep components focused and single-purpose
- Extract logic to composables for reuse
- Use TypeScript for type safety
- Follow naming conventions strictly
- Optimize with `computed`, `v-memo`, and `shallowRef`

## Quick Reference: When to use each API function

| Function | Use Case |
|----------|----------|
| `ref` | Single reactive values |
| `reactive` | Object/array state |
| `computed` | Derived/cached values |
| `watch` | React to specific changes |
| `watchEffect` | Auto-track dependencies |
| `onMounted` | DOM/API initialization |
| `onUnmounted` | Cleanup (listeners, timers) |
| `defineProps` | Accept parent data |
| `defineEmits` | Send events to parent |
| `defineExpose` | Share internal state |
