---
name: volleyball-design-system
description: "Build VolleyCoach UI following the Liquid Athletic design system. Use when: creating components, styling pages, building layouts, choosing colors, working with typography, implementing buttons/forms, or reviewing designs for consistency. Covers both light mode (Kinetic Clarity) and dark mode (Kinetic Prism) with core rules: no borders, glass & gradient effects, tonal hierarchy, and athletic editorial aesthetics."
argument-hint: "Describe what you're building or the design question (e.g., 'Create a live stats card', 'Style a coach form', 'Check color usage')"
---

# VolleyCoach Liquid Athletic Design System

## Creative North Star

The VolleyCoach design system rejects traditional "boxed-in" SaaS interfaces. Instead, it embraces **editorial asymmetry** and **atmospheric depth** to create an interface that feels as fast and responsive as professional volleyball.

- **Light Mode** ("Kinetic Clarity"): Editorial breathing room, white space emphasis, high-end minimalism
- **Dark Mode** ("Kinetic Prism"): Pressurized depth, refractive layering, neon accents for live data

## Core Design Rules (Non-Negotiable)

### 1. The "No-Line" Rule ⛔️ Borders Forbidden
**No 1px solid borders for sectioning.** Boundaries are defined purely through:
- **Color transitions** (surface shifts)
- **Tonal hierarchy** (layering surfaces)
- **White space** (spacing, not lines)

If accessibility requires a boundary, use "Ghost Borders": `outline-variant` at **15% opacity** (barely visible).

### 2. The "Glass & Gradient" Rule 
**Primary actions must never be flat.**
- **Main CTAs**: Gradient from `primary` to `primary-container` at 135° angle
- **Floating elements**: Semi-transparent surface + `backdrop-filter: blur(20px-40px)` for "Liquid Glass" effect
- **Micro-animations**: On hover, increase shadow spread and brighten gradient (no color change)

### 3. Surface Hierarchy & Nesting
Treat the UI as a **stack of physical materials**:

**Light Mode Stack:**
- `surface` (#f8f9fa) — Base canvas
- `surface-container-low` (#f3f4f5) — Structural zones
- `surface-container-highest` — Input backgrounds
- `surface-container-lowest` (#ffffff) — Interactive elements (pure white, maximum contrast)

**Dark Mode Stack:**
- `surface` (#0e0e10) — Deep nocturnal base
- `surface-container-low` (#131315) — Layout blocks
- `surface-container-highest` (#252528) — Modals & popovers
- `surface-container-lowest` (#000000) — Recessed data tables

## Typography: Manrope + Inter Dual Strategy

| Use Case | Font | Size | Weight | Example |
|----------|------|------|--------|---------|
| Massive scores, set counts | Manrope | 3.5rem | Bold (700) | `display-lg` |
| Section headers | Manrope | 1.75rem | Semi-Bold (600) | `headline-md` |
| Player names, drill titles | Inter | 1.125rem | Medium (500) | `title-md` |
| Notes, descriptions | Inter | 0.875rem | Regular (400) | `body-md` |
| Status badges, tags | Inter | 0.75rem | Semi-Bold (600) | `label-md` |

**Rule**: In light mode, always use `on-surface` (#191c1d) instead of pure black. In dark mode, use `on-surface` (#fefbfe).

## Components Quick Reference

### Buttons
- **Primary**: Gradient fill, `full` roundedness (pill), white text, glow on hover
- **Secondary (Glass)**: Semi-transparent `surface-container-lowest` with backdrop blur, `md` roundedness
- **No borders allowed**

### Input Fields
- **Style**: Subtle fill of `surface-container-high`, `md` corner radius (0.75rem)
- **Active**: Background → `surface-container-lowest`, add "Ghost Border" of `primary` at 20% opacity
- **No underlines**

### Cards & Lists
- **Forbidden**: 1px divider lines between items
- **Separation**: 16-24px white space OR alternating tonal shifts
- **Corner radius**: `xl` (1.5rem) for cards, `lg` for structural elements

### Data Display (Athletic Focus)
- **Metric Tiles**: Large `display-sm` numbers with `label-sm` descriptions
- **Background**: `surface-container-lowest` with subtle `primary` tint (2% opacity)
- **Court Visualizers**: Use `tertiary` for high-contrast player position markers

## Do's and Don'ts

### ✅ Do
- Embrace negative space — "empty" screens often work better
- Use `primary` (#0058bc light / #85adff dark) as a laser pointer for critical actions
- Stack 2-3 layers of surfaces max; more muddy the design
- Use `full` roundedness (9999px) for action items, `lg/xl` for structural items
- Create depth with tonal shifts, not heavy shadows
- Use all-caps, 0.05rem letter-spacing for technical category labels

### ❌ Don't
- Use black text (#000000) — always use `on-surface` for premium feel
- Draw lines to separate content; use spacing or tonal shifts
- Use standard Material Design shadows — keep diffuse and soft (blur 32-64px, opacity 4-8%)
- Combine more than 2 gradients on one screen
- Use divider borders in lists — 12px padding does the job

## When to Apply Each Mode

- **Light Mode (Kinetic Clarity)**: Used when sunlight/daytime context expected
- **Dark Mode (Kinetic Prism)**: Used for high-intensity coaching during matches (gym lighting)

Both modes follow **identical structural rules** — only color palettes differ.

## Decision Tree: Building a New Component

1. **What's its function?**
   - Action → Button (gradient + glass optional)
   - Input → Minimalist field (ghost border on active)
   - Display → Card or metric tile (tonal layering)

2. **Does it need to pop?** → Apply glass + gradient + backdrop blur
3. **Does it need hierarchy?** → Use surface nesting or tonal shifts
4. **Accessibility check** → 4.5:1 contrast, Ghost Border if boundary needed
5. **Review**: No lines, no heavy shadows, intentional asymmetry for editorial feel

## Resources

- [Light Design Specification](../../docs/light-design.md) — Full "Kinetic Clarity" details
- [Dark Design Specification](../../docs/design.md) — Full "Kinetic Prism" details

---

**Example prompts to try this skill:**
- "Create a live match stats card following the design system"
- "Build a coaching form input with proper focus states"
- "Design a player substitution button that fits the athletic aesthetic"
- "Review this dashboard layout for design system compliance"
