# Performance Optimization Guide for Vue 3

## Critical Performance Patterns

### 1. Computed Property Stability (Vue 3.4+)

Effects dependent on computed properties only re-run if the computed value changes:

```typescript
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => {
  console.log('isEven:', isEven.value) // Logs on mount and when value changes
})

// These won't trigger new watchEffect runs because computed value stays 'true'
count.value = 2  // isEven still true, no log
count.value = 4  // isEven still true, no log
count.value = 5  // isEven now false, logs once
```

**Key benefit:** Prevents unnecessary re-computations and watchers.

### 2. V-Memo Directive

Memoize sub-trees with dependency tracking to prevent unnecessary re-renders:

```vue
<!-- Basic memoization: Skip re-render if dependencies unchanged -->
<div v-memo="[valueA, valueB]">
  Expensive template
</div>

<!-- Empty array: Never updates (like v-once) -->
<div v-memo="[]">
  Static content
</div>

<!-- Large list optimization -->
<div v-for="item in list" :key="item.id" v-memo="[item.id === activeId]">
  <p>ID: {{ item.id }}</p>
  <span :class="{ active: item.id === activeId }">
    {{ item.name }}
  </span>
  <!-- Child content only updates when active state changes -->
</div>
```

**When to use:** Complex components with expensive computations that don't change frequently.

### 3. shallowRef for Large Data Structures

For performance-critical scenarios with deeply nested, large immutable data:

```typescript
import { shallowRef } from 'vue'

// Large data that rarely changes internally
const largeArray = shallowRef([
  { id: 1, data: { nested: { deep: 'value' } } },
  // ... thousands of items
])

// ✓ This WILL trigger reactivity (replace root reference)
largeArray.value = [...largeArray.value, newItem]

// ✗ This won't trigger reactivity (nested mutation)
largeArray.value[0].data.nested.deep = 'new value'

// ✓ Do this instead (trigger at root level)
largeArray.value = [
  {
    ...largeArray.value[0],
    data: {
      ...largeArray.value[0].data,
      nested: { deep: 'new value' },
    },
  },
  ...largeArray.value.slice(1),
]
```

**Use case:** Large API responses, cached datasets, or imported large JSON files.

### 4. Stable Props to Prevent Child Re-renders

Create computed values in parent to ensure child components receive stable props:

```vue
<!-- Parent Component -->
<template>
  <!-- ✓ Good: Computed value is stable unless activeId changes -->
  <ListItem
    v-for="item in list"
    :key="item.id"
    :id="item.id"
    :active="item.id === activeId"
  />

  <!-- ✗ Avoid: Creates new object every render -->
  <!-- <ListItem
    v-for="item in list"
    :key="item.id"
    :active="{ isActive: item.id === activeId }"
  /> -->
</template>

<script setup>
import { ref, computed } from 'vue'

const activeId = ref(null)
const list = ref([...])
</script>
```

**Impact:** Reduces unnecessary prop updates and child component re-renders.

### 5. Template Ref Caching

Avoid creating new refs in computed properties:

```vue
<!-- ✗ Bad: Creates new array every render -->
<div
  v-for="item in items"
  :ref="el => { if (el) itemRefs[item.id] = el }"
  :key="item.id"
>
  {{ item.name }}
</div>

<!-- ✓ Good: Use Map for template refs -->
<script setup>
const itemRefs = new Map()

const setItemRef = (item, el) => {
  if (el) itemRefs.set(item.id, el)
}
</script>

<template>
  <div
    v-for="item in items"
    :ref="el => setItemRef(item, el)"
    :key="item.id"
  >
    {{ item.name }}
  </div>
</template>
```

## Rendering Strategy Patterns

### V-Show vs V-If

```vue
<!-- Use v-show for frequently toggled elements -->
<!-- Hidden with CSS (display: none), stays in DOM -->
<div v-show="isVisible">
  <!-- DOM stays mounted, only CSS visibility changes -->
  <!-- Faster for frequent toggling -->
</div>

<!-- Use v-if when element is rarely shown -->
<!-- Removed from DOM when false -->
<div v-if="isModalOpen">
  <!-- Removed from DOM, no rendering cost when hidden -->
  <!-- Slower to show initially due to mounting overhead -->
</div>
```

**Rule of thumb:** Toggles frequently? Use `v-show`. Rarely shown? Use `v-if`.

### KeepAlive for Expensive Components

```vue
<!-- Cache expensive component state -->
<KeepAlive max="10">
  <component :is="currentComponent" />
</KeepAlive>

<script setup>
import { ref } from 'vue'
import ExpensiveComponent from './ExpensiveComponent.vue'
import AnotherComponent from './AnotherComponent.vue'

const currentComponent = ref(ExpensiveComponent)

// Switching components won't re-initialize them if within max cache
</script>
```

