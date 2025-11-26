---
alwaysApply: false
---
## Page Headers

### Standard Pattern: `AtsPageHeader`

**Always use `AtsPageHeader` for top-of-page structure.**

- Title and optional subtitle are displayed at the top
- Action bar (buttons, pill groups, toggles) is passed as `children` and rendered just below the title
- **Never** use `DashboardPageLayout` `title` prop when using `AtsPageHeader` (prevents double headings)
- Keep `breadcrumbActions` if needed for navigation

#### Implementation

```tsx
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";

function MyPage() {
  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader 
          title="Page Title" 
          subtitle="Optional descriptive subtitle"
        >
          {/* Action bar content */}
          <div className="flex items-center gap-2">
            <Button size="sm">Primary Action</Button>
            <Button variant="outline" size="sm">Secondary</Button>
          </div>
        </AtsPageHeader>
        
        {/* Page content */}
      </div>
    </DashboardPageLayout>
  );
}
```

#### Specifications

- **Title:** `text-3xl font-bold tracking-tight`
- **Subtitle:** `text-muted-foreground mt-2`
- **Action Bar Container:**
  - `mt-4 flex flex-wrap items-center gap-2`
  - `min-w-0 max-w-full rounded-xl border bg-background/80 backdrop-blur`
  - `px-3 py-2 shadow-sm overflow-x-auto`
  - Includes `WebkitOverflowScrolling: 'touch'` for smooth mobile scrolling

#### Common Mistakes

❌ **Don't:**
- Use both `AtsPageHeader` and `DashboardPageLayout` title prop
- Use manual `<h1>` tags instead of `AtsPageHeader`
- Put action buttons outside the action bar container

✅ **Do:**
- Use `AtsPageHeader` for all page headers
- Pass actions as `children` prop
- Use `size="sm"` for buttons in action bar

---

## Stat Cards (KPI)

### Component: `EnhancedStatCard`

**Use `EnhancedStatCard` for all KPI/metrics displays.**

#### Default Props (Recommended)

```tsx
<EnhancedStatCard
  title="Total Applications"
  value={1234}
  change="+12.5%"
  trend="up"
  icon={<FileText className="h-5 w-5" />}
  variant="neutral"  // Always use neutral for consistency
  // Use defaults - do NOT set showBorder or elevation
/>
```

#### Default Behavior

- ❌ **No colored borders** (`showBorder={false}` by default)
- ❌ **No hover elevation** (`elevation="none"` by default)
- ✅ **Neutral variant** for all stat cards (consistent icon colors)
- ✅ **Compact padding** (`p-4` by default, reduced from `p-6`)
- ✅ **Subtle icon chip** with fixed `w-10 h-10` size
- ✅ **Top-right pill** uses `Badge variant="outline"` with no hover transitions
- ✅ **Consistent header row:** icon left, pill right
- ✅ **Minimal internal spacing** (`mb-2` between icon/badge and title, `mb-1` between title and value)

#### Value Sizes

```tsx
// Compact
size="compact"  // text-xl, p-3

// Default (recommended)
size="default"  // text-2xl, p-4

// Large
size="large"    // text-3xl, p-6
```

#### Implementation

```tsx
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { FileText, Users, DollarSign } from "lucide-react";

function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <EnhancedStatCard
        title="Total Applications"
        value={1234}
        change="+12.5%"
        trend="up"
        icon={<FileText className="h-5 w-5" />}
      />
      <EnhancedStatCard
        title="Active Candidates"
        value={567}
        change="-2.3%"
        trend="down"
        icon={<Users className="h-5 w-5" />}
      />
    </div>
  );
}
```

#### Common Mistakes

❌ **Don't:**
- Set `showBorder={true}`
- Set `elevation="sm"` or any hover elevation
- Add custom hover effects
- Use colored left borders
- Use variants other than `neutral` (e.g., `primary`, `success`, `warning`)

