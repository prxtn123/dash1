# 🎨 UI/UX Guide - node Safety Dashboard

Complete visual design specifications and component guidelines.

---

## 🎯 Design Philosophy

**Principle:** Simplicity meets premium design  
**Aesthetic:** Modern, sleek, professional  
**Theme:** Dark mode with blue accents  
**Target Users:** Warehouse managers viewing from distance  

---

## 🌈 Color Palette

### Primary Colors
```
Dark Background:   #0f172a (RGB: 15, 23, 42)
Medium Background: #1e293b (RGB: 30, 41, 59)
Primary Accent:    #3b82f6 (RGB: 59, 130, 246) [Blue]
```

### Incident Type Colors
```
MHE Close:         #ef4444 (RGB: 239, 68, 68) [Red]
No High-Vis:       #f97316 (RGB: 249, 115, 22) [Orange]
Walkway Zone:      #eab308 (RGB: 234, 179, 8) [Yellow]
Success:           #10b981 (RGB: 16, 185, 129) [Green]
```

### Text Colors
```
Primary Text:      #f1f5f9 (RGB: 241, 245, 249) [Light]
Secondary Text:    #cbd5e1 (RGB: 203, 213, 225) [Medium]
Tertiary Text:     #94a3b8 (RGB: 148, 163, 184) [Gray]
```

### Borders & Dividers
```
Light Border:      rgba(148, 163, 184, 0.2)
Medium Border:     rgba(148, 163, 184, 0.4)
Strong Border:     rgba(148, 163, 184, 0.6)
```

---

## 📐 Typography

### Font Family
**Primary:** Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'  
**Fallback:** System fonts

### Font Sizes

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Page Title | 32-48px | 700 | Main dashboard heading |
| Section Heading | 20-24px | 600 | Category headers |
| Card Title | 16-18px | 600 | Component titles |
| Body Text | 14px | 400 | Main content |
| Small Text | 12-13px | 400 | Labels, helper text |
| Tiny Text | 11-12px | 500 | Timestamps, tags |

### Font Weights
- **700** - Bold (headings, badges)
- **600** - Semi-bold (subheadings, labels)
- **500** - Medium (important text)
- **400** - Regular (body text)

---

## 🎭 Component Specifications

### IncidentCard

**Dimensions:**
- Min Width: 280px
- Max Width: None (CSS Grid handles)
- Aspect Ratio: 4:3 (video)
- Border Radius: 12px

**Structure:**
```
┌─────────────────────────┐
│  [Video Preview] [Badge]│
├─────────────────────────┤
│ Date      Time Duration │
│ 📍 Location             │
│ Description text...     │
└─────────────────────────┘
```

**States:**
- **Default:** Normal appearance
- **Hover:** Lift up (-8px), shadow increases
- **Playing:** Video takes over preview

**Badge Styling:**
- Padding: 6px 12px
- Border Radius: 20px
- Font Size: 12px
- Font Weight: 600
- Text Transform: Uppercase
- Letter Spacing: 0.5px
- Box Shadow: 0 4px 12px rgba(0,0,0,0.3)

---

### Dashboard Header

**Structure:**
```
┌────────────────────────────────────┐
│ Safety Incident Monitor            │ ⭐ LIVE
│ Real-time warehouse monitoring     │
└────────────────────────────────────┘
```

**Title Styling:**
- Font Size: clamp(28px, 5vw, 48px) [responsive]
- Font Weight: 700
- Gradient: Light → Medium gradient
- Letter Spacing: -0.5px

**Live Status Badge:**
- Background: rgba(16, 185, 129, 0.1)
- Border: 1px solid rgba(16, 185, 129, 0.3)
- Padding: 12px 16px
- Border Radius: 8px
- Pulsing animation on dot

---

### Statistics Grid

**Layout:**
- Responsive columns (auto-fit)
- Min Width: 140px per card
- Gap: 16px
- 4 cards on desktop, 2 on tablet, 1 on mobile

**Card Contents:**
```
┌──────────────────┐
│ Label            │
│                  │
│ 42               │ (stat number)
└──────────────────┘
```