**Benefit:** Keeps expensive component instances alive to avoid re-initialization.

### Lazy Loading Components and Routes

```typescript
// composables/useLazyComponent.ts
import { defineAsyncComponent } from 'vue'

export const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

// Or with router
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),
  },
  {
    path: '/settings',
    component: () => import('./views/Settings.vue'),
  },
]
```

**Result:** Code splitting — each component loaded only when needed.

## Computed vs Methods

### Use Computed for Derived State

```typescript
import { ref, computed } from 'vue'

const items = ref([1, 2, 3, 4, 5])

// ✓ Good: Cached, only recomputes if items changes
const total = computed(() => {
  console.log('Computing total...')
  return items.value.reduce((a, b) => a + b, 0)
})

// ✗ Bad: Runs on every render
function getTotalMethod() {
  console.log('Computing total...')
  return items.value.reduce((a, b) => a + b, 0)
}

// Every template reference calls getTotal multiple times
<template>
  <p>{{ total }}</p>        <!-- Cached, logs once -->
  <p>{{ getTotalMethod() }}</p> <!-- Not cached, logs each render -->
</template>
```

**Performance gain:** Computed properties are memoized and only recalculate when dependencies change.

## Watch Strategy Optimization

### Avoid Deep Watching When Possible

```typescript
import { ref, watch } from 'vue'

const user = ref({ name: 'Alice', email: 'alice@example.com' })

// ✗ Bad: Deep watching is expensive
watch(user, () => {
  console.log('User changed')
}, { deep: true }) // Watches all nested properties

// ✓ Good: Watch specific properties
watch(() => user.value.name, () => {
  console.log('Name changed')
})

// ✓ Also good: Multiple specific watchers
watch([
  () => user.value.name,
  () => user.value.email,
], () => {
  console.log('User data changed')
})
```

**Impact:** Deep watching can cause significant performance issues with large objects.

### Immediate Option Trade-offs

```typescript
// ✗ Avoid unnecessary immediate execution
watch(source, () => {
  // This runs immediately on component mount
}, { immediate: true })

// ✓ Better: Initialize separately if needed
onMounted(() => {
  handler() // Manual initialization
})

watch(source, handler) // Runs only on changes
```

## Bundle Size Optimization

### Tree-Shaking with Composables

```typescript
// ✓ Good: Imports only used functions
import { ref, computed } from 'vue'

// ✗ Bad: Imports unused utilities
import * as Vue from 'vue'
const counter = Vue.ref(0)
```

### Lazy Load Named Imports

```typescript
// ✓ Code-split heavy utilities
const { heavyLibrary } = await import('./heavy-utils')

// Instead of
import { heavyLibrary } from './heavy-utils'
```

## Runtime Performance Checklist

- [ ] Use `computed` instead of methods for derived state
- [ ] Implement `v-memo` for expensive list items
- [ ] Use `v-show` for frequently toggled elements
- [ ] Cache template refs in Map, not computed properties
- [ ] Avoid deep watchers; watch specific properties
- [ ] Use `shallowRef` for large immutable structures
- [ ] Lazy-load routes and heavy components
- [ ] Use `KeepAlive` for expensive components
- [ ] Profile with Vue DevTools Performance tab
- [ ] Monitor bundle size in build output

## Profiling Tools

### Vue DevTools

```typescript
// Enable Vue DevTools timeline
// Components → Timeline → Record interactions
// Identify which components are re-rendering
```

### Performance API

```typescript
// Manual performance measurement
performance.mark('operation-start')
// ... operation code
performance.mark('operation-end')
performance.measure('operation', 'operation-start', 'operation-end')

const measure = performance.getEntriesByName('operation')[0]
console.log(`Operation took ${measure.duration}ms`)
```

### Build Analysis

```bash
# Analyze bundle size
npm run build -- --mode analyze

# View what's being bundled
npm install -D rollup-plugin-visualizer
```

## Common Performance Issues & Fixes

| Problem | Cause | Solution |
|---------|-------|----------|
| Slow list rendering | Creating new objects in props | Use computed for stable props |
| Unnecessary re-renders | Missing keys or wrong deps | Use `:key`, check watch deps |
| Large initial load | No code splitting | Lazy load routes/components |
| Memory leaks | Watchers not cleaned up | Use `onUnmounted` cleanup |
| Jank on scroll | Heavy computation in template | Use `v-memo`, `computed` |
| Bundle bloat | Importing unused code | Use tree-shaking, named imports |
