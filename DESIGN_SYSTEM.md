# Design System - Interview AI Platform

## Visual Identity

### Color Palette

#### Primary Colors
```
Primary Blue:      #0A66C2  (Professional, LinkedIn-inspired)
Secondary Blue:    #00A1DE  (Sky, Friendly)
Accent Green:      #08620B  (Success, Positive)
```

#### Semantic Colors
```
Success:    #22C55E  (Green)     - Correct answers, success states
Error:      #EF4444  (Red)       - Wrong answers, errors
Warning:    #F59E0B  (Amber)     - Alerts, cautions
Info:       #0EA5E9  (Cyan)      - Information, hints
Neutral:    #6B7280  (Gray)      - Disabled, secondary text
```

#### Background Colors
```
Light BG:      #F9FAFB    - Main background
Card BG:       #FFFFFF    - Card backgrounds
Hover BG:      #F3F4F6    - Hover state
Dark BG:       #1F2937    - Dark mode background
Overlay:       rgba(0,0,0,0.5) - Modals
```

#### Text Colors
```
Primary Text:    #111827    - Main text (almost black)
Secondary Text:  #6B7280    - Supporting text
Muted Text:      #9CA3AF    - Disabled, tertiary
Light Text:      #FFFFFF    - On dark backgrounds
```

### Typography

#### Font Family
```css
font-family: 'Inter', 'Segoe UI', 'Poppins', sans-serif;
```

#### Font Sizes & Weights
```
Display:    3rem    (3.5rem on desktop)  - 700 bold
H1:         2.5rem                       - 700 bold
H2:         2rem                         - 700 bold
H3:         1.5rem                       - 600 semi-bold
H4:         1.25rem                      - 600 semi-bold
Body Large: 1.125rem                     - 500 medium
Body:       1rem                         - 400 normal
Small:      0.875rem                     - 400 normal
Tiny:       0.75rem                      - 400 normal
Caption:    0.625rem                     - 400 normal
```

#### Letter Spacing
```
Tight:      -0.02em   - Display text
Normal:      0em       - Most text
Wide:        0.02em    - Caps/emphasis
```

#### Line Height
```
Tight:      1.2    - Headlines
Normal:     1.5    - Body text
Relaxed:    1.75   - Large blocks
```

### Spacing System (8px Grid)

```
xs:     4px    (0.25rem)
sm:     8px    (0.5rem)
md:     16px   (1rem)
lg:     24px   (1.5rem)
xl:     32px   (2rem)
2xl:    48px   (3rem)
3xl:    64px   (4rem)
4xl:    96px   (6rem)
5xl:    128px  (8rem)
```

#### Padding Guidelines
```
Button:         md (16px)
Card:           lg (24px)
Input Field:    md (16px)
Page Section:   xl (32px)
Page Padding:   lg to xl
```

### Border Radius

```
None:       0px
Sm:         4px    - Input fields, small elements
Md:         8px    - Cards, buttons
Lg:         12px   - Large cards, panels
Xl:         16px   - Modal windows
Full:       9999px - Fully rounded (circles, pills)
```

### Shadows

#### Elevation System
```
none:       box-shadow: none

sm:         box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

md:         box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                        0 2px 4px -1px rgba(0, 0, 0, 0.06)

lg:         box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                        0 4px 6px -2px rgba(0, 0, 0, 0.05)

xl:         box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                        0 10px 10px -5px rgba(0, 0, 0, 0.04)

2xl:        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

#### Usage
```
Cards:           md shadow
Buttons (hover): md shadow
Modals:          lg shadow
Dropdowns:       md shadow
Floating items:  lg shadow
```

---

## Component Design Specifications

### Button Component

#### States
```
Primary Button (Blue):
- Default:  bg-#0A66C2, text-white, shadow-md
- Hover:    bg-#0956A8 (darker), shadow-lg
- Active:   bg-#084598 (darkest), shadow-md
- Disabled: bg-#E5E7EB, text-#9CA3AF, no shadow

Secondary Button (Ghost):
- Default:  border-2 border-#0A66C2, text-#0A66C2, no bg
- Hover:    bg-#F3F4F6
- Active:   bg-#E5E7EB
- Disabled: border-#E5E7EB, text-#9CA3AF

