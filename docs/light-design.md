# Design System Strategy: Kinetic Clarity
 
## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Kinetic Clarity."** 
 
In the world of high-performance athletics, clarity is the difference between a point won and a point lost. This system rejects the cluttered, "boxed-in" layout of traditional SaaS platforms. Instead, it adopts a high-end editorial aesthetic where content breathes. We move away from rigid, bordered grids toward an organic, fluid layout that utilizes overlapping surfaces and "Liquid Glass" components. By prioritizing white space and tonal shifts over structural lines, we create an interface that feels as fast and responsive as a professional athlete.
 
**Editorial Signature:** Do not align everything to a single vertical axis. Use intentional asymmetry—place large `display-lg` typography slightly offset from the main content column to create a sense of forward motion. Use overlapping elements (e.g., a "Liquid Glass" card partially covering a hero image) to provide a sense of three-dimensional space.
 
---
 
## 2. Colors & Tonal Hierarchy
The color palette is built on a foundation of "Atmospheric Whites" and "Performance Blues."
 
### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections or separate content. In this design system, boundaries are created through color transitions.
*   **The Background:** Use `surface` (#f8f9fa) as your canvas.
*   **The Sectioning:** Use `surface-container-low` (#f3f4f5) to define secondary zones.
*   **The Nesting:** To separate elements within a section, use `surface-container-lowest` (#ffffff) for the element itself. This creates a natural "pop" without a single line being drawn.
 
### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
1.  **Base:** `surface`
2.  **Structural Zones:** `surface-container`
3.  **Interactive Elements:** `surface-container-lowest` (pure white) to draw the eye.
 
### The "Glass & Gradient" Rule
To achieve the "Liquid Athletic" feel, primary actions should never be flat. 
*   **Main CTAs:** Use a gradient transition from `primary` (#0058bc) to `primary-container` (#0070eb) at a 135-degree angle. This mimics the refraction of light through a lens.
*   **Floating Elements:** For overlays and navigation bars, use semi-transparent `surface_container_lowest` with a **20px-40px Backdrop Blur**. This ensures the "Liquid Glass" effect while maintaining high legibility.
 
---
 
## 3. Typography
We use **Manrope** exclusively. It is a modern, geometric sans-serif that feels engineered yet human.
 
*   **High-Contrast Scaling:** To achieve an editorial look, contrast is key. Pair a `display-lg` headline (3.5rem, Bold) with `body-md` (0.875rem, Medium) support text. The massive size difference conveys authority.
*   **Visual Soul:** Use `label-md` and `label-sm` in `primary` (#0058bc) and All-Caps with 0.05rem letter-spacing for category tags. This mimics the technical spec sheets found in high-performance sports gear.
*   **Readability:** For long-form coaching notes, always use `body-lg` (1rem) with a line height of 1.6 to ensure the eye doesn't tire during film review.
 
---
 
## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** and **Ambient Refraction**, not heavy drop shadows.
 
*   **The Layering Principle:** Instead of adding a shadow to every card, place a `surface-container-lowest` card on a `surface-container-low` background. This creates a "Soft Lift."
*   **Ambient Shadows:** When an element must float (like a modal or a floating action button), use an extra-diffused shadow.
    *   **Blur:** 32px to 64px.
    *   **Opacity:** 4%–8%.
    *   **Color:** Use a tinted version of `on-surface` (#191c1d) rather than pure black to keep the light mode feeling "airy."
*   **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline-variant` (#c1c6d7) at **15% opacity**. It should be felt, not seen.
*   **Liquid Glass Depth:** Use a subtle 1px inner glow (top and left) using `on-primary-container` at 10% opacity on glass elements to simulate the edge of a glass pane.
 
---
 
## 5. Components
 
### Buttons
*   **Primary:** Gradient of `primary` to `primary-container`. `full` roundedness (pill shape). No border. White text.
*   **Secondary (Glass):** Semi-transparent `surface-container-lowest` (80% opacity) with backdrop blur. `md` roundedness. 
*   **States:** On hover, the primary button should "glow"—increase the shadow spread and slightly brighten the gradient.
 
### Input Fields
*   **Style:** No bottom line or full box. Use a subtle fill of `surface-container-high` with `md` (0.75rem) corner radius.
*   **Active State:** Transition the background to `surface-container-lowest` and add a "Ghost Border" of `primary` at 20% opacity.
 
### Cards & Lists
*   **Forbidden:** 1px divider lines between list items.
*   **Separation:** Use 16px–24px of vertical white space or alternating tonal shifts (e.g., every second list item uses `surface-container-low`).
*   **Athletic Cards:** Cards should use `xl` (1.5rem) roundedness to feel friendly yet modern.
 
### High-Performance Components
*   **The "Scrub Bar":** For video coaching, use a `primary` track with a `surface-container-highest` background. The handle should be a "Liquid Glass" circle with a heavy backdrop blur.
*   **Metric Tiles:** Large `display-sm` numbers for stats (e.g., "92% Serve Accuracy") paired with a `label-sm` description. Use a `surface-container-lowest` background with a subtle `primary` tint (2% opacity).
 
---
 
## 6. Do's and Don'ts
 
### Do:
*   **Do** embrace negative space. If a screen feels "empty," it’s likely working.
*   **Do** use `primary` (#0058bc) sparingly as a "laser pointer" to guide the user's eye to the most important action.
*   **Do** use `full` roundedness for action-oriented items (buttons, chips) and `lg/xl` for structural items (cards, modals).
 
### Don't:
*   **Don't** use black text (#000000). Always use `on-surface` (#191c1d) for a softer, more premium contrast.
*   **Don't** stack more than three layers of surfaces. It will muddy the "Kinetic Clarity" of the design.
*   **Don't** use standard "Material" shadows. If the shadow looks like a shadow, it’s too dark. It should look like a soft glow of depth.