**Stat Card:**
- Padding: 20px
- Border: 1px solid rgba(148, 163, 184, 0.2)
- Border Radius: 12px
- Hover: Transform up 4px, lighter border
- Active: Highlighted state with box shadow

---

### Filter Tabs

**Layout:**
- Horizontal scrollable
- Scroll Behavior: Smooth
- Padding Bottom: 8px

**Tab Styling:**
- Padding: 10px 20px
- Border: None
- Border Bottom: 2px solid transparent
- Color: #94a3b8 (default)
- Active Color: #f1f5f9
- Transition: 0.3s ease

---

### Incident Grid

**Responsive Breakpoints:**

| Device | Columns | Gap |
|--------|---------|-----|
| Desktop | Auto-fill, 320px | 24px |
| Tablet (768px) | 2 | 16px |
| Mobile (480px) | 1 | 12px |

---

## ✨ Animations

### Hover Effects
**Incident Card:**
- Transform: translateY(-8px)
- Shadow: Increases from 0 10px 30px to 0 20px 40px
- Duration: 0.3s ease

**Play Button:**
- Scale: 1 → 1.15
- Background: 95% opacity → 100% opacity
- Duration: 0.3s ease

**Buttons:**
- All buttons: Scale 1.05 on hover
- Transition: 0.2-0.3s ease

### Loading Animation
**Spinner:**
- Width: 48px
- Border: 3px
- Top Border Color: #60a5fa
- Animation: Spin 0.8s linear infinite

**Pulse Animation (Live Status):**
```css
@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  50% { 
    opacity: 0.7;
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
}
```

### Transitions
- Smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Quick: 0.2s linear (buttons)
- Slow: 0.5s ease-in-out (modals)

---

## 📱 Responsive Design

### Breakpoints

```css
/* Extra Large (Desktop) */
@media (min-width: 1920px) {
  /* 1-2 row layout, full features */
}

/* Large (Desktop) */
@media (max-width: 1920px) {
  /* Default layout, 4-column grid */
}

/* Medium (Tablet) */
@media (max-width: 768px) {
  /* 2-column grid */
  /* Adjusted padding/gaps */
  /* Simplified navigation */
}

/* Small (Mobile) */
@media (max-width: 480px) {
  /* Single column */
  /* Compact spacing */
  /* Bottom action buttons */
}
```

### Responsive Text Sizing
```css
h1 {
  font-size: clamp(28px, 5vw, 48px);
  /* Scales between 28px min and 48px max */
}
```

---

## 🎬 Video Player Specifications

### Preview Thumbnail
- Aspect Ratio: 4:3 (640x480)
- Object Fit: Cover (crops to fill)
- Border: None
- Radius: 8px top

### Play Button Overlay
```
┌─────────────────┐
│       ⏯️         │  (center)
│                 │
└─────────────────┘
```

**Button:**
- Size: 60px diameter
- Background: rgba(255, 255, 255, 0.95)
- Border Radius: 50%
- Icon: 28px white play triangle
- Hover: Scale 1.15, full white

**Overlay Background:**
- Color: rgba(0, 0, 0, 0.4) default
- Hover: rgba(0, 0, 0, 0.6)
- Transition: 0.3s ease

### Full-Screen Modal
- Overlay: rgba(0, 0, 0, 0.95)
- Max Width: 900px
- Max Height: 600px
- Close Button: Top right (-40px offset)

---

## ♿ Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals
- Arrow keys for scrolling

### Color Contrast
- Text on background: 7:1 ratio (WCAG AAA)
- Badge on color: 4.5:1 ratio minimum
- All text readable without color alone

### ARIA Labels
```jsx
<button aria-label="Refresh incidents">
  🔄
</button>
```

### Semantic HTML
- Use `<button>` for buttons
- Use `<nav>` for navigation
- Use `<main>` for main content
- Use `<section>` for sections

---

## 🎯 Layout Spacing