Gradient Button:
- bg: linear-gradient(135deg, #0A66C2 0%, #00A1DE 100%)
- Hover: saturate(1.2)
- Active: saturate(0.9)

Danger Button:
- Default:  bg-#EF4444, text-white
- Hover:    bg-#DC2626
- Active:   bg-#B91C1C
```

#### Sizes
```
Sm:   px-3 py-2    text-sm    (small buttons)
Md:   px-4 py-2.5  text-base  (standard)
Lg:   px-6 py-3    text-lg    (prominent actions)
```

#### Loading State
```
- Show spinner inside button
- Disable click
- Text becomes hidden/semi-transparent
- Width remains constant
```

#### Variants CSS
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
  border: none;
  gap: 8px;
}

.btn:focus {
  outline: 2px solid #0A66C2;
  outline-offset: 2px;
}

.btn-primary {
  background-color: #0A66C2;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: #0956A8;
  box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
}

.btn-loading {
  opacity: 0.8;
  pointer-events: none;
}
```

### Form Input Component

#### Design
```
- Border: 1px solid #E5E7EB
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 1rem
- Line Height: 1.5
- Width: 100% (full container)
- Max Width: 100%

Focus State:
- Border Color: #0A66C2
- Box Shadow: 0 0 0 3px rgba(10, 102, 194, 0.1)
- Outline: none

Error State:
- Border Color: #EF4444
- Error Message: text-#EF4444, font-size: 0.875rem, margin-top: 4px

Disabled State:
- Background: #F3F4F6
- Cursor: not-allowed
- Opacity: 0.6
```

#### With Icon
```
- Icon position: Left side, 16px padding
- Icon size: 20px x 20px
- Icon color: #6B7280
- Input padding-left: 44px (icon + space)
```

#### Label
```
- Font: 600 weight, 0.875rem size
- Color: #111827
- Margin bottom: 8px
- Display: block
```

#### Error Message
```
- Font: 0.875rem, normal weight
- Color: #EF4444
- Margin top: 4px
- Icon: ❌ or ⚠️
```

### Alert Component

#### Styles
```
Success (Green):
- Background: #D1FAE5 or #ECFDF5
- Border: 1px solid #6EE7B7
- Text: #065F46
- Icon: ✅

Error (Red):
- Background: #FEE2E2 or #FEF2F2
- Border: 1px solid #FECACA
- Text: #7F1D1D
- Icon: ❌

Warning (Amber):
- Background: #FEF3C7 or #FFFBEB
- Border: 1px solid #FCD34D
- Text: #92400E
- Icon: ⚠️

Info (Blue):
- Background: #DBEAFE or #EFF6FF
- Border: 1px solid #93C5FD
- Text: #1E40AF
- Icon: ℹ️
```

#### Layout
```
[Icon] [Title] [Message]
       [Action Button] [Close]

- Padding: 16px
- Border Radius: 8px
- Icon Size: 20px
- Font: 1rem, 0.875rem for message
```

### Card Component

#### Design
```
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border Radius: 12px
- Padding: 24px
- Shadow: md (subtle)

Hover State (Interactive):
- Box Shadow: lg
- Border Color: #D1D5DB
- Cursor: pointer
```

#### Variants
```
Default:    Border + Shadow
Elevated:   More shadow, no border
Outlined:   Border only, no shadow
Ghost:      No border/shadow, hover effect
```

### Modal Component

#### Design
```
- Background: White
- Border Radius: 16px
- Padding: 24px
- Shadow: xl (prominent)
- Max Width: 500px (sm), 800px (md), 1200px (lg)
- Max Height: 90vh

Overlay:
- Background: rgba(0, 0, 0, 0.5)
- Transition: 200ms
- Position: Fixed, full screen

Header:
- Border Bottom: 1px #E5E7EB
- Padding Bottom: 16px
- Display: flex, space-between (title + close button)

Footer:
- Border Top: 1px #E5E7EB
- Padding Top: 16px
- Display: flex, gap, justify-end
```

### Table Component

#### Styling
```
Header:
- Background: #F9FAFB
- Font Weight: 600
- Font Size: 0.875rem
- Padding: 12px 16px
- Border Bottom: 2px solid #E5E7EB

Rows:
- Border Bottom: 1px solid #E5E7EB
- Padding: 12px 16px
- Font Size: 1rem

Hover Row:
- Background: #F9FAFB

Striped (alternating):
- Even rows: #FFFFFF
- Odd rows:  #F9FAFB
```

---

## Animations & Transitions

### Timing Functions
```
ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1)  - Default
ease-in:        cubic-bezier(0.4, 0, 1, 1)    - Entering
ease-out:       cubic-bezier(0, 0, 0.2, 1)    - Leaving
linear:         0, 0, 1, 1                    - Consistent
```

### Durations
```
Ultra-fast:     100ms   - Microinteractions
Fast:           200ms   - Button hover, dismissal
Normal:         300ms   - Page transitions
Slow:           500ms   - Complex animations
Very Slow:      1000ms  - Long sequences
```

### Common Animations

#### Fade In/Out
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

animation: fadeIn 300ms ease-out;
```

#### Slide Up/Down
```css
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(20px); opacity: 0; }
}

animation: slideUp 300ms ease-out;
```

#### Pulse (Loading)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

#### Scale (Zoom)
```css
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

animation: scaleIn 200ms ease-out;
```

### Page Transitions
- Fade in: 300ms, ease-out
- Fade out: 200ms, ease-in
- Slide in (modal): 300ms, ease-out
- Slide out (modal): 200ms, ease-in

---

## Responsive Design

### Breakpoints
```
Mobile:       0px - 640px
Tablet:       641px - 1024px
Desktop:      1025px+

