
# Banks o' Dee FC Design System

This directory contains the core UI components for the Banks o' Dee FC website design system.

## Overview

Our design system follows a consistent approach with a standardized color palette, typography system, and component library to ensure visual cohesion across the entire website.

## Color System

### Primary Colors
- Primary Blue (`primary-800`): #00105A - Used for main headers, primary buttons
- Range: 50-900 for various shades and tints

### Secondary Colors
- Light Blue (`secondary-300`): #C5E7FF - Used for highlights, secondary elements
- Range: 50-900 for various shades and tints

### Accent Colors
- Gold (`accent-500`): #FFD700 - Used for accents, call-to-actions
- Range: 300-700 for various shades and tints

### Neutrals
- Gray scale from 50-900

## Typography System

Our typography system provides a consistent hierarchy across the site:

### Headings
- H1: `text-3xl md:text-4xl font-bold text-primary-800`
- H2: `text-2xl md:text-3xl font-bold text-primary-800`
- H3: `text-xl md:text-2xl font-semibold text-primary-800`
- H4: `text-lg md:text-xl font-semibold text-primary-800`
- Subtitle: `text-lg font-medium text-primary-600`

### Body Text
- Body: `text-base text-gray-700`
- Small: `text-sm text-gray-500`

## Core Components

### Button
Our button component (`button.tsx`) supports multiple variants:
- `default`: Primary blue button
- `secondary`: Light blue button
- `accent`: Gold button
- `outline`: Bordered button
- `link`: Text link style

Additional features:
- Multiple sizes: `sm`, `default`, `lg`
- Loading state
- Disabled state
- Icon support
- Full-width option

### Card
Our card component (`card.tsx`) supports:
- Various variants: `default`, `primary`, `secondary`, `accent`
- Header, content, and footer sections
- Consistent styling with standardized shadows and hover effects

### Typography
The Typography component provides standardized text styles:
- Import individual components: `H1`, `H2`, `H3`, `H4`, `Subtitle`, `Body`, `Small`
- Customize with className prop
- Change the rendered element with the `as` prop

### BaseText
A flexible text component that provides consistent styling based on variant:
- `variant`: Choose between `h1`, `h2`, `h3`, `h4`, `subtitle`, `body`, `small`
- `className`: Add additional classes
- `color`: Override the default color
- `as`: Change the rendered element

### Container
Layout utility for consistent spacing and max-widths:
- `size`: `sm`, `md`, `lg`, `full`
- `padding`: `none`, `sm`, `md`, `lg`
- `as`: Change the rendered element

## Usage

Import components directly:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { H1, Body } from "@/components/ui/Typography";

export default function MyComponent() {
  return (
    <div>
      <H1>My Page Title</H1>
      <Body>Some content here...</Body>
      
      <Card>
        <CardHeader>Card Title</CardHeader>
        <CardContent>
          <p>Card content here...</p>
          <Button>Click Me</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Spacing System

We use a consistent spacing system:
- Section padding: `p-section` (2rem)
- Card padding: `p-card` (1rem)
- Element spacing: `p-element` (0.5rem)

## Accessibility

All components are built with accessibility in mind:
- Proper ARIA attributes
- Keyboard navigation support
- Focus states
- Color contrast compliance

## Responsive Design

All components are mobile-first and responsive by default using standard Tailwind breakpoints:
- sm: 640px and above
- md: 768px and above
- lg: 1024px and above
- xl: 1280px and above
