# Component Template Reference

## Base Component Template (Reusable UI)

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
}>()

const sizeClasses = computed(() => ({
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}[props.size]))

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="sizeClasses"
    :disabled="disabled"
    @click="handleClick"
    @focus="emit('focus', $event)"
  >
    {{ title }}
    <slot />
  </button>
</template>

<style scoped>
button {
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  border-color: #333;
  background-color: #f5f5f5;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## Feature Component Template

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

interface Item {
  id: number
  name: string
  completed: boolean
}

interface Props {
  items: Item[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()

const filter = ref<'all' | 'active' | 'completed'>('all')

const filteredItems = computed(() => {
  return props.items.filter(item => {
    if (filter.value === 'active') return !item.completed
    if (filter.value === 'completed') return item.completed
    return true
  })
})

const stats = computed(() => ({
  total: props.items.length,
  completed: props.items.filter(i => i.completed).length,
  active: props.items.filter(i => !i.completed).length,
}))
</script>

<template>
  <div class="feature-container">
    <header>
      <h2>Items ({{ stats.total }})</h2>
      <div class="filters">
        <button
          v-for="option in ['all', 'active', 'completed']"
          :key="option"
          :class="{ active: filter === option }"
          @click="filter = option"
        >
          {{ option }}
        </button>
      </div>
    </header>

    <ul class="items-list">
      <li v-for="item in filteredItems" :key="item.id" class="item">
        <input
          type="checkbox"
          :checked="item.completed"
          @change="emit('toggle', item.id)"
        />
        <span :class="{ completed: item.completed }">{{ item.name }}</span>
        <BaseButton size="sm" @click="emit('delete', item.id)">
          Delete
        </BaseButton>
      </li>
    </ul>

    <footer v-if="filteredItems.length === 0" class="empty-state">
      No items to display
    </footer>
  </div>
</template>

<style scoped>
.feature-container {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

header {
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.filters button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.filters button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.items-list {
  list-style: none;
  padding: 0;
}

.item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.item span.completed {
  text-decoration: line-through;
  color: #888;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #888;
}
</style>
```

## Data Fetching Component

```vue
<script setup lang="ts">
import { useFetch } from '@/composables/useFetch'

interface Props {
  url: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Data',
})

const { data, loading, error } = useFetch<any[]>(props.url)
</script>

<template>
  <div class="fetch-container">
    <h3>{{ title }}</h3>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      Error: {{ error.message }}
    </div>

    <div v-else-if="data" class="content">
      <slot :data="data" :count="data.length">
        <p>{{ data.length }} items loaded</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.fetch-container {
  padding: 1rem;
}

.loading,
.error {
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.loading {
  background: #f0f8ff;
  color: #0066cc;
}

.error {
  background: #ffe6e6;
  color: #cc0000;
}

.content {
  margin-top: 1rem;
}
</style>
```
