# React + Ionic + Salt Design System - Mobile Web App Instructions

This document contains instructions, patterns, and best practices for building mobile web applications using React, Ionic React, and the Salt Design System. Follow these guidelines to ensure consistency, maintainability, and excellent mobile UX.

## Table of Contents

- [Navigation & Routing](#navigation--routing)
- [Styling & Theming](#styling--theming)
- [Component Patterns](#component-patterns)
- [Icons](#icons)
- [Data Organization](#data-organization)
- [Mobile UI Best Practices](#mobile-ui-best-practices)
- [Page Structure](#page-structure)
- [Header Patterns](#header-patterns)
- [List Patterns](#list-patterns)
- [Action Bars & Buttons](#action-bars--buttons)
- [Animations & Transitions](#animations--transitions)
- [Performance & Accessibility](#performance--accessibility)

---

## Navigation & Routing

### ✅ DO: Use `useIonRouter` for Navigation

**Always use `useIonRouter` instead of `history.push` or `history.replace`** to enable Ionic transitions:

```typescript
import { useIonRouter } from '@ionic/react';

const MyComponent: React.FC = () => {
  const router = useIonRouter();

  const handleNavigation = () => {
    // Use 'root' direction to reset navigation stack
    // Use 'replace' action to prevent back navigation to previous state
    router.push('/target-path', 'root', 'replace');
  };
};
```

### ✅ DO: Pass Context via `location.state`

When navigating to detail pages, pass context via `location.state` to maintain tab bar highlighting and provide data:

```typescript
import { useHistory, useLocation } from 'react-router-dom';

// When navigating TO a detail page:
history.push('/transaction-details', {
  transaction: transactionData,
  source: 'payments', // or 'accounts'
  actionType: 'approve', // optional
});

// On the detail page:
const location = useLocation();
const state = location.state as { transaction: Transaction; source: string };
const transaction = state?.transaction;
```

### ✅ DO: Use Route Prefixes for Feature Groups

Group related routes under a common prefix:

```typescript
// ✅ Good: Feature-grouped routes
<Route exact path="/deposits" />
<Route exact path="/deposits/deposit-to" />
<Route exact path="/deposits/capture-check" />
<Route exact path="/deposits/capture-history" />

// ❌ Bad: Flat routes
<Route exact path="/deposit-to" />
<Route exact path="/capture-check" />
```

### ✅ DO: Maintain Tab Bar Context

Tab bar highlighting should reflect the current section, even on detail pages:

```typescript
const isTabSelected = (path: string) => {
  const currentPath = location.pathname;
  const state = location.state as TabBarLocationState | undefined;

  // Maintain highlight based on source context
  if (currentPath === '/transaction-details' && state?.source) {
    if (state.source === 'payments' && path === '/payments') return true;
    if (state.source === 'accounts' && path === '/accounts') return true;
    return false;
  }

  // Support route prefixes
  if (currentPath.startsWith('/deposits/') && path === '/deposits') {
    return true;
  }

  return currentPath === path || currentPath.startsWith(path + '/');
};
```

---

## Styling & Theming

### ✅ DO: Always Use Salt Design System CSS Variables

**Never hardcode colors, spacing, or sizing.** Use Salt's CSS variables:

```css
/* ✅ Good */
color: var(--salt-content-primary-foreground);
padding: var(--salt-spacing-150);
background: var(--salt-card-background);
border-color: var(--salt-separable-secondary-borderColor);

/* ❌ Bad */
color: #333;
padding: 12px;
background: white;
border-color: #e0e0e0;
```

### ✅ DO: Define Custom Variables in `.salt-theme`

Add project-specific variables in `index.css`:

```css
.salt-theme {
  --sale-button-radius: 10px;
  --saltButton-borderRadius: 10px;
  /* Add other custom variables here */
}
```

### ✅ DO: Organize Styles by Scope

- **Global styles**: `src/index.css` (theme, Ionic overrides, common utilities)
- **Page-specific styles**: `src/pages/home.css` (reusable component classes)
- **Component-specific styles**: Inline styles or component CSS modules

### ✅ DO: Use Spacing Variables Consistently

Use Salt spacing scale variables:

```css
/* Spacing scale: 50, 100, 150, 200, 300, etc. */
padding: var(--salt-spacing-150);
gap: var(--salt-spacing-100);
margin: var(--salt-spacing-50) var(--salt-spacing-100);
```

### ✅ DO: Use Consistent Border Radius

Use defined variables for border radius:

```css
/* For buttons and cards */
border-radius: var(--sale-button-radius);
/* Or */
border-radius: var(--saltButton-borderRadius);

/* For fully rounded (pills) */
border-radius: 999px;

/* For small rounded elements */
border-radius: 4px;
```

---

## Component Patterns

### ✅ DO: Use Salt Components for UI Elements

Prefer Salt components for layout and UI:

```typescript
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';

// ✅ Good: Salt components
<StackLayout gap={1}>
  <Text styleAs="h4">Title</Text>
  <Text styleAs="label">Description</Text>
</StackLayout>

// ❌ Bad: Generic divs with manual styling
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <h4>Title</h4>
  <p>Description</p>
</div>
```

### ✅ DO: Use Ionic Components for Mobile Structure

Use Ionic components for page structure and mobile-specific features:

```typescript
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';

<IonPage>
  <IonHeader translucent={false}>
    <IonToolbar className="salt-toolbar">
      {/* Toolbar content */}
    </IonToolbar>
  </IonHeader>
  <IonContent fullscreen>
    {/* Page content */}
  </IonContent>
</IonPage>
```

---

## Icons

### ✅ DO: Convert SVGs to TSX Components

All icons should be TSX components in `src/components/icons/`:

```typescript
// src/components/icons/ArrowBack.tsx
import React from 'react';
import { Icon, IconProps } from './Icon';

export const ArrowBack: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props} viewBox="0 0 48 48">
    <path d="M30.83 14.83l-2.42-2.42L18 22l10.41 9.59 2.42-2.42L22.84 22z"/>
  </Icon>
);
```

### ✅ DO: Use Icon Components Instead of Text

**Always use icon components for navigation and actions:**

```typescript
// ✅ Good: Icon component
<ArrowBack size={18} className="salt-inline-icon" />

// ❌ Bad: Text label
<Text styleAs="label">Back</Text>
```

### ✅ DO: Apply Inline Icon Classes

Use `salt-inline-icon` for inline icons in buttons and text:

```typescript
<Button>
  <ArrowBack size={18} className="salt-inline-icon" />
</Button>
```

### ✅ DO: Use Consistent Icon Sizes

Standard sizes:
- **18px**: Header navigation (back buttons, cancel buttons)
- **20px**: List items, inline actions
- **24px-30px**: Tab bar icons
- **16px**: Small inline status icons

---

## Data Organization

### ✅ DO: Extract Mock Data to Separate Files

Store mock data in `src/data/` with TypeScript types:

```typescript
// src/data/captureHistoryData.ts
export type CaptureHistoryItem = {
  id: string;
  title: string;
  amount: string;
  status: 'action-required' | 'deposited';
};

export const captureHistoryData: CaptureHistoryItem[] = [
  {
    id: '1',
    title: 'Example',
    amount: '100.00',
    status: 'deposited',
  },
];
```

### ✅ DO: Export Types with Data

Always export the TypeScript type alongside the data:

```typescript
// ✅ Good: Type exported
export type MyDataType = { /* ... */ };
export const myData: MyDataType[] = [ /* ... */ ];

// ❌ Bad: Type inline or missing
const myData = [ /* ... */ ];
```

---

## Mobile UI Best Practices

### ✅ DO: Use Full-Screen Content

Use `fullscreen` prop on `IonContent` for immersive mobile experience:

```typescript
<IonContent fullscreen>
  {/* Content */}
</IonContent>
```

### ✅ DO: Respect Safe Areas

Always account for safe area insets on iOS:

```css
/* Bottom padding with safe area */
padding-bottom: calc(var(--salt-spacing-150) + env(safe-area-inset-bottom));

/* Action bars should use safe area */
.salt-action-bar {
  padding-bottom: calc(var(--salt-spacing-150) + env(safe-area-inset-bottom));
}
```

### ✅ DO: Implement Touch-Friendly Targets

Ensure interactive elements are at least 44x44px for touch:

```css
/* Minimum touch target */
min-height: 44px;
min-width: 44px;
```

### ✅ DO: Use Edge-to-Edge Lists Where Appropriate

For list views, remove side padding for edge-to-edge design:

```css
.salt-list-item {
  padding: var(--salt-spacing-150); /* Only top/bottom */
}

.salt-list-item-content {
  padding: 0 var(--salt-spacing-150); /* Content has side padding */
}
```

### ✅ DO: Keep Search Fields in Headers

Search inputs should be in headers to remain fixed during scroll:

```typescript
<IonHeader>
  <IonToolbar>
    {/* Search input here - stays fixed */}
  </IonToolbar>
</IonHeader>
```

### ✅ DO: Use Consistent List Row Patterns

Use full-width list items with consistent structure:

```typescript
<div className="salt-list-item">
  <div className="salt-list-item-content">
    {/* Content */}
  </div>
</div>
```

---

## Page Structure

### ✅ DO: Follow Standard Page Structure

Every page should follow this structure:

```typescript
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';

const MyPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          {/* Header content */}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="salt-page-shell">
          {/* Page content */}
        </div>
      </IonContent>
    </IonPage>
  );
};
```

### ✅ DO: Use `salt-page-shell` Class

Wrap page content in `salt-page-shell` for consistent background:

```typescript
<IonContent fullscreen>
  <div className="salt-page-shell">
    {/* Page content */}
  </div>
</IonContent>
```

---

## Header Patterns

### ✅ DO: Use Three-Column Header Layout

For headers with back navigation, title, and actions:

```typescript
<IonToolbar className="salt-toolbar">
  <div className="salt-toolbar-content">
    <div className="salt-toolbar-3column">
      <div className="salt-toolbar-column-left">
        <Button
          appearance="transparent"
          sentiment="neutral"
          onClick={handleBack}
          style={{ padding: `0 var(--salt-spacing-100)` }}
        >
          <ArrowBack size={18} className="salt-inline-icon" />
        </Button>
      </div>
      <div className="salt-toolbar-column-center">
        <Text styleAs="h4" className="salt-toolbar-title">
          Page Title
        </Text>
      </div>
      <div className="salt-toolbar-column-right">
        <Button
          appearance="transparent"
          sentiment="neutral"
          onClick={handleCancel}
          style={{ padding: `0 var(--salt-spacing-100)` }}
        >
          <Text styleAs="label">Cancel</Text>
        </Button>
      </div>
    </div>
  </div>
</IonToolbar>
```

### ✅ DO: Add Cancel Buttons to Modal-Like Flows

For multi-step flows or modal-like pages, add a cancel button in the header:

```typescript
<div className="salt-toolbar-column-right">
  <Button
    appearance="transparent"
    sentiment="neutral"
    onClick={() => router.push('/main-page', 'root', 'replace')}
  >
    <Text styleAs="label">Cancel</Text>
  </Button>
</div>
```

---

## List Patterns

### ✅ DO: Use Reusable List Item Classes

Use predefined classes for consistent list styling:

```css
/* Standard list item */
.salt-list-item

/* List item without background (for blank rows) */
.salt-list-item-blank

/* Selected state */
.salt-list-item-selected

/* List with checkboxes */
.salt-list-item-has-checkbox
```

### ✅ DO: Structure List Items Consistently

```typescript
<div className="salt-list-item">
  <div className="salt-list-item-content">
    <StackLayout gap={0.5}>
      <Text styleAs="h4">Primary Text</Text>
      <Text styleAs="label">Secondary Text</Text>
    </StackLayout>
  </div>
</div>
```

---

## Action Bars & Buttons

### ✅ DO: Use Fixed Bottom Action Bars

For primary actions at the bottom of pages:

```typescript
<div className="salt-action-bar">
  <FlexLayout gap={1} className="salt-action-bar-buttons">
    <Button
      appearance="bordered"
      sentiment="neutral"
      className="salt-action-bar-button salt-action-bar-button-reject"
      onClick={handleReject}
    >
      <Text styleAs="label">Reject</Text>
    </Button>
    <Button
      appearance="solid"
      sentiment="accented"
      className="salt-action-bar-button salt-action-bar-button-primary"
      onClick={handlePrimary}
    >
      <Text styleAs="label">Primary Action</Text>
    </Button>
  </FlexLayout>
</div>
```

### ✅ DO: Add Bottom Padding for Action Bars

Add padding to content when using fixed action bars:

```typescript
<StackLayout gap={0} style={{ paddingBottom: '150px' }}>
  {/* Content */}
</StackLayout>
```

### ✅ DO: Use Salt Button Variables

Style buttons using Salt variables:

```css
.salt-custom-button {
  --saltButton-padding: 0 var(--salt-spacing-150);
  --saltButton-height: 100%;
  --saltButton-text-color: var(--salt-content-secondary-foreground);
  --saltButton-borderColor: var(--salt-separable-secondary-borderColor);
  --saltButton-background: var(--salt-actionable-primary-background);
  border-radius: var(--saltButton-borderRadius);
}
```

---

## Animations & Transitions

### ✅ DO: Use CSS Transitions for Smooth Animations

Prefer CSS transitions for height-based animations:

```typescript
const [isExpanded, setIsExpanded] = useState(true);
const contentRef = useRef<HTMLDivElement>(null);
const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');

useEffect(() => {
  if (contentRef.current) {
    if (isExpanded) {
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      setContentHeight(0);
    }
  }
}, [isExpanded]);

<div
  ref={contentRef}
  style={{
    height: contentHeight === 'auto' ? 'auto' : `${contentHeight}px`,
    overflow: 'hidden',
    transition: 'height 0.3s ease-in-out',
  }}
>
  {/* Content */}
</div>
```

### ✅ DO: Measure Content Height Properly

Use `setTimeout` to ensure DOM is fully rendered before measuring:

```typescript
useEffect(() => {
  if (contentRef.current) {
    setTimeout(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    }, 0);
  }
}, []);
```

---

## Performance & Accessibility

### ✅ DO: Use Conditional Rendering

Only render expensive components when needed:

```typescript
{isExpanded && (
  <ExpensiveComponent />
)}
```

### ✅ DO: Provide ARIA Labels

Add aria-label to icon-only buttons:

```typescript
<Button
  aria-label="Back"
  onClick={handleBack}
>
  <ArrowBack size={18} className="salt-inline-icon" />
</Button>
```

### ✅ DO: Optimize Images

- Use appropriate image formats (WebP, SVG)
- Lazy load images when possible
- Provide alt text for images

### ✅ DO: Handle Loading States

Show loading indicators during async operations:

```typescript
{isLoading ? (
  <IonSpinner />
) : (
  <Content />
)}
```

---

## Common Patterns

### Tab Bar Implementation

```typescript
const TabBar: React.FC = () => {
  const router = useIonRouter();
  const location = useLocation();

  const handleTabClick = (path: string) => {
    router.push(path, 'root', 'replace');
  };

  const isTabSelected = (path: string) => {
    const currentPath = location.pathname;
    const state = location.state as TabBarLocationState | undefined;

    // Handle detail pages with source context
    if (currentPath === '/transaction-details' && state?.source) {
      if (state.source === 'payments' && path === '/payments') return true;
      if (state.source === 'accounts' && path === '/accounts') return true;
      return false;
    }

    // Handle route prefixes
    if (currentPath.startsWith('/deposits/') && path === '/deposits') {
      return true;
    }

    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <IonTabBar slot="bottom">
      <IonTabButton
        tab="home"
        selected={isTabSelected('/home')}
        onClick={() => handleTabClick('/home')}
      >
        <HomeIcon size={30} className="tab-icon" />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      {/* More tabs */}
    </IonTabBar>
  );
};
```

### Search with Filter

```typescript
<IonHeader>
  <IonToolbar>
    <FlexLayout align="center" gap={1}>
      <FlexLayout align="center" gap={1} className="salt-search-input">
        <Search size={20} className="salt-icon-subtle salt-inline-icon" />
        <input
          type="search"
          value={searchText}
          placeholder="Search"
          onChange={e => setSearchText(e.target.value)}
        />
      </FlexLayout>
      <Button
        appearance="bordered"
        sentiment="neutral"
        className="salt-filter-button"
        aria-label="Filter"
      >
        <Filter size={20} className="salt-filter-icon salt-inline-icon" />
      </Button>
    </FlexLayout>
  </IonToolbar>
</IonHeader>
```

---

## Checklist for New Pages

- [ ] Page uses `IonPage`, `IonHeader`, `IonToolbar`, `IonContent`
- [ ] Content wrapped in `salt-page-shell`
- [ ] Header uses `salt-toolbar` class
- [ ] Back navigation uses `ArrowBack` icon component
- [ ] All styling uses Salt CSS variables
- [ ] Spacing uses Salt spacing variables
- [ ] Icons are TSX components (not inline SVG)
- [ ] Mock data extracted to `src/data/` if applicable
- [ ] Safe area insets respected for bottom padding
- [ ] Touch targets are at least 44x44px
- [ ] ARIA labels on icon-only buttons
- [ ] Navigation uses `useIonRouter` with proper direction
- [ ] Context passed via `location.state` when needed

---

## Anti-Patterns to Avoid

### ❌ DON'T: Use `history.push` Directly

```typescript
// ❌ Bad
history.push('/target');

// ✅ Good
router.push('/target', 'root', 'replace');
```

### ❌ DON'T: Hardcode Colors or Spacing

```typescript
// ❌ Bad
<div style={{ color: '#333', padding: '12px' }}>

// ✅ Good
<div style={{ color: 'var(--salt-content-primary-foreground)', padding: 'var(--salt-spacing-150)' }}>
```

### ❌ DON'T: Use Text for Navigation

```typescript
// ❌ Bad
<Text styleAs="label">Back</Text>

// ✅ Good
<ArrowBack size={18} className="salt-inline-icon" />
```

### ❌ DON'T: Store Mock Data in Components

```typescript
// ❌ Bad: Inline in component
const data = [/* ... */];

// ✅ Good: In src/data/
export const data = [/* ... */];
```

### ❌ DON'T: Ignore Safe Areas

```css
/* ❌ Bad */
padding-bottom: var(--salt-spacing-150);

/* ✅ Good */
padding-bottom: calc(var(--salt-spacing-150) + env(safe-area-inset-bottom));
```

---

## Additional Resources

- [Ionic React Documentation](https://ionicframework.com/docs/react)
- [Salt Design System Documentation](https://www.saltdesignsystem.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Mobile Web Best Practices](https://web.dev/mobile/)

---

**Remember**: Consistency is key. Following these patterns ensures maintainability, scalability, and excellent mobile UX across your application.