✅ **Do:**
- Always use `variant="neutral"` for consistency
- Rely on component defaults for padding and spacing
- Use appropriate size prop
- Keep icon size consistent (`h-5 w-5` or `h-6 w-6`)

---

## Typography

### Heading Hierarchy

| Element | Size | Usage |
|---------|------|-------|
| Page Title (via AtsPageHeader) | `text-3xl` | Main page heading |
| Section Headings (CardTitle) | `text-base font-semibold` | Card sections |
| Subsection Headings | `text-sm font-semibold` | Nested sections |
| Body Text | `text-sm` | Default content |
| Metadata/Captions | `text-xs text-muted-foreground` | Secondary info |

### Card Typography

```tsx
// Card Title
<CardTitle className="text-base font-semibold">Section Title</CardTitle>

// Card Description
<CardDescription className="text-sm">Descriptive text</CardDescription>

// Card Content Labels
<p className="text-xs text-muted-foreground mb-1">Label</p>
<p className="text-sm font-medium">Value</p>
```

### Text Sizing Rules

- **Card Titles:** `text-base font-semibold` (not default size)
- **Stat Card Titles:** `text-sm text-muted-foreground font-medium`
- **List Item Titles:** `text-sm font-semibold`
- **Metadata:** `text-xs text-muted-foreground`
- **Buttons in Headers:** Use `size="sm"`

### Common Mistakes

❌ **Don't:**
- Use `text-lg` or larger for CardTitle
- Use `text-2xl` or larger for section headings
- Mix different heading sizes on same level

✅ **Do:**
- Use consistent size hierarchy
- Always specify size on CardTitle
- Use `text-xs` for badges and pills

---

## Pills, Filters, and Badges

### Standard Pill/Badge Pattern

```tsx
import { Badge } from "@/components/ui/badge";

// Standard badge
<Badge variant="outline" className="h-7 px-2 text-xs rounded-full">
  Status
</Badge>

// With soft background
<Badge 
  variant="outline" 
  className="h-7 px-2 text-xs rounded-full bg-success/10 text-success border-success/20"
>
  Active
</Badge>
```

### Specifications

- **Height:** `h-7` (default) or `h-6` (dense pages)
- **Padding:** `px-2` or `px-3`
- **Text:** `text-xs`
- **Shape:** `rounded-full`
- **Variant:** Always `variant="outline"`
- **No hover color shifts** - keep static

### PillGroup Component

```tsx
import { PillGroup } from "@/components/ui/pills/PillGroup";

<PillGroup>
  <Button variant="outline" size="sm">Filter 1</Button>
  <Button variant="outline" size="sm">Filter 2</Button>
  <Button variant="outline" size="sm">Filter 3</Button>
</PillGroup>
```

### PillGroup Container Styling

- `inline-flex items-center gap-1`
- `rounded-full border bg-muted/40`
- `px-1 py-1 shadow-sm`
- `max-w-full overflow-x-auto whitespace-nowrap`

### Table Status Badges

```tsx
<Badge 
  variant="outline" 
  className="h-6 px-2 text-xs rounded-full bg-success/10 text-success border-success/20"
>
  Completed
</Badge>
```

### Common Mistakes

❌ **Don't:**
- Use `variant="default"` or `variant="secondary"`
- Add `hover:` color changes
- Use `rounded-md` instead of `rounded-full`
- Use sizes larger than `text-xs`

✅ **Do:**
- Always use `variant="outline"`
- Use soft backgrounds (`bg-success/10`, etc.)
- Keep consistent sizing
- Use subtle borders (`border-success/20`)

---

## Navigation Tabs

### Tab Navigation Pattern

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <div className="overflow-x-auto -mx-1 px-1">
    <TabsList className="inline-flex w-auto gap-1 rounded-full border bg-muted/40 px-1 py-1 shadow-sm">
      <TabsTrigger 
        value="tab1"
        className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
      >
        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
        Tab Label
      </TabsTrigger>
    </TabsList>
  </div>
  
  <TabsContent value="tab1" className="mt-6">
    {/* Content */}
  </TabsContent>
