# Design System - Hybrid Version

A **Notion-inspired design system** using **Chakra UI components** + **CSS Modules** for styling. Best of both worlds: Chakra's functionality with custom Notion-inspired design.

## 🎯 Why This Hybrid Approach?

### **Benefits:**
1. **Chakra's Functionality**: Built-in accessibility, state management, responsive design
2. **Custom Styling**: Our CSS Modules for precise Notion-inspired design
3. **Familiar API**: Use Chakra's prop system and patterns
4. **Type Safety**: Full TypeScript support from Chakra
5. **Flexibility**: Choose the right approach for each component

### **Perfect Use Cases:**
- **Simple components**: Our custom Button, Card, Input with Chakra functionality
- **Complex components**: Use Chakra's Breadcrumbs, DatePickers, Modals, etc.
- **Mixed approach**: Combine both for optimal results

## 🎨 Design Tokens

### Colors

```css
/* Primary Colors (Notion Blue) */
--color-primary: #2e75cc;
--color-primary-light: #5a9cf8;
--color-primary-dark: #1e5aa8;

/* Neutral Colors */
--color-gray-50: #fafafa;
--color-gray-100: #f5f5f5;
--color-gray-200: #e5e5e5;
--color-gray-300: #d4d4d4;
--color-gray-400: #a3a3a3;
--color-gray-500: #737373;
--color-gray-600: #525252;
--color-gray-700: #404040;
--color-gray-800: #262626;
--color-gray-900: #171717;

/* Semantic Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### Spacing

```css
/* 4px base unit (Notion-style) */
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Border Radius

```css
--radius-none: 0px;
--radius-sm: 3px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

## 🧩 Components

### Button (Chakra + CSS Modules)

**Variants**: `primary`, `secondary`, `ghost`, `danger`, `success`
**Sizes**: `sm`, `md`, `lg`

```tsx
import { Button } from '@/components/ui'

// Our custom variants with Chakra functionality
<Button variant="primary" size="md" isLoading>
  Loading Button
</Button>

<Button variant="secondary" isDisabled>
  Disabled Button
</Button>

// All Chakra Button props work
<Button 
  variant="primary" 
  onClick={handleClick}
  leftIcon={<Icon />}
  rightIcon={<ArrowIcon />}
>
  With Icons
</Button>
```

**Features:**
- Notion-style hover effects with subtle lift
- Chakra's loading state with spinner
- Chakra's focus management for accessibility
- Chakra's disabled state styling
- All Chakra Button props available

### Card (Chakra + CSS Modules)

**Variants**: `elevated`, `outline`, `ghost`

```tsx
import { Card } from '@/components/ui'

// Simple usage with our props
<Card 
  title="Welcome"
  content="This is a simple card with convenient props."
  footer="Last updated 2 hours ago"
/>

// Custom layout with Chakra props
<Card 
  variant="elevated" 
  onClick={handleClick}
  _hover={{ transform: 'scale(1.02)' }}
  transition="transform 0.2s"
>
  <div className="custom-content">
    <h3>Custom Layout</h3>
    <p>Any content structure</p>
  </div>
</Card>
```

**Features:**
- Flexible content structure
- Chakra's Box component with our styling
- All Chakra Box props available
- Responsive padding
- Semantic HTML structure

### Input (Chakra + CSS Modules)

**Variants**: `default`, `error`, `success`
**Sizes**: `sm`, `md`, `lg`

```tsx
import { Input } from '@/components/ui'

// Our custom variants
<Input 
  placeholder="Default input"
  variant="default"
  size="md"
/>

// All Chakra Input props work
<Input 
  placeholder="With icon"
  leftElement={<SearchIcon />}
  rightElement={<ClearIcon />}
/>
```

**Features:**
- Focus ring with brand color
- Validation states
- Autofill styling
- All Chakra Input props available

## 🎯 Usage Patterns

### Basic Layout

```tsx
import { Button, Card, Input } from '@/components/ui'
import { VStack, HStack, Text, Badge } from '@chakra-ui/react'

function MyComponent() {
  return (
    <div className="p-6 bg-gray-50">
      <Card variant="elevated" className="p-6">
        <h2 className="text-xl font-semibold mb-4">Form</h2>
        <VStack gap={4}>
          <Input placeholder="Name" />
          <Input placeholder="Email" />
          <HStack gap={2}>
            <Button variant="primary">Submit</Button>
            <Button variant="secondary">Cancel</Button>
          </HStack>
        </VStack>
      </Card>
    </div>
  )
}
```

### Mixed Components

```tsx
import { Button, Card } from '@/components/ui'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink,
  DatePicker,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react'