### Standardized Spacing Scale
```
2px   - Minimal gaps
4px   - Compact spacing
8px   - Small spacing
12px  - Normal spacing
16px  - Medium spacing
20px  - Card padding
24px  - Section spacing
32px  - Major spacing
40px+ - Page margins
```

### Apply Consistently
- Card padding: 16-20px
- Grid gaps: 16-24px
- Section margins: 32-40px
- Component padding: 8-12px

---

## 🌙 Dark Mode Implementation

### Current Theme
- **Primary Mode:** Dark (always on)
- **Background Gradient:** Linear 135deg, #0f172a → #1e293b
- **Card Background:** rgba(30, 41, 59, 0.8)
- **Border Style:** Transparent white borders

### CSS Approach
```css
.incident-dashboard {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
}
```

---

## 📊 Data Visualization

### Stat Numbers
- Font Size: 32px
- Font Weight: 700
- Color: Varies by type (red, orange, yellow, gray)
- Line Height: 1 (no extra space)

### Badge Icons
- Size: 18x18px
- Color: Matching type color
- Style: Filled/solid
- Padding: 8px spacing from text

---

## 🎮 Interactive Elements

### Buttons
**Primary Button:**
- Background: Linear gradient (blue)
- Color: White
- Padding: 10-12px 20-24px
- Border Radius: 6-8px
- Hover: translateY(-2px), shadow increase

**Secondary Button:**
- Background: Transparent
- Border: 1px solid rgba(148, 163, 184, 0.4)
- Color: #cbd5e1
- Hover: Border lighter, color lighter

---

## 🎨 CSS Organization

### Naming Convention
```css
/* Block__Element--Modifier (BEM) */
.incident-card { }
.incident-card__header { }
.incident-card--active { }

/* Alternatively: Descriptive names */
.incident-video-container { }
.incident-play-button { }
.incident-badge { }
```

### File Organization
```
components/
├── IncidentCard.jsx
└── IncidentCard.css   /* Component-specific styles */

scenes/incident-dashboard/
├── IncidentDashboard.jsx
└── IncidentDashboard.css

App.css                /* Global app styles */
index.css              /* Global element styles */
```

---

## 🖼️ Visual Hierarchy

**1. Most Important:** Page Title, Main CTA
- Largest font, brightest color, top position

**2. Important:** Incident Cards, Statistics
- Clear structure, good contrast, easily scannable

**3. Secondary:** Labels, Descriptions
- Smaller font, muted colors, supporting info

**4. Least Important:** Borders, Dividers
- Subtle, low opacity, mostly visual guidance

---

## 🎬 Empty States

**Empty State:**
```
    📭
  No Incidents
  
Great! Your warehouse is operating safely
(if all filtered out)

Try selecting a different incident type
```

**Loading State:**
```
  ⟳ (spinning)
  Loading incidents...
```

**Error State:**
```
  ⚠️
  Failed to load incidents
  [Retry Button]
```

---

## 📏 Component Dimensions

| Component | Width | Height | Notes |
|-----------|-------|--------|-------|
| Stat Card | 140-1fr | Auto | Flexible grid |
| Incident Card | 320px | Auto | Aspect ratio 4:3 + content |
| Badge | Auto | 28px | Inline sizing |
| Play Button | 60px | 60px | Circle |
| Modal | 900px max | 600px max | Centered |
| Video | 100% | 100% | Container fill |

---

## ✅ Design System Checklist

- [ ] All colors from palette used consistently
- [ ] Font sizes follow scale
- [ ] Spacing follows grid (8px or 4px base)
- [ ] Hover states implemented on all interactive elements
- [ ] Loading states visible and clear
- [ ] Error states show helpful messages
- [ ] Mobile responsive on all breakpoints
- [ ] Accessibility standards met (WCAG 2.1 AA+)
- [ ] Animation timing consistent
- [ ] Contrast ratios pass WCAG standards

---

## 🎉 Design Complete!

Your node Safety Dashboard is designed with:
- ✅ Professional aesthetic
- ✅ Optimal usability
- ✅ Modern interactions
- ✅ Full responsiveness
- ✅ Accessibility in mind

**The design is production-ready! 🚀**
