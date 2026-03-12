---
title: Theme Preview
description: Preview all gradient themes in light and dark mode
---

# Theme Preview Guide

This page demonstrates how all four gradient themes work in both light and dark modes.

## 🎨 Available Themes

### 1. Purple-Pink (Default)
A vibrant combination of purple and pink, perfect for modern, creative interfaces.

**Light Mode Colors:**
- Start: `#8b5cf6` (Violet)
- End: `#ec4899` (Pink)

**Dark Mode Colors:**
- Start: `#a78bfa` (Light Violet)
- End: `#f472b6` (Light Pink)

### 2. Blue-Green
A cool, professional theme combining blue and green tones.

**Light Mode Colors:**
- Start: `#3b82f6` (Blue)
- End: `#10b981` (Green)

**Dark Mode Colors:**
- Start: `#60a5fa` (Light Blue)
- End: `#34d399` (Light Green)

### 3. Orange-Red
A warm, energetic theme with orange and red hues.

**Light Mode Colors:**
- Start: `#f97316` (Orange)
- End: `#ef4444` (Red)

**Dark Mode Colors:**
- Start: `#fb923c` (Light Orange)
- End: `#f87171` (Light Red)

### 4. Aurora
A multi-color gradient inspired by the Northern Lights.

**Light Mode Colors:**
- Start: `#8b5cf6` (Violet)
- Mid: `#06b6d4` (Cyan)
- End: `#10b981` (Green)

**Dark Mode Colors:**
- Start: `#a78bfa` (Light Violet)
- Mid: `#22d3ee` (Light Cyan)
- End: `#34d399` (Light Green)

## 🌓 Dark Mode Adaptation

Each theme has been carefully optimized for dark mode:

1. **Lighter Colors**: Dark mode uses lighter shades for better visibility
2. **Enhanced Glow**: Glow effects are more prominent in dark mode
3. **Stronger Radial Gradients**: Background gradients have higher opacity
4. **Better Contrast**: Ensures readability across all themes

## 🧪 Testing Instructions

To test all theme combinations:

1. **Switch Themes**: Click the color swatch icon (🎨) in the header
2. **Toggle Dark Mode**: Click the sun/moon icon to switch between light and dark
3. **Observe Changes**:
   - Button colors update instantly
   - Background gradients transition smoothly
   - Code blocks adapt to the theme
   - Links and accents reflect the theme colors

## 💡 Code Example

Here's how the theme system works:

\`\`\`css
/* Purple-Pink Light Mode */
[data-theme="purple-pink"] {
  --accent-start: #8b5cf6;
  --accent-end: #ec4899;
}

/* Purple-Pink Dark Mode */
[data-theme="purple-pink"][data-theme-mode="dark"] {
  --accent-start: #a78bfa;
  --accent-end: #f472b6;
}
\`\`\`

\`\`\`javascript
// Theme switching logic
const handleThemeChange = (themeId) => {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('docs-theme', themeId);
};
\`\`\`

## 📊 Theme Comparison

| Theme | Light Start | Light End | Dark Start | Dark End |
|-------|------------|-----------|------------|----------|
| Purple-Pink | #8b5cf6 | #ec4899 | #a78bfa | #f472b6 |
| Blue-Green | #3b82f6 | #10b981 | #60a5fa | #34d399 |
| Orange-Red | #f97316 | #ef4444 | #fb923c | #f87171 |
| Aurora | #8b5cf6 → #06b6d4 | #10b981 | #a78bfa → #22d3ee | #34d399 |

## ✨ Best Practices

### Choosing a Theme

- **Purple-Pink**: Best for creative, modern projects
- **Blue-Green**: Professional, tech-focused content
- **Orange-Red**: Energetic, attention-grabbing designs
- **Aurora**: Unique, multi-dimensional interfaces

### Dark Mode Considerations

> **Tip**: Dark mode themes use lighter shades to maintain contrast against dark backgrounds. This ensures text and UI elements remain clearly visible.

### Accessibility

All themes maintain WCAG AA contrast ratios in both light and dark modes:

- Text contrast: ≥ 4.5:1
- Interactive elements: ≥ 3:1
- Focus indicators: Clear and visible

## 🔧 Customization

Want to create your own theme? Here's the template:

\`\`\`css
[data-theme="custom-theme"] {
  --accent-start: #yourcolor;
  --accent-end: #yourcolor;
  --accent-gradient: linear-gradient(135deg, var(--accent-start) 0%, var(--accent-end) 100%);
  --glow-color: rgba(r, g, b, 0.5);
  --particle-color: #yourcolor;
  --bg-radial-1: rgba(r, g, b, 0.15);
  --bg-radial-2: rgba(r, g, b, 0.12);
  --bg-radial-3: rgba(r, g, b, 0.1);
}

[data-theme="custom-theme"][data-theme-mode="dark"] {
  --accent-start: #lightercolor;
  --accent-end: #lightercolor;
  /* Increase radial gradient opacity for dark mode */
  --bg-radial-1: rgba(r, g, b, 0.25);
  --bg-radial-2: rgba(r, g, b, 0.2);
  --bg-radial-3: rgba(r, g, b, 0.15);
}
\`\`\`

## 🎯 Interactive Demo

Try switching themes and toggling dark mode to see the smooth transitions in action!

### Features to Notice:

1. **Smooth Transitions**: All color changes animate smoothly
2. **Consistent Styling**: All UI elements adapt to the theme
3. **Live Updates**: Changes apply instantly without page reload
4. **Persistent Choice**: Your selection is saved to localStorage

---

**Enjoy exploring the themes!** 🎨✨
