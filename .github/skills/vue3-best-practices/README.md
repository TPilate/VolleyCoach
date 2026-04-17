# Vue 3 Best Practices Skill

A comprehensive skill for building scalable Vue 3 applications following industry best practices.

## 📋 Skill Contents

### Main Documentation
- **SKILL.md** — Start here
  - When to use this skill
  - Quick decision guides
  - Component architecture & naming
  - API style comparison (Composition vs Options)
  - Reactivity patterns
  - Composables for logic reuse
  - Performance optimization basics
  - TypeScript integration
  - Development workflow

### Reference Documentation
Detailed examples and patterns:

1. **references/component-templates.md**
   - Base Component template with props/emits
   - Feature Component with complex logic
   - Data Fetching Component example
   - Styled component patterns

2. **references/composable-patterns.md**
   - useFetch (data fetching with abortion)
   - useForm (form validation & state)
   - useLocalStorage (browser storage sync)
   - useAsync (async operations)
   - useCountdown (timer logic)
   - useDebounce/useThrottle (rate limiting)
   - Composable combination patterns

3. **references/typescript-patterns.md**
   - Props interface definitions
   - Emits type safety
   - Form data interfaces
   - API response types
   - Utility types (Partial, Required, Record, etc.)
   - Discriminated unions
   - Generic composables
   - Type-safe event handlers
   - Template ref typing

4. **references/performance-optimization.md**
   - Computed property stability
   - v-memo directive usage
   - shallowRef for large data
   - Stable props pattern
   - v-show vs v-if strategy
   - KeepAlive component caching
   - Lazy loading routes/components
   - Watch optimization
   - Bundle size reduction
   - Profiling tools

## 🚀 How to Use This Skill

### Invoke in VS Code
Type `/` in the chat and search for "vue3" or any of these keywords:
- "component"
- "Composition API"
- "TypeScript"
- "composable"
- "performance"
- "architecture"

### Common Tasks

**Creating a new component:**
1. Ask: "Create a Vue 3 component for [purpose]"
2. Agent loads SKILL.md and suggests Composition API + TypeScript
3. Reference [component-templates.md](./references/component-templates.md) for full example

**Extracting reusable logic:**
1. Ask: "Extract this logic into a composable"
2. Agent suggests composable pattern
3. Reference [composable-patterns.md](./references/composable-patterns.md) for full implementation

**Performance optimization:**
1. Ask: "Optimize this list rendering"
2. Agent loads SKILL.md performance section
3. Reference [performance-optimization.md](./references/performance-optimization.md) for patterns

**TypeScript setup:**
1. Ask: "Add TypeScript to this component"
2. Agent loads TypeScript section
3. Reference [typescript-patterns.md](./references/typescript-patterns.md) for types

## ✅ Skill Features

- **Decision guides** — Choose the right API style and pattern
- **Code examples** — Copy-paste ready implementations
- **Best practices** — Industry standards for Vue 3
- **TypeScript first** — Type safety throughout
- **Performance focused** — Optimization patterns included
- **Progressive loading** — Main content concise, detailed refs on demand

## 🎯 Quick Reference: Key Decisions

| Scenario | Recommendation |
|----------|---|
| **Complex app** | Composition API + TypeScript |
| **Simple component** | Options API or lightweight Composition |
| **Reusable logic** | Composable with `use` prefix |
| **Performance critical** | Use `computed`, `v-memo`, `shallowRef` |
| **Team project** | Strict naming + TypeScript types |
| **Migrating from Vue 2** | Start with Options API, gradually migrate |

## 📚 Related Resources

- [Vue 3 Official Docs](https://vuejs.org/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Style Guide](https://vuejs.org/style-guide/)
- [TypeScript Support](https://vuejs.org/guide/typescript/)

## 💡 Tips

- Always use `<script setup lang="ts">` for Composition API
- Name composables with `use` prefix (e.g., `useFetch`, `useForm`)
- Use named `withDefaults` for props with defaults
- Extract to composables when logic is reused >2 times
- Profile with Vue DevTools Performance tab
- Keep SKILL.md as your reference, detailed docs in separate files

## 🤔 Common Questions

**Q: Should I use Composition or Options API?**
A: Composition API for scalability and modern apps. Options API for simple components or Vue 2 migrations.

**Q: When should I create a composable?**
A: Extract logic when it's used in 2+ components, or complex logic in 1 component.

**Q: How do I optimize Vue 3 performance?**
A: Use `computed` for derived state, `v-memo` for expensive templates, `shallowRef` for large data.

**Q: Do I need TypeScript?**
A: Highly recommended for teams. Catch errors early and improve IDE support.

---

**Last Updated:** April 2026  
**Skill Version:** 1.0  
**Tested with:** Vue 3.4+, Vite, TypeScript 5+