</Tabs>
```

### Tab Specifications

- **Container:** Wrap `TabsList` with `overflow-x-auto -mx-1 px-1`
- **TabsList:** `inline-flex w-auto gap-1 rounded-full border bg-muted/40 px-1 py-1 shadow-sm`
- **TabsTrigger:**
  - `inline-flex items-center gap-1.5`
  - `h-7 px-3 rounded-full text-xs whitespace-nowrap`
  - Active: `data-[state=active]:bg-background data-[state=active]:shadow-sm`
- **Icons:** `h-3.5 w-3.5 flex-shrink-0`

### Common Mistakes

❌ **Don't:**
- Use grid layout (`grid-cols-*`) for tabs
- Forget horizontal scroll wrapper
- Use vertical layout for tabs
- Use large text sizes

✅ **Do:**
- Use `inline-flex` layout
- Always wrap with overflow container
- Keep icons small and consistent
- Use horizontal layout

---

## Cards and Containers

### Standard Card Pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-base font-semibold">Card Title</CardTitle>
    <CardDescription className="text-sm">Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Card Padding

- **Default:** `p-6` (CardContent auto-adds `pt-6`)
- **Compact:** `p-4`
- **Dense:** `p-3` (rare)
- **Avoid mixed paddings** on same page

### Card Styling Rules

- ❌ **No colored left/right borders** (`border-l-4 border-l-primary`)
- ❌ **No hover elevation** (`hover:shadow-lg`, `hover:shadow-md`)
- ✅ **Low static elevation** (`shadow-sm` to none)
- ✅ **Prefer separators** (`border-b`) over colored borders

### Common Mistakes

❌ **Don't:**
- Add `border-l-4` colored borders
- Add `hover:shadow-*` transitions
- Mix padding sizes (`p-4` and `p-6` on same level)
- Use `CardTitle` without explicit size

✅ **Do:**
- Use `CardTitle className="text-base font-semibold"`
- Keep elevation minimal (`shadow-sm` or none)
- Use consistent padding
- Prefer separators for grouping

---

## Overflow Handling

### Horizontal Scroll Pattern

```tsx
<div className="overflow-x-auto -mx-1 px-1">
  {/* Wide content: tables, kanban, pill groups */}
</div>
```

### When to Apply

- ✅ Pipeline/kanban lanes
- ✅ Wide data tables
- ✅ Horizontal chip collections
- ✅ Tab navigation
- ✅ Long lists of pills/filters

### Grid Column Width Control

```tsx
// Prevent unintended widening
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="min-w-0"> {/* Add min-w-0 to columns */}
    {/* Content */}
  </div>
</div>
```

### Examples

```tsx
// Pipeline/Kanban
<div className="overflow-x-auto -mx-1 px-1">
  <div className="flex gap-4 min-w-max">
    <KanbanColumn />
    <KanbanColumn />
  </div>
</div>

// Tables
<div className="overflow-x-auto -mx-1 px-1">
  <Table>
    {/* Wide table content */}
  </Table>
</div>
```

---

## Shadows, Elevation, and Borders

### Shadow Guidelines

- **Dashboard cards:** `shadow-sm` to none
- **Action bars:** `shadow-sm`
- **Dropdowns/modals:** Use component defaults
- ❌ **Never** use hover elevation on dashboard cards

### Border Guidelines

- ❌ **No colored left/right borders** on cards
- ❌ **No colored borders** on tables
- ✅ **Neutral borders** for card containers
- ✅ **Separators** (`border-b`, `Separator` component) for grouping

### Table Row Styling

```tsx
// Optional subtle hover
<tr className="hover:bg-muted/50">
  {/* No hover elevation */}
