# Design System Specification: The Liquid Athletic Standard
 
## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Prism"**
 
This design system moves beyond static management tools to create a living, breathing environment for elite volleyball performance. Inspired by the "Liquid Glass" aesthetic, the system prioritizes **Atmospheric Depth** over structural rigidity. By blending high-performance utility with an editorial, immersive finish, we transform a coach’s dashboard from a spreadsheet into a tactical command center.
 
The "Kinetic Prism" breaks the traditional grid through:
- **Refractive Layering:** Elements feel suspended in a pressurized fluid, not just "pasted" on a screen.
- **Intentional Asymmetry:** Using the Bento Grid to create focal points that draw a coach’s eye to high-priority live match data.
- **Micro-interactions:** Subtle shifts in refraction and frost levels when an element is touched or hovered.
 
---
 
## 2. Colors & Surface Hierarchy
 
The palette is rooted in a deep, nocturnal base (`#0e0e10`) to provide maximum contrast for high-energy accents. We utilize a system-centric hierarchy that mirrors a native OS feel while introducing custom "Volleyball Blue" and "Sunset Orange" for strategic emphasis.
 
### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Structural boundaries must be defined solely through background shifts. For example, a `surface-container-low` section sitting on a `surface` background is the only acceptable way to define a block.
 
### Surface Hierarchy & Nesting
Treat the UI as a series of physical, translucent layers. 
- **Base Level:** `surface` (#0e0e10) - The deep, primary canvas.
- **Secondary Tier:** `surface-container-low` (#131315) - Large layout blocks (e.g., the background of a Bento section).
- **Interactive Tier:** `surface-container-highest` (#252528) - Modals and popovers that require immediate attention.
 
### The "Glass & Gradient" Rule
To achieve the "Liquid Glass" look, use `backdrop-filter: blur(20px)` combined with semi-transparent surface colors.
- **Floating Sidebars:** Use `surface-bright` (#2c2c2f) at 60% opacity with a heavy blur.
- **Signature Textures:** Apply a subtle linear gradient from `primary` (#85adff) to `primary-container` (#6c9fff) on main CTAs. This creates a "glow from within" rather than a flat fill.
 
---
 
## 3. Typography
The system uses a dual-font strategy to balance high-end editorial flair with tactical legibility.
 
| Level | Token | Font | Size | Weight | Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Manrope | 3.5rem | 700 | Large scores, set counts |
| **Headline** | `headline-md` | Manrope | 1.75rem | 600 | Dashboard section headers |
| **Title** | `title-md` | Inter | 1.125rem | 500 | Player names, Drill titles |
| **Body** | `body-md` | Inter | 0.875rem | 400 | Notes, descriptions |
| **Label** | `label-md` | Inter | 0.75rem | 600 | High-contrast status badges |
 
**Hierarchy Note:** Use `manrope` for data-heavy displays to evoke an authoritative, premium feel. Use `inter` for high-density information where clarity is paramount during a fast-paced match.
 
---
 
## 4. Elevation & Depth
 
### The Layering Principle
Depth is achieved through **Tonal Layering**. Instead of drop shadows, stack surfaces:
- Place a `surface-container-lowest` card (#000000) on a `surface-container-low` (#131315) section. This creates a natural "recessed" look for data tables.
 
### Ambient Shadows
When a "floating" effect is mandatory (e.g., a floating action button):
- **Shadow:** 0px 12px 32px 0px.
- **Color:** `on-surface` (#fefbfe) at 6% opacity. This mimics natural light diffusion in a gym environment.
 
### The "Ghost Border" Fallback
If a border is required for accessibility, it must be a **Ghost Border**:
- Use `outline-variant` (#48474a) at **15% opacity**. Never use 100% opaque lines.
 
---
 
## 5. Components
 
### Bento Cards
- **Structure:** Use `xl` (1.5rem) corner radius.
- **Style:** No borders. Background: `surface-container-low`. 
- **Content:** Use vertical white space (24px - 32px) to separate the title from the data visualization.
 
### Primary Buttons (Liquid CTA)
- **Background:** Gradient of `primary` to `primary-fixed`.
- **Text:** `on-primary` (#002c65).
- **Shape:** `full` (9999px) for "Start Match" or `md` (0.75rem) for utility actions.
 
### Tactical Chips
- **Selection:** `secondary-container` (#a63b00) with `on-secondary` text.
- **Inactive:** `surface-container-highest` with `on-surface-variant` text.
 
### Court Visualizers (Custom Component)
- Represent the volleyball court using `surface-container-lowest`.
- Use `tertiary` (#86d6ff) for player position markers to ensure high-contrast visibility against the dark background.
 
### Input Fields
- **Background:** `surface-container-highest`.
- **Active State:** Change background to `surface-bright` and increase the backdrop-blur. No focus ring; use a 2px `primary` underline or "glow" instead.
 
---
 
## 6. Do's and Don'ts
 
### Do
- **DO** use asymmetry in the Bento Grid to highlight "Live Stats" vs. "Season History."
- **DO** rely on the 4.5:1 contrast ratio by using `on-surface` (#fefbfe) on dark containers.
- **DO** use "Sunset Orange" (`secondary`) sparingly—only for urgent errors or "Live" indicators.
 
### Don't
- **DON'T** use dividers or lines to separate list items. Use 12px of vertical padding instead.
- **DON'T** use pure white backgrounds. The darkest surface is `#0e0e10`, and the brightest is `#2c2c2f`.
- **DON'T** use standard shadows. If an element doesn't feel "deep" enough, increase the backdrop-blur rather than adding a darker shadow.
