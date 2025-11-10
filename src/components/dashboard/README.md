# Dashboard Card Components

## EnhancedStatCard - The Universal Card Component

`EnhancedStatCard` is the standardized component for all dashboard statistics displays. It provides consistent styling, action menus, and customization options across all dashboards.

### Props

```typescript
interface EnhancedStatCardProps {
  title: string;                    // Card title
  value: string | number;           // Main value to display
  change: string;                   // Change indicator (e.g., "+12%")
  trend: "up" | "down";            // Trend direction
  icon: React.ReactNode;           // Icon component
  variant?: "primary" | "success" | "warning" | "neutral";  // Color variant
  showAction?: boolean;            // Show primary action button
  actionLabel?: string;            // Label for action button
  onAction?: () => void;           // Action button callback
  showMenu?: boolean;              // Show action menu (3 dots)
  menuItems?: Array<{              // Menu items
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
  isCurrency?: boolean;            // Format value as currency
  rawValue?: number;               // Raw value for currency conversion
  size?: "default" | "compact" | "large";           // Card size
  layout?: "vertical" | "horizontal";               // Layout direction
  elevation?: "none" | "sm" | "md" | "lg";         // Hover elevation
  showGradient?: boolean;          // Show background gradient
  showBorder?: boolean;            // Show left border accent
  iconPosition?: "left" | "right" | "top";         // Icon position
}
```

### When to Add Action Menus

Add action menus (`showMenu={true}` with `menuItems`) when the card represents data that supports user actions:

- ✅ **View Details** - Navigate to a detailed view
- ✅ **Create New** - Add a new item of that type
- ✅ **Filter** - Open filtered view
- ✅ **Export** - Export the data
- ✅ **Refresh** - Reload the data
- ✅ **Settings** - Configure display options

### Variant Usage

Choose variants based on the card's meaning:

- **`primary`** - Main/important metrics (blue)
- **`success`** - Positive outcomes (green)
- **`warning`** - Attention needed (orange)
- **`neutral`** - Standard metrics (purple)

### Size Guidelines

- **`default`** - Most dashboard cards (p-6, text-3xl value)
- **`compact`** - Sidebar cards or dense layouts (p-4, text-2xl value)
- **`large`** - Hero cards or emphasis (p-8, text-4xl value)

### Examples

#### Basic Stat Card
```tsx
<EnhancedStatCard
  title="Active Jobs"
  value={24}
  change="+12%"
  trend="up"
  icon={<Briefcase className="h-6 w-6" />}
  variant="neutral"
/>
```

#### Card with Action Menu
```tsx
<EnhancedStatCard
  title="Total Candidates"
  value={1234}
  change="+8%"
  trend="up"
  icon={<Users className="h-6 w-6" />}
  variant="success"
  showMenu={true}
  menuItems={[
    { 
      label: "View all candidates", 
      icon: <Eye className="h-4 w-4" />, 
      onClick: () => navigate('/candidates') 
    },
    { 
      label: "Add candidate", 
      icon: <Plus className="h-4 w-4" />, 
      onClick: () => setDrawerOpen(true) 
    },
    { 
      label: "Export data", 
      icon: <Download className="h-4 w-4" />, 
      onClick: handleExport 
    },
  ]}
/>
```

#### Currency Card
```tsx
<EnhancedStatCard
  title="Total Revenue"
  value="$125,430"
  rawValue={125430}
  isCurrency={true}
  change="+15%"
  trend="up"
  icon={<DollarSign className="h-6 w-6" />}
  variant="primary"
  showMenu={true}
  menuItems={[
    { label: "View breakdown", icon: <Eye className="h-4 w-4" />, onClick: viewBreakdown },
    { label: "View trends", icon: <TrendingUp className="h-4 w-4" />, onClick: viewTrends },
  ]}
/>
```

#### Compact Card
```tsx
<EnhancedStatCard
  title="Active Projects"
  value={18}
  change="+3"
  trend="up"
  icon={<FolderKanban className="h-6 w-6" />}
  variant="neutral"
  size="compact"
  elevation="sm"
/>
```

## Card Actions Utility

The `cardActions.ts` utility provides centralized action mappings for different dashboard types. Use `getCardActions()` to automatically get appropriate icons and actions for a card:

```typescript
import { getCardActions } from '@/lib/dashboard/cardActions';

const cardData = getCardActions('Active Jobs', 'jobs');
if (cardData) {
  const { icon, actions } = cardData;
  // Use icon and actions
}
```

Available dashboard types:
- `jobs` - Jobs dashboard
- `hrms` - HRMS dashboard
- `financial` - Financial dashboard
- `consulting` - Consulting dashboard
- `rpo` - RPO dashboard
- `candidates` - Candidates dashboard
- `employers` - Employers dashboard
- `sales` - Sales dashboard

## Migration from Old Components

### From StatsCard

**Old:**
```tsx
<StatsCard
  title="Total Jobs"
  value={24}
  icon={Briefcase}
  description="Active postings"
/>
```

**New:**
```tsx
<EnhancedStatCard
  title="Total Jobs"
  value={24}
  change="+8%"
  trend="up"
  icon={<Briefcase className="h-6 w-6" />}
  variant="neutral"
  showMenu={true}
  menuItems={[...]}
/>
```

### From EmailStatsCard

**Old:**
```tsx
<EmailStatsCard
  title="Sent"
  value={1250}
  icon={Mail}
  trend={{ value: 12, isPositive: true }}
/>
```

**New:**
```tsx
<EnhancedStatCard
  title="Sent"
  value={1250}
  change="+12%"
  trend="up"
  icon={<Mail className="h-6 w-6" />}
  variant="primary"
/>
```

## Design Tokens

All cards use consistent design tokens from the design system:

### Padding
- `p-4` - Compact
- `p-6` - Default
- `p-8` - Large

### Border Radius
- `rounded-lg` - Standard
- `rounded-xl` - Icon containers

### Icon Sizes
- `h-4 w-4` - Menu icons
- `h-6 w-6` - Card icons

### Typography
- Title: `text-sm text-muted-foreground mb-2 font-medium`
- Value: `text-2xl/text-3xl/text-4xl font-bold tracking-tight`
- Change badge: `text-xs`

### Hover Effects
- Elevation: `hover:shadow-md/lg/xl`
- Transform: `hover:-translate-y-1`
- Transition: `transition-all duration-300`

### Color Variants

All variants use semantic colors from the design system:

- **Primary**: Blue tones for important metrics
- **Success**: Green/Emerald for positive outcomes
- **Warning**: Orange/Amber for attention items
- **Neutral**: Purple/Indigo for standard metrics

## Best Practices

1. **Always provide action menus** when the data supports user actions
2. **Use currency formatting** for all monetary values (`isCurrency={true}`)
3. **Choose appropriate variants** based on metric meaning, not aesthetics
4. **Keep menu items focused** - 2-4 relevant actions per card
5. **Use size appropriately** - default for most cases, compact for sidebars
6. **Provide realistic change values** - use actual calculation when possible
7. **Keep titles concise** - 2-4 words maximum
8. **Use semantic icons** - icon should match the card content

## Deprecated Components

These components are deprecated and should not be used in new code:

- ❌ `StatsCard` from `@/components/ui/stats-card`
- ❌ `EmailStatsCard` from `@/components/emails/EmailStatsCard`

**Exception:** `ConsultantMetricCard` is still used for the compact horizontal layout in consultant detail pages. This is a specialized component and should only be used in that specific context.