</tr>
```

### Common Mistakes

❌ **Don't:**
- Use `hover:shadow-lg` on cards
- Add `border-l-4` colored borders
- Use `transition-shadow` on stat cards

✅ **Do:**
- Use `shadow-sm` or none
- Prefer separators
- Keep surfaces calm and static

---

## Spacing and Padding

### Page Layout Padding

```tsx
<DashboardPageLayout>
  <div className="p-6 space-y-6">
    {/* Page content */}
  </div>
</DashboardPageLayout>
```

- **Standard:** `p-6 space-y-6` (reduced from `p-12` for better space utilization)
- **Dense pages:** `p-4 space-y-4` (rare)
- ❌ **Never use** `p-12` or larger padding - wastes screen space

### Component Spacing

- **Card padding:** `p-4` (default, reduced from `p-6` for compactness)
- **Gap between cards:** `gap-4` or `gap-6`
- **Icon spacing:** `gap-2` or `gap-1.5`
- **Stat card internal spacing:**
  - Icon/badge to title: `mb-2`
  - Title to value: `mb-1`

### Grid Spacing

```tsx
// KPI sections
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

// Content grids
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

// Quick action grids (7 items)
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
```

---

## Icons

### Standard Sizes

| Context | Size | Class |
|---------|------|-------|
| Page headers | `h-4 w-4` | Small buttons |
| Stat card icons | `h-5 w-5` | Inside `w-10 h-10` chip |
| Tab icons | `h-3.5 w-3.5` | In tabs |
| Badge icons | `h-3 w-3` | In badges/pills |
| Section icons | `h-4 w-4` | Card headers |

### Icon Usage

```tsx
// Stat cards
<EnhancedStatCard
  icon={<FileText className="h-5 w-5" />}
/>

// Tabs
<TabsTrigger>
  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
  Label
</TabsTrigger>

// Badges
<Badge>
  <CheckCircle className="h-3 w-3 mr-1" />
  Status
</Badge>
```

### Icon Chips (Stat Cards)

```tsx
// Fixed size: w-10 h-10
<div className="rounded-full w-10 h-10 flex items-center justify-center">
  <Icon className="h-5 w-5" />
</div>
```

---

## Dark Mode

### Logo Handling

```tsx
// In AppSidebar or header
<img 
  src={logoLight} 
  alt="HRM8" 
  className="h-8 block dark:hidden"
  style={{ filter: 'brightness(0) saturate(100%) invert(...)' }}
/>
<img 
  src={logoDark} 
  alt="HRM8" 
  className="h-8 hidden dark:block opacity-100"
  style={{ filter: 'brightness(0) saturate(100%) invert(1)' }}
/>
```

### Color Usage

- Use CSS variables from `src/index.css`
- Use opacity modifiers (`bg-muted/40`, `text-success/10`)
- Test all components in both light and dark modes

### Background Colors

```tsx
// Muted backgrounds
className="bg-muted/40"

// Soft semantic backgrounds
className="bg-success/10 border-success/20"
className="bg-warning/10 border-warning/20"
```

---

## Responsive Design

### Breakpoints

- **Mobile:** Default (< 768px)
- **Tablet:** `md:` (≥ 768px)
- **Desktop:** `lg:` (≥ 1024px)

### Grid Patterns

```tsx
// KPI cards
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

// Content grids
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

// Tabs
<div className="overflow-x-auto -mx-1 px-1">
  {/* Horizontal scroll on mobile */}
</div>
```

### Mobile Considerations

- Always wrap wide content with overflow container
- Use `whitespace-nowrap` for tabs/pills
- Ensure touch targets are at least 44px
- Test horizontal scrolling on mobile

---

## Accessibility

### Contrast

- Ensure text contrast meets WCAG AA standards
- Test badge/pill colors on muted backgrounds
- Verify dark mode contrast

### Focus States

- Preserve default focus rings
- Don't remove `outline-none` without custom focus styles
- Ensure all interactive elements are keyboard accessible

### ARIA Labels

```tsx
<Button aria-label="Edit profile">
  <Edit className="h-4 w-4" />
