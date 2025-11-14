# Icon Components

This directory contains React icon components converted from SVG files. These components make it easy to size and color icons throughout the application.

## Usage

### Basic Usage

```tsx
import { Check, Alert, Camera } from '@/components/icons';

// Default size (24px) and currentColor
<Check />

// Custom size
<Check size={32} />

// Custom color
<Check color="#137e96" />

// Using Salt theme colors
<Check color="var(--salt-content-primary-foreground)" />

// Custom size and color
<Alert size={18} color="var(--salt-status-warning-foreground)" />
```

### With CSS Classes

Icons inherit the `color` CSS property, so you can style them with classes:

```tsx
<Camera className="text-teal-primary" />
<Check className="salt-home-inline-icon" />
```

Then in your CSS:
```css
.salt-home-inline-icon {
  width: 18px;
  height: 18px;
  color: var(--salt-content-secondary-foreground);
}
```

## Props

All icon components accept these props:

- `size?: number | string` - Icon size (default: 24)
- `color?: string` - Icon color (default: 'currentColor')
- `className?: string` - Additional CSS classes
- `viewBox?: string` - SVG viewBox (usually not needed)

## Generating New Icons

To convert a new SVG icon to a React component:

```bash
node scripts/generate-icon.js <IconName>
```

Example:
```bash
node scripts/generate-icon.js Home
```

This will:
1. Read `public/images/Home.svg`
2. Generate `src/components/icons/Home.tsx`
3. Update `src/components/icons/index.ts`

## Benefits

- ✅ Easy sizing via `size` prop
- ✅ Easy coloring via `color` prop or CSS `color` property
- ✅ Better performance (inline SVGs, no HTTP requests)
- ✅ Type safety
- ✅ Works with Salt theme colors
- ✅ Consistent API across all icons

