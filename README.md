# Frontend Boilerplate - Hybrid Version

A modern Next.js app with a **Notion-inspired design system** using **Chakra UI components** + **CSS Modules** for styling. Best of both worlds: Chakra's functionality with custom Notion-inspired design.

## ✨ Features

- **Notion-inspired Design**: Clean, modern aesthetic with subtle shadows and spacing
- **Chakra UI Components**: Built-in accessibility, state management, and functionality
- **CSS Modules**: Custom styling with our design tokens
- **TypeScript**: Full type safety
- **Responsive**: Mobile-first design
- **Accessible**: Chakra's built-in accessibility features
- **Flexible**: Use Chakra's props + our custom styling
- **Database Integration**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js ready

## 🎨 Design System

### Colors
- **Primary**: Notion blue (`#2e75cc`)
- **Neutral**: Clean grays for text and backgrounds
- **Semantic**: Success, warning, and error states

### Components
- **Button**: 5 variants (primary, secondary, ghost, danger, success) + 3 sizes
- **Card**: 3 variants (elevated, outline, ghost) with flexible content
- **Input**: Form inputs with validation states
- **Plus**: All Chakra UI components available (Breadcrumbs, DatePickers, Modals, etc.)

### Spacing
- **4px base unit**: Consistent spacing scale (4px, 8px, 16px, 24px, etc.)
- **Subtle shadows**: Notion-style elevation system
- **Clean typography**: System fonts with proper hierarchy

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo>
cd frontend-boilerplate

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔄 Daily Development Workflow

### **After Computer Restart / Starting Fresh**

1. **Start the Database**
   ```bash
   cd frontend-boilerplate
   docker-compose up -d
   ```

2. **Verify Database is Running**
   ```bash
   docker-compose ps
   ```
   You should see `postgres_db` with status "Up" and "(healthy)".

3. **Start Your Next.js App**
   ```bash
   npm run dev
   ```

4. **Test Everything is Working**
   Visit: `http://localhost:3000/api/test-db`
   
   You should get:
   ```json
   {
     "success": true,
     "message": "Database connection successful",
     "data": { ... }
   }
   ```

### **Daily Workflow Summary**
```bash
# Start development
docker-compose up -d    # Start database
npm run dev            # Start Next.js app

# When done for the day
docker-compose down    # Stop database (optional - saves resources)
```

### **Troubleshooting**
- **Database not starting?** → `docker-compose down && docker-compose up -d`
- **Need to check database status?** → `docker logs postgres_db`
- **Port conflicts?** → Check if local PostgreSQL is running on port 5433

**Note:** Your database data persists between restarts, so you don't lose anything!

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # CSS variables and global styles
│   ├── layout.tsx           # Root layout with Chakra Provider
│   └── page.tsx             # Homepage with component showcase
├── components/
│   └── ui/
│       ├── Button.tsx       # Chakra Button + CSS Modules
│       ├── Button.module.css
│       ├── Card.tsx         # Chakra Box + CSS Modules
│       ├── Card.module.css
│       ├── Input.tsx        # Chakra Input + CSS Modules
│       ├── Input.module.css
│       ├── provider.tsx     # Chakra UI Provider
│       └── index.ts         # Component exports
```

## 🎯 Usage Examples

### Button Component (Chakra + CSS Modules)
```tsx
import { Button } from '@/components/ui'

// Different variants with Chakra props
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

### Card Component (Chakra + CSS Modules)
```tsx
import { Card } from '@/components/ui'

// Simple card with props
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
>
  <div className="custom-content">
    <h3>Custom Layout</h3>
    <p>Completely custom content structure</p>
  </div>
</Card>
```

### Input Component (Chakra + CSS Modules)
```tsx
import { Input } from '@/components/ui'

// Different states with Chakra validation
<Input 
  placeholder="Default input" 
  isInvalid={hasError}
  errorBorderColor="red.500"
/>

// All Chakra Input props work
<Input 
  placeholder="With icon"
  leftElement={<SearchIcon />}
  rightElement={<ClearIcon />}
/>
```

### Complex Chakra Components
```tsx
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

// Breadcrumbs with full functionality
<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="#">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="#">Products</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>

// DatePicker with validation
<DatePicker 
  value={date} 
  onChange={setDate}
  isClearable
  showTimeSelect
  isInvalid={dateError}
/>
```

## 🎨 Customization

### Changing Colors
Edit `src/app/globals.css` to customize the design tokens:

```css
:root {
  /* Change primary color */
  --color-primary: #your-color;
  
  /* Change background */
  --color-bg-primary: #your-bg-color;
  
  /* Add custom colors */
  --color-custom: #your-custom-color;
}
```

### Adding New Components
1. Create component file: `src/components/ui/NewComponent.tsx`
2. Create CSS module: `src/components/ui/NewComponent.module.css`
3. Export from: `src/components/ui/index.ts`

Example:
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

## 🛠 Development

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check
```

## 📱 Responsive Design

The design system is mobile-first and includes responsive breakpoints:
- **Mobile**: Default styles
- **Tablet**: `@media (min-width: 768px)`
- **Desktop**: `@media (min-width: 1024px)`

## ♿ Accessibility

- **Focus management**: Chakra's built-in focus indicators
- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Semantic HTML and ARIA attributes
- **Color contrast**: WCAG AA compliant
- **Reduced motion**: Respects user preferences

## 🎯 Perfect For

- **Personal projects**: Blogs, portfolios, personal websites
- **Small business**: Company websites, landing pages
- **Prototypes**: Quick MVPs and concept validation
- **Learning**: Understanding modern CSS and React patterns
- **Client projects**: Professional websites with clean design
- **Complex applications**: When you need advanced components

## 🔄 vs Other Approaches

### This Hybrid Approach vs Pure CSS Modules:
- ✅ **More functionality**: Chakra's built-in features
- ✅ **Better accessibility**: Chakra's a11y features
- ✅ **Faster development**: Less custom code needed
- ✅ **Consistent API**: All components use Chakra patterns

### This Hybrid Approach vs Pure Chakra UI:
- ✅ **Custom design**: Our Notion-inspired styling
- ✅ **Smaller bundle**: Only include what we need
- ✅ **Better control**: CSS Modules for precise styling
- ✅ **Design consistency**: Our design tokens

## 🚀 Benefits of This Approach

1. **Best of Both Worlds**: Chakra's functionality + our design
2. **Familiar API**: Use Chakra's prop system
3. **Custom Styling**: Our CSS Modules for design control
4. **Accessibility**: Chakra's built-in a11y features
5. **Type Safety**: Full TypeScript support
6. **Flexibility**: Choose the right approach for each component

## 📄 License

MIT License - feel free to use this boilerplate for your projects!