function MyPage() {
  return (
    <div>
      {/* Our custom components */}
      <Card variant="elevated" title="Welcome">
        <Button variant="primary">Action</Button>
      </Card>
      
      {/* Chakra components */}
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <DatePicker 
        value={date} 
        onChange={setDate}
        isClearable
      />
    </div>
  )
}
```

## 🎨 Customization

### Changing Colors

Edit `src/app/globals.css`:

```css
:root {
  /* Change primary color */
  --color-primary: #your-brand-color;
  
  /* Change background */
  --color-bg-primary: #your-bg-color;
  
  /* Add custom colors */
  --color-accent: #your-accent-color;
}
```

### Adding New Components

1. **Create component file**:
```tsx
// src/components/ui/NewComponent.tsx
import { Box, type BoxProps } from '@chakra-ui/react'
import styles from './NewComponent.module.css'

interface NewComponentProps extends BoxProps {
  variant?: 'default' | 'custom'
}

export function NewComponent({ variant = 'default', ...props }: NewComponentProps) {
  return (
    <Box 
      className={`${styles.component} ${styles[variant]}`}
      {...props}
    />
  )
}
```

2. **Create CSS module**:
```css
/* src/components/ui/NewComponent.module.css */
.component {
  /* Base styles using CSS variables */
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-primary);
}

.default {
  border: 1px solid var(--color-border-primary);
}

.custom {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}
```

3. **Export from index**:
```tsx
// src/components/ui/index.ts
export { NewComponent } from './NewComponent'
```

## 📱 Responsive Design

The design system is mobile-first:

```css
/* Mobile (default) */
.component {
  padding: var(--space-4);
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    padding: var(--space-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);
  }
}
```

## ♿ Accessibility

- **Focus indicators**: Chakra's built-in focus indicators
- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Semantic HTML and ARIA attributes
- **Color contrast**: WCAG AA compliant
- **Reduced motion**: Respects user preferences

## 🚀 Best Practices

### 1. Use CSS Variables
```css
/* ✅ Good */
.button {
  background-color: var(--color-primary);
  padding: var(--space-4);
}

/* ❌ Avoid */
.button {
  background-color: #2e75cc;
  padding: 16px;
}
```

### 2. Leverage Chakra Props
```tsx
/* ✅ Good */
<Button 
  variant="primary" 
  isLoading={loading}
  leftIcon={<Icon />}
  onClick={handleClick}
>
  Submit
</Button>

/* ❌ Avoid */
<button 
  className={styles.button}
  disabled={loading}
  onClick={handleClick}
>
  {loading ? <Spinner /> : <Icon />} Submit
</button>
```

### 3. Component Composition
```tsx
/* ✅ Good */
<Card>
  <Button variant="primary">Action</Button>
</Card>

/* ❌ Avoid */
<div className="card">
  <div className="button">Action</div>
</div>
```

## 🎯 When to Use Each Approach

### **Use Our Custom Components For:**
- ✅ Simple UI elements (Button, Card, Input)
- ✅ Consistent design language
- ✅ Notion-inspired styling
- ✅ Quick development

### **Use Chakra Components For:**
- ✅ Complex functionality (Breadcrumbs, DatePickers, Modals)
- ✅ Advanced accessibility needs
- ✅ Form validation and state management
- ✅ Rapid prototyping

### **Use Both Together For:**
- ✅ Complete applications
- ✅ Professional projects
- ✅ Complex user interfaces
- ✅ Enterprise applications

## 🔄 Comparison

### This Hybrid Approach vs Pure CSS Modules:
- ✅ **More functionality**: Chakra's built-in features
- ✅ **Better accessibility**: Chakra's a11y features
- ✅ **Faster development**: Less custom code needed
- ✅ **Consistent API**: All components use Chakra patterns

### This Hybrid Approach vs Pure Chakra UI:
- ✅ **Custom design**: Our Notion-inspired styling
- ✅ **Better control**: CSS Modules for precise styling
- ✅ **Design consistency**: Our design tokens
- ✅ **Smaller bundle**: Only include what we need

## 🎉 Benefits Summary

1. **Best of Both Worlds**: Chakra's functionality + our design
2. **Familiar API**: Use Chakra's prop system
3. **Custom Styling**: Our CSS Modules for design control
4. **Accessibility**: Chakra's built-in a11y features
5. **Type Safety**: Full TypeScript support
6. **Flexibility**: Choose the right approach for each component
7. **Developer Experience**: Familiar patterns with custom design
8. **Maintainability**: Clear separation of concerns

This hybrid approach gives you **90% of the benefits** with **optimal flexibility** - perfect for real-world projects! 