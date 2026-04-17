# Color — Apple Developer Documentation

**Last updated:** December 16, 2025  

---

## 🎨 Overview

The system defines colors that automatically adapt to:

- Light / Dark mode  
- Accessibility settings  
- Vibrancy and translucency  

Using **system colors** ensures your app feels native across Apple platforms.

You can also use **custom colors**, but they must follow accessibility and adaptability guidelines.

---

## ✅ Core Principles

### Consistency
- Use colors consistently across your UI  
- Don’t assign multiple meanings to the same color  

---

### Adaptability
Ensure colors work across:
- Light mode  
- Dark mode  
- Increased contrast settings  

👉 Provide variants for:
- Default (light)  
- Default (dark)  
- High contrast (light)  
- High contrast (dark)  

---

### Accessibility
- Maintain sufficient contrast  
- Never rely on color alone to convey meaning  
- Provide alternatives (icons, labels, shapes)  

---

## 🌍 Environmental Considerations

### Lighting Conditions
- Bright environments → colors appear muted  
- Dark environments → colors appear more saturated  

---

### Devices & Displays
- Test on multiple devices  
- True Tone adjusts white balance dynamically  
- TVs and monitors vary significantly  

---

### Translucency Effects
- Colors change when placed behind blur or glass  
- Background content influences perception  

---

## 🎯 Best Practices

### ✅ Do
- Use system color APIs (e.g., `Color`, `UIColor`)  
- Test across environments and devices  
- Use color to reinforce hierarchy and meaning  

---

### ❌ Avoid
- Hardcoding color values  
- Using low-contrast combinations  
- Relying only on color for communication  

---

## 🌐 Cultural Considerations

Colors have different meanings globally:

- Red → danger (some regions) / positive (others)  
- Example: stock market colors differ between cultures  

👉 Always validate color meaning in context.

---

## 🧠 System Colors

### Dynamic Colors
Defined by **purpose**, not appearance:

- Background colors  
- Label colors  
- Separators  
- Links  

They automatically adapt to:
- Light/dark mode  
- Accessibility settings  

---

### Background Hierarchy (iOS)

| Level | Usage |
|------|------|
| Primary | Main view background |
| Secondary | Grouped content |
| Tertiary | Nested grouping |

Examples:
- `systemBackground`  
- `secondarySystemBackground`  
- `tertiarySystemBackground`  

---

### Foreground Colors (iOS)

- `label` → primary text  
- `secondaryLabel` → secondary text  
- `tertiaryLabel` → less important text  
- `quaternaryLabel` → minimal emphasis  
- `link` → interactive text  
- `separator` → dividers  

---

## 💻 macOS System Colors

Examples:

- `controlAccentColor` → user-selected accent  
- `labelColor` → primary text  
- `textColor` → document text  
- `separatorColor` → content separation  
- `windowBackgroundColor` → window background  

👉 Use system-defined roles instead of redefining meaning.

---

## 🍏 Liquid Glass Color Behavior

### Default Behavior
- No inherent color  
- Adapts to background content  

---

### When to Apply Color
- Primary actions (e.g., buttons)  
- Status indicators  
- Selected states  

---

### Best Practices

#### ✅ Do
- Use color sparingly  
- Apply color to backgrounds for emphasis  
- Keep toolbars mostly monochrome  

#### ❌ Don’t
- Overuse color on glass  
- Use multiple colored controls  
- Reduce readability with busy backgrounds  

---

## 🧪 Testing Guidelines

Test your app:

- In different lighting conditions  
- On multiple devices  
- With accessibility settings enabled  
- With various wallpapers/backgrounds  

---

## 🎥 Color & Content Interaction

- Avoid overlapping similar colors  
- Ensure readability at rest state  
- Consider scroll interactions with dynamic backgrounds  

---

## 🖼️ Color Management

### Color Spaces
- **sRGB** → standard  
- **Display P3** → wider, more vibrant  

---

### Best Practices
- Use color profiles in images  
- Prefer sRGB for compatibility  
- Use P3 for richer visuals when supported  

---

### Multi-Display Strategy
- Provide variations for different color spaces  
- Avoid gradients that break on sRGB  

---

## 🧩 Platform-Specific Notes

### macOS
- Supports user-defined accent colors  
- System may override app colors  

---

### visionOS
- Glass material interacts with real-world light  
- Avoid excessive brightness contrast  

---

### watchOS
- Supports tinted mode (single-color UI)  

---

### tvOS
- Requires testing across multiple TVs  

---

## 🎨 System Color Palette (SwiftUI)

- Red  
- Orange  
- Yellow  
- Green  
- Mint  
- Teal  
- Cyan  
- Blue  
- Indigo  
- Purple  
- Pink  
- Brown  

---

## ⚪ System Gray Colors (iOS)

- `systemGray`  
- `systemGray2`  
- `systemGray3`  
- `systemGray4`  
- `systemGray5`  
- `systemGray6`  

---

## 💡 Key Takeaways

- Use **system colors first**  
- Design for **all environments and users**  
- Treat color as **communication, not decoration**  
- Prioritize **contrast, clarity, and consistency**  

---

## 🔗 Resources

- Dark Mode  
- Accessibility  
- Materials  
- SwiftUI Color  
- UIColor (UIKit)  
- AppKit Color  

---

## 📝 Change Log

- **Dec 16, 2025** — Updated for Liquid Glass  
- **Jun 9, 2025** — Added Liquid Glass guidance  
- **Feb 2, 2024** — VisionOS updates  
- **2023–2022** — Incremental improvements  

---

*Apple Human Interface Guidelines — Color*