Media Queries:
@media (max-width: 640px) { /* Mobile */ }
@media (min-width: 641px) and (max-width: 1024px) { /* Tablet */ }
@media (min-width: 1025px) { /* Desktop */ }
```

### Layout Changes

#### Interview Practice Page
```
Mobile (<640px):
- Single column
- Full-width question card
- Stack buttons vertically
- Smaller fonts

Tablet (641-1024px):
- Single column with padding
- Wider cards
- Better spacing
- Medium fonts

Desktop (1025px+):
- Question card: 70% width
- Sidebar (optional): 30% width
- Horizontal button layout
- Full font sizes
```

#### Dashboard
```
Mobile:
- Cards stacked vertically
- Charts: single column
- List view for history

Tablet:
- 2-column grid for cards
- Charts side by side
- Table with scroll

Desktop:
- 3-4 column grid
- Full charts
- Full-featured table
```

### Touch Friendly
```
- Minimum button size: 44px x 44px
- Minimum touch target: 48px x 48px
- Spacing between interactive elements: 8px
- Font minimum: 16px (avoid zoom on iOS)
```

---

## Dark Mode (Optional)

### Dark Colors
```
Background:     #0F172A
Card:           #1E293B
Border:         #334155
Text Primary:   #F1F5F9
Text Secondary: #CBD5E1
```

### Dark Transitions
```
Add: prefers-color-scheme: dark
Or: data-theme="dark" attribute

Smooth transition: 200ms all ease
```

---

## Accessibility Guidelines

### WCAG AA Compliance

#### Color Contrast
```
Body text:      4.5:1 ratio minimum
Large text:     3:1 ratio minimum
Button text:    4.5:1 ratio minimum

Examples:
✅ #111827 on #FFFFFF → 19:1
✅ #0A66C2 on #FFFFFF → 4.5:1
❌ #6B7280 on #FFFFFF → 4.5:1 (barely passes)
```

#### Focus States
```
- Visible focus indicator (2px outline)
- Outline color: #0A66C2
- Outline offset: 2px
- Never remove focus outline
```

#### Text Alternatives
```
- All icons have labels or aria-labels
- Images have alt text
- Buttons have descriptive text
```

#### Keyboard Navigation
```
- Tab through all interactive elements
- Enter to activate buttons
- Space to activate buttons/checkboxes
- Escape to close modals
- Arrow keys in dropdowns
```

---

## Performance Considerations

### Image Optimization
```
- Use WebP format with fallbacks
- Lazy load off-screen images
- Responsive images (srcset)
- SVG for icons (smaller, scalable)
```

### CSS
```
- Use CSS variables for colors/spacing
- Minimize media queries (mobile-first)
- Avoid deep nesting
- Use transitions, not animations where possible
```

### Fonts
```
- Use system fonts or web fonts (max 2)
- Font-display: swap (show text immediately)
- Limit font weights (2-3 max)
```

---

## Code Examples

### CSS Variables
```css
:root {
  --color-primary: #0A66C2;
  --color-secondary: #00A1DE;
  --color-success: #22C55E;
  --color-error: #EF4444;
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  --transition-fast: 200ms ease-out;
  --transition-normal: 300ms ease-out;
}

/* Usage */
button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
}
```

### Utility Classes
```css
/* Spacing */
.p-md { padding: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.gap-md { gap: var(--spacing-md); }

/* Colors */
.text-primary { color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.border-error { border-color: var(--color-error); }

/* Layout */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }

/* Shadows */
.shadow-md { box-shadow: var(--shadow-md); }

/* Animations */
.animate-fade-in { animation: fadeIn var(--transition-normal); }
```

---

## Design Checklist

Before implementing any component:

- [ ] Color contrast 4.5:1 minimum
- [ ] Touch targets 44x44px minimum
- [ ] Focus states visible
- [ ] Responsive at all breakpoints
- [ ] Animations smooth (60fps)
- [ ] Loading states shown
- [ ] Error states clear
- [ ] Empty states designed
- [ ] Hover states defined
- [ ] Disabled states clear
- [ ] Accessibility labels present
- [ ] Performance optimized
- [ ] Consistent spacing
- [ ] Brand colors used correctly

---

## File Organization

```
frontend/
├── src/
│   ├── styles/
│   │   ├── variables.css      # CSS variables
│   │   ├── globals.css        # Global styles
│   │   ├── animations.css     # Keyframes
│   │   ├── components.css     # Component styles
│   │   └── responsive.css     # Media queries
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── Input.jsx
│   │   ├── Input.css
│   │   └── ...
│   └── ...
```

---

## Summary

This design system ensures:
- ✅ Consistent visual identity
- ✅ Professional appearance
- ✅ Accessibility compliance
- ✅ Responsive experience
- ✅ Performance optimization
- ✅ Developer efficiency

Use this as reference during implementation! 🎨
