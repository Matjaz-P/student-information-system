# Theme System Documentation

## Overview

The application uses a **theme-based CSS system** built on CSS custom properties (variables) with SCSS support. The default theme is **Dusky Plum**.

## Architecture

### Theme File Location
- Main theme: `src/styles/_theme.scss`
- Global styles: `src/styles.scss`

### How It Works

1. **CSS Custom Properties** (`:root` variables) - Used at runtime, can be changed dynamically
2. **SCSS Variables** - Compile-time variables that reference CSS custom properties

## Using the Theme

### In Component Styles

Import the theme in your component SCSS file:

```scss
@import '../../../styles/theme';

.my-component {
  background: var(--color-primary-600);
  color: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}
```

### Available Theme Variables

#### Colors

**Primary (Dusky Plum)**
- `--color-primary-900` to `--color-primary-50` (darkest to lightest)

**Accent Colors**
- `--color-accent-teal-600`, `--color-accent-teal-500`, `--color-accent-teal-400`
- `--color-accent-green-400`
- `--color-accent-red-400`

**Text Colors**
- `--color-text-900` to `--color-text-300`

**Grays**
- `--color-gray-900` to `--color-gray-50`

**Surfaces**
- `--color-surface` (white)
- `--color-surface-1`, `--color-surface-2`, `--color-surface-3`
- `--color-surface-hover`
- `--color-surface-alt`

**Backgrounds**
- `--color-bg-base`
- `--color-bg-gradient-start`, `--color-bg-gradient-mid`, `--color-bg-gradient-end`

#### Shadows
- `--shadow-sm` - Small shadow
- `--shadow-md` - Medium shadow
- `--shadow-lg` - Large shadow
- `--shadow-card` - Card shadow
- `--shadow-card-hover` - Card hover shadow

#### Border Radius
- `--radius-xs` (4px)
- `--radius-sm` (8px)
- `--radius-md` (12px)
- `--radius-lg` (16px)
- `--radius-xl` (20px)
- `--radius-full` (999px - for pills/circular elements)

#### Spacing
- `--spacing-xs` (0.25rem)
- `--spacing-sm` (0.5rem)
- `--spacing-md` (0.75rem)
- `--spacing-lg` (1rem)
- `--spacing-xl` (1.5rem)
- `--spacing-2xl` (2rem)
- `--spacing-3xl` (3rem)

#### Typography
- `--font-family-base`
- `--font-size-xs` to `--font-size-2xl`
- `--font-weight-normal`, `--font-weight-medium`, `--font-weight-semibold`

#### Transitions
- `--transition-base` (0.15s ease)
- `--transition-smooth` (0.2s ease)
- `--transition-interactive` (0.18s ease)

#### Component-Specific
- `--topbar-bg`, `--topbar-text`
- `--table-header-bg`, `--table-header-hover`
- `--btn-primary-bg`, `--btn-primary-hover`
- `--btn-accent-bg`, `--btn-accent-hover`
- `--btn-danger-bg`, `--btn-danger-hover`
- `--input-border`, `--input-border-focus`, `--input-bg`
- `--tag-bg`, `--tag-border`, `--tag-text`
- `--avatar-bg`, `--avatar-text`
- And more...

## Customizing Component Styles

You can still style components individually while using theme variables:

```scss
.my-custom-button {
  // Use theme variables as base
  background: var(--btn-primary-bg);
  border-radius: var(--radius-md);

  // Add custom overrides
  padding: 2rem;
  border: 2px solid var(--color-primary-300);

  &:hover {
    background: var(--btn-primary-hover);
    transform: scale(1.05);
  }
}
```

## Creating a New Theme

To create a new theme (e.g., "Dark Mode" or "Ocean Blue"):

1. Create a new theme file: `src/styles/_theme-dark.scss`
2. Copy the structure from `_theme.scss`
3. Change the color values in `:root` to your new theme colors
4. Import the new theme in `styles.scss` instead of the default theme

Example:

```scss
// _theme-dark.scss
:root {
  --color-primary-900: #1a1a2e;
  --color-primary-600: #16213e;
  --color-surface: #0f3460;
  // ... etc
}
```

## Dynamic Theme Switching (Advanced)

To support runtime theme switching:

1. Use CSS classes on the root element:
```scss
:root {
  // Default theme
}

:root.dark-theme {
  --color-primary-600: #different-color;
  // Override variables
}
```

2. Toggle the class in your app:
```typescript
document.documentElement.classList.toggle('dark-theme');
```

## Best Practices

1. **Always use theme variables** instead of hardcoded colors
2. **Import the theme** at the top of component SCSS files
3. **Use semantic variable names** (e.g., `--btn-primary-bg` instead of just the color)
4. **Maintain consistency** across components by using the same variables
5. **Don't override** theme variables within components unless necessary

## Examples

### Button Component
```scss
@import '../../../styles/theme';

.custom-button {
  background: var(--btn-accent-bg);
  color: var(--topbar-text);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-smooth);

  &:hover {
    background: var(--btn-accent-hover);
    box-shadow: var(--shadow-md);
  }
}
```

### Card Component
```scss
@import '../../../styles/theme';

.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-card);

  &:hover {
    box-shadow: var(--shadow-card-hover);
  }

  .card-title {
    color: var(--color-primary-700);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
  }

  .card-body {
    color: var(--color-text-600);
    font-size: var(--font-size-base);
  }
}
```