</Button>
```

---

## Common Patterns

### Detail Pages

```tsx
<DashboardPageLayout>
  <div className="p-6 space-y-6">
    <AtsPageHeader
      title="Item Name"
      subtitle="Additional context • Metadata"
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Badge variant="outline" className="h-6 px-2 text-xs">
          Status
        </Badge>
        <Button size="sm">Action</Button>
      </div>
    </AtsPageHeader>
    
    {/* Quick stats or summary */}
    <Card>
      {/* Stats */}
    </Card>
    
    {/* Main content tabs */}
    <Tabs>
      {/* Tabs */}
    </Tabs>
  </div>
</DashboardPageLayout>
```

### List Pages with Filters

```tsx
<DashboardPageLayout>
  <div className="p-6 space-y-6">
    <AtsPageHeader title="Items" subtitle="Manage and view items">
      <PillGroup>
        <Button variant="outline" size="sm">Filter 1</Button>
        <Button variant="outline" size="sm">Filter 2</Button>
      </PillGroup>
      <Button size="sm">Add New</Button>
    </AtsPageHeader>
    
    <Card>
      {/* List content */}
    </Card>
  </div>
</DashboardPageLayout>
```

### Dashboard Pages

```tsx
<DashboardPageLayout>
  <div className="p-6 space-y-6">
    <AtsPageHeader title="Dashboard" subtitle="Overview and metrics" />
    
    {/* Stats grid */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <EnhancedStatCard key={stat.id} {...stat} />
      ))}
    </div>
    
    {/* Content sections */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        {/* Section */}
      </Card>
    </div>
  </div>
</DashboardPageLayout>
```

---

## Quick Checklist

Before submitting a page/component, verify:

### Page Structure
- [ ] Uses `AtsPageHeader` (not manual h1)
- [ ] Doesn't set `DashboardPageLayout` title prop if using `AtsPageHeader`
- [ ] Page padding: `p-6 space-y-6`

### Stat Cards
- [ ] Uses `EnhancedStatCard` component
- [ ] Doesn't set `showBorder` or `elevation` props (uses defaults)
- [ ] Icons are `h-5 w-5` inside `w-10 h-10` chip

### Typography
- [ ] CardTitle has `className="text-base font-semibold"`
- [ ] No headings larger than `text-base` for sections
- [ ] Metadata uses `text-xs text-muted-foreground`

### Pills/Badges
- [ ] Uses `variant="outline"`
- [ ] Size: `h-7` (or `h-6` dense) with `text-xs`
- [ ] Shape: `rounded-full`
- [ ] No hover color changes
- [ ] Soft backgrounds for semantic colors

### Navigation Tabs
- [ ] Wrapped in `overflow-x-auto -mx-1 px-1`
- [ ] Uses `inline-flex` layout (not grid)
- [ ] TabsTrigger: `h-7 px-3 rounded-full text-xs`

### Cards
- [ ] No colored left/right borders (`border-l-4`)
- [ ] No hover elevation (`hover:shadow-*`)
- [ ] Consistent padding (`p-4` to `p-6`)
- [ ] Uses `shadow-sm` or none

### Overflow
- [ ] Wide sections wrapped with `overflow-x-auto -mx-1 px-1`
- [ ] Grid columns have `min-w-0` where needed

### Dark Mode
- [ ] Logo visible in both modes
- [ ] Colors use opacity modifiers
- [ ] Tested in both themes

### Responsive
- [ ] Mobile-friendly horizontal scrolling
- [ ] Grid breakpoints appropriate
- [ ] Touch targets adequate size

---

## Component Reference

### Core Components

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `AtsPageHeader` | `@/components/layouts/AtsPageHeader` | Page headers |
| `EnhancedStatCard` | `@/components/dashboard/EnhancedStatCard` | KPI/metrics |
| `PillGroup` | `@/components/ui/pills/PillGroup` | Pill containers |
| `DashboardPageLayout` | `@/components/layouts/DashboardPageLayout` | Page wrapper |

---

## Do Not (Preserve Functionality)

❌ **Never:**
- Change component props, data fetching, or event handlers when restyling
- Alter sorting/filtering logic or selection behavior
- Modify exports/imports, dialogs, and toasts wiring
- Add hover scale/animation to dashboard cards and pills
- Change data structures or API contracts

✅ **Always:**
- Keep functionality identical when updating UI
- Test all interactions after styling changes
- Verify data flow remains unchanged

---

## Charts and Data Visualization

### Component: `StandardChartCard`

**Use `StandardChartCard` as a wrapper for all dashboard charts.**

#### Default Pattern

```tsx
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { ResponsiveContainer, LineChart, BarChart, PieChart } from "recharts";

<StandardChartCard
  title="Chart Title"
  description="Chart description"
  onDownload={() => handleDownload()}
  className="bg-transparent border-0 shadow-none"
  menuItems={[
    { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
    { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
  ]}
>
  <ResponsiveContainer width="100%" height={300}>
    {/* Chart component */}
  </ResponsiveContainer>
</StandardChartCard>
```

#### Chart Card Styling

- **Background:** `bg-transparent border-0 shadow-none` (seamless with page)
- **Height:** `300px` for chart area (consistent across all charts)
- **Margins:** `margin={{ top: 10, right: 10, left: -20, bottom: 0 }}`

### Line Charts

**Use for trends and time-series data.**

```tsx
<LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
  <XAxis 
    dataKey="month" 
    axisLine={false} 
    tickLine={false} 
    tick={{ fontSize: 12 }} 
    dy={10}
  />
  <YAxis 
    axisLine={false} 
    tickLine={false} 
    tick={{ fontSize: 12 }} 
  />
  <Tooltip cursor={false} />
  <Legend wrapperStyle={{ paddingTop: '20px' }} />
  <Line 
    type="monotone" 
    dataKey="value" 
    stroke="#10b981" 
    strokeWidth={3} 
    dot={false} 
    activeDot={false} 
  />
</LineChart>
```

#### Line Chart Specifications

- **Grid:** No `CartesianGrid` (clean background)
- **Axes:**
  - No axis lines (`axisLine={false}`)
  - No tick marks (`tickLine={false}`)
  - Small font size (`fontSize: 12`)
  - X-axis offset: `dy={10}`
- **Lines:**
  - Type: `monotone` (smooth curves)
  - Width: `strokeWidth={3}` (bold, visible)
  - No dots: `dot={false}`
  - No active dots: `activeDot={false}`
- **Tooltip:**
  - No cursor line: `cursor={false}`
- **Legend:**
  - Padding top: `paddingTop: '20px'`

#### Line Chart Colors

- **Primary:** `#10b981` (Emerald)
- **Secondary:** `#3b82f6` (Blue)
- **Tertiary:** `#8b5cf6` (Violet)
- **Additional:** `#f59e0b` (Amber), `#ec4899` (Pink)

### Bar Charts

**Use for comparisons and categorical data.**

```tsx
<BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
  <XAxis 
    dataKey="category" 
    axisLine={false} 
    tickLine={false} 
    tick={{ fontSize: 12 }} 
    dy={10}
  />
  <YAxis 
    axisLine={false} 
    tickLine={false} 
    tick={{ fontSize: 12 }} 
  />
  <Tooltip cursor={{ fill: 'transparent' }} />
  <Legend wrapperStyle={{ paddingTop: '20px' }} />
  <Bar 
    dataKey="value" 
    fill="#8b5cf6" 
    name="Label" 
    radius={[4, 4, 0, 0]} 
    barSize={20} 
  />
</BarChart>
```

#### Bar Chart Specifications

- **Grid:** No `CartesianGrid` (clean background)
- **Axes:** Same as line charts
- **Bars:**
  - Rounded tops: `radius={[4, 4, 0, 0]}`
  - Standard width: `barSize={20}` (thin bars)
  - Wider bars: `barSize={40}` (for fewer categories)
- **Tooltip:**
  - Transparent cursor: `cursor={{ fill: 'transparent' }}`

#### Bar Chart Colors

- **Single series:** `#8b5cf6` (Violet)
- **Dual series:** `#8b5cf6` (Violet) + `#38bdf8` (Sky Blue)
- **Multiple series:** Use line chart color palette

### Pie/Donut Charts

**Use for proportional data and distributions.**

```tsx
<PieChart>
  <Pie
    data={data}
    cx="50%"
    cy="50%"
    innerRadius={80}
    outerRadius={120}
    labelLine={false}
    label={false}
    fill="#8884d8"
    dataKey="count"
    strokeWidth={0}
  >
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

#### Donut Chart Specifications

- **Inner radius:** `80` (creates donut hole)
- **Outer radius:** `120` (ring thickness)
- **Labels:** `label={false}` (no inline labels)
- **Label lines:** `labelLine={false}`
- **Stroke:** `strokeWidth={0}` (no borders between segments)
- **Legend:** Always include for identification

#### Donut Chart Colors

Use distinct, accessible colors for each segment:
- `#3b82f6` (Blue)
- `#10b981` (Emerald)
- `#f59e0b` (Amber)
- `#8b5cf6` (Violet)
- `#ec4899` (Pink)
- `#6366f1` (Indigo)

### Common Chart Styling Rules

#### ❌ Don't:
- Add `CartesianGrid` (creates visual clutter)
- Use axis lines or tick marks
- Show dots on line charts
- Add hover cursor lines
- Use default chart backgrounds
- Mix different styling patterns

#### ✅ Do:
- Use transparent, borderless card backgrounds
- Remove all grid lines for clean appearance
- Use smooth, bold lines (`strokeWidth={3}`)
- Disable dots and active dots on lines
- Use rounded bar tops (`radius={[4, 4, 0, 0]}`)
- Keep consistent axis styling across all charts
- Use consistent color palette
- Include legends for multi-series charts

### Chart Layout Grid

```tsx
{/* Charts section */}
<div className="grid gap-4 md:grid-cols-2">
  <StandardChartCard>{/* Chart 1 */}</StandardChartCard>
  <StandardChartCard>{/* Chart 2 */}</StandardChartCard>
  <StandardChartCard>{/* Chart 3 */}</StandardChartCard>
  <StandardChartCard>{/* Chart 4 */}</StandardChartCard>
</div>
```

- **Grid:** `grid gap-4 md:grid-cols-2`
- **Responsive:** Single column on mobile, 2 columns on tablet+
- **Spacing:** `gap-4` between charts

### Accessibility

- **Color contrast:** Ensure chart colors meet WCAG AA standards
- **Tooltips:** Always include for data point details
- **Legends:** Required for multi-series charts
- **Font size:** Minimum `12px` for axis labels

---

## Examples Reference

Pages updated using these rules:
- Home, Applications, Interviews, AI Interviews
- Assessments, Assessment Detail
- Background Checks, Background Check Detail
- Jobs, Job Detail
- Requisitions, Requisition Detail
- Company Profile, Employer Detail
- Enhanced Learning, Notification Preferences
- All dashboard pages

---

## Questions or Issues?

If you encounter UI inconsistencies or have questions about these rules:
1. Check this guide first
2. Look at similar existing pages for patterns
3. Refer to component source code for defaults
4. Test in both light and dark modes

---

**Remember:** Consistency is key. When in doubt, follow the patterns established in this guide and existing pages that follow these rules.