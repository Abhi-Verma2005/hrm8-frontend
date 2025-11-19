# UI Design Rules

These rules standardize page headers, stat cards, tables, badges/pills, timelines, and overflow handling across the app without changing functionality.

## Page Header Pattern
- Use `AtsPageHeader` for top-of-page structure.
- Title and optional subtitle are displayed at the top.
- Action bar (buttons, pill groups, toggles) is passed as `children` and rendered just below the title.
- When using `AtsPageHeader`, do NOT also provide a `title` prop to `DashboardPageLayout` (prevents double headings). Keep `breadcrumbActions` if needed.

Example:

```tsx
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";

<AtsPageHeader title="Page Title" subtitle="Optional subtitle">
  {/* Action bar content */}
  <div className="flex items-center gap-2">
    {/* Buttons, Pills, etc. */}
  </div>
</AtsPageHeader>
```

## Stat Cards (KPI)
- Component: `EnhancedStatCard`.
- Defaults: no colored borders, no hover elevation/scale, subtle icon chip.
- Value sizes: compact `text-xl`, default `text-2xl`, large `text-3xl`.
- Top-right pill uses `Badge variant="outline"` with no hover transitions.
- Header row alignment is consistent: icon on the left (fixed `w-10 h-10` circle), pill on the right (`h-7 text-xs`).
- Avoid per-card custom hover or animation; keep surfaces calm.
- For pages like Home/Applications/Assessments, rely on these defaults (do not set `showBorder` or `elevation`).

## Color Borders & Hover
- Avoid left/right colored borders on cards.
- Avoid hover elevation or scale on dashboard summary cards.

## Pills, Filters, and Badge Tokens
- Pills in stat cards and filter bars should:
  - Use `variant="outline"` or soft backgrounds; no hover color shifts.
  - Maintain `h-7` (or `h-6` on dense pages) with `text-xs` and `rounded-full`.
  - Use subtle borders like `border-success/20`, `border-destructive/20` only for semantic context.
- `PillGroup` containers should keep controls compact and horizontally scrollable: `inline-flex`, `gap-1`, `rounded-full`, muted background, and `overflow-x-auto`.
- Status/Pass-Fail chips in tables should also use outline variant with soft backgrounds and consistent sizing (`h-6 px-2 text-xs`).

## Overflow Handling
- Wrap horizontally large sections in `overflow-x-auto -mx-1 px-1`.
- Ensure columns use `min-w-0` within CSS grid layouts to prevent unintended widening.
- Apply to pipeline/kanban lanes, wide tables, and chip collections.
  - Applied in Applications (Pipeline/List), Interviews (Kanban/Calendar), AI Interviews (List), and Assessments (DataTable).

## Buttons and Toggles
- Button groups (e.g., view toggle) live inside a bordered, rounded container with small gaps.
- Avoid hover scale on buttons within headers.

## Shadows, Elevation, and Borders
- Use low, static elevation on surfaces (`shadow-sm` to none) in dashboards; avoid hover elevation.
- Prefer separators (`border-b`) over colored card borders for grouping.
- Tables and cards should NOT have left/right colored borders.
- Tables and list views: neutral rows, no hover elevation; optional subtle `hover:bg-muted/50` only.
- Kanban/pipeline cards: remove per-stage colored borders; rely on header text and counts.
- Card content typography: titles `text-sm`–`text-base`, metadata `text-xs` muted.

## Sticky and Sidebars
- Use sticky sidebars sparingly for tools/recommendations: `lg:sticky lg:top-6 lg:self-start` with `min-w-0`.

## Alignment and Spacing
- Card padding: `p-4`–`p-6` depending on density; avoid mixed paddings.
- Header rows: `flex items-center justify-between`.
- Icon chips: fixed size, centered (`w-10 h-10` on stats); avoid variable wrappers.
- Timeline items: `pl-12` item inset, dot `w-6 h-6 left-0 top-1.5`, line `left-3 top-7 bottom-0 w-px`, copy uses `leading-5`.

## Responsive
- Use grids like `md:grid-cols-2 lg:grid-cols-4` for KPI sections.
- Wrap horizontally wide sections with `overflow-x-auto -mx-1 px-1` for mobile scroll.

## Accessibility
- Ensure text contrast on soft badges/pills is sufficient.
- Preserve focus rings on interactive elements.

## Reuse
- Apply these patterns on new pages.
- Updated using these rules: Home, Applications, Interviews, AI Interviews, Assessments, Assessment Detail, Timeline.

## Do Not (to preserve functionality)
- Do not change component props, data fetching, or event handlers when restyling.
- Do not alter sorting/filtering logic or selection behavior.
- Keep exports/imports, dialogs, and toasts wired exactly as-is.
- Do not add hover scale/animation to dashboard cards and pills.

## Quick Checklist (per page)
- [ ] Use `AtsPageHeader`; do not also set `DashboardPageLayout` title.
- [ ] KPI cards via `EnhancedStatCard` (no borders/hover; neutral surfaces).
- [ ] Pills/badges are outline, `h-6/7`, `text-xs`, soft backgrounds; no hover color shifts.
- [ ] Remove colored card borders; prefer separators.
- [ ] Add `overflow-x-auto -mx-1 px-1` and `min-w-0` where content can widen.
- [ ] Keep shadows stable (`shadow-sm` to none); no hover elevation.
- [ ] For timelines, verify left inset and marker alignment prevent collisions.
