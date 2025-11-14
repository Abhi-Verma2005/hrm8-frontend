# Sidebar Performance Monitoring

The sidebar is now instrumented with React Profiler to track rendering performance and identify bottlenecks.

## Features

- **Automatic monitoring** in development mode
- **Slow render warnings** for any render > 16ms (60fps threshold)
- **Performance metrics** tracking for each section
- **Console utilities** for debugging

## How It Works

Each sidebar section is wrapped in a `PerformanceMonitor` component that tracks:
- Total number of renders
- Average render duration
- Slowest render duration
- Most recent render duration

## Console Output

### Milestone Logs
Every 1st and 10th render, you'll see metrics like:
```
📊 Performance metrics for ATSSection:
  Total renders: 10
  Avg duration: 5.23ms
  Slowest: 18.45ms
  Latest: 4.12ms
```

### Slow Render Warnings
Any render taking > 16ms will trigger a warning:
```
⚠️ Slow render detected in SalesSection:
  Phase: update
  Duration: 23.45ms
  Base: 18.20ms
  Render #5
```

## Console Utilities

Open your browser console and use these utilities:

### Get All Metrics
```javascript
window.getSidebarMetrics()
// Returns object with metrics for all sections
```

### Get Specific Section Metrics
```javascript
window.getSidebarMetrics('ATSSection')
// Returns metrics for ATS section only
```

### Clear Metrics
```javascript
window.clearSidebarMetrics()
// Resets all performance tracking
```

## Interpreting Results

### Good Performance
- Average render time < 10ms
- No slow render warnings
- Consistent render times

### Performance Issues
- Average render time > 16ms
- Frequent slow render warnings
- Increasing render times

### Common Causes of Slow Renders

1. **Too many menu items** - Consider virtualization
2. **Complex icon components** - Use simpler icons or lazy load
3. **Expensive computations** - Memoize with useMemo/useCallback
4. **Large state objects** - Break into smaller pieces
5. **Unnecessary re-renders** - Check parent component updates

## Optimization Tips

1. **Memoization** - Already implemented for:
   - `isActive` function
   - Module access checks
   - Recent records formatting
   - Event handlers

2. **Code Splitting** - Sections are lazy loaded:
   - Only loaded when needed
   - Reduces initial bundle size
   - Improves time-to-interactive

3. **Virtual Scrolling** - For sections with 20+ items:
   - Render only visible items
   - Dramatically reduces DOM nodes
   - See: react-window or react-virtualized

## Disabling Monitoring

Performance monitoring is automatically disabled in production builds. No code changes needed.

To disable in development, set `enabled={false}`:

```tsx
<PerformanceMonitor id="MySection" enabled={false}>
  <MySection />
</PerformanceMonitor>
```

## Performance Budget

Target metrics for 60fps (16.67ms per frame):

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Average render | < 5ms | 5-10ms | > 10ms |
| Slowest render | < 16ms | 16-30ms | > 30ms |
| Total renders | < 50 | 50-100 | > 100 |

## Next Steps

If you see performance issues:

1. **Identify the slow section** - Check console warnings
2. **Measure the baseline** - Get metrics before changes
3. **Apply optimizations** - Use memoization, virtualization, etc.
4. **Measure again** - Verify improvements
5. **Iterate** - Repeat until performance is acceptable
