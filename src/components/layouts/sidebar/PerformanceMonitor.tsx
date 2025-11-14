import { Profiler, ProfilerOnRenderCallback, ReactNode } from 'react';

interface PerformanceMonitorProps {
  id: string;
  children: ReactNode;
  enabled?: boolean;
}

// Performance metrics storage
const performanceMetrics: Record<string, {
  renderCount: number;
  totalDuration: number;
  avgDuration: number;
  slowestRender: number;
  lastRender: number;
}> = {};

const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  // Only track in development mode
  if (process.env.NODE_ENV !== 'development') return;

  // Initialize metrics if first render
  if (!performanceMetrics[id]) {
    performanceMetrics[id] = {
      renderCount: 0,
      totalDuration: 0,
      avgDuration: 0,
      slowestRender: 0,
      lastRender: 0,
    };
  }

  const metrics = performanceMetrics[id];
  metrics.renderCount++;
  metrics.totalDuration += actualDuration;
  metrics.avgDuration = metrics.totalDuration / metrics.renderCount;
  metrics.slowestRender = Math.max(metrics.slowestRender, actualDuration);
  metrics.lastRender = actualDuration;

  // Log warning for slow renders (> 16ms)
  if (actualDuration > 16) {
    console.warn(
      `⚠️ Slow render detected in ${id}:`,
      `\n  Phase: ${phase}`,
      `\n  Duration: ${actualDuration.toFixed(2)}ms`,
      `\n  Base: ${baseDuration.toFixed(2)}ms`,
      `\n  Render #${metrics.renderCount}`
    );
  }

  // Log milestone renders (reduced frequency)
  const shouldLog = process.env.VITE_PERF_LOGS !== 'false';
  if (shouldLog && (metrics.renderCount === 1 || metrics.renderCount % 25 === 0)) {
    console.log(
      `📊 Performance metrics for ${id}:`,
      `\n  Total renders: ${metrics.renderCount}`,
      `\n  Avg duration: ${metrics.avgDuration.toFixed(2)}ms`,
      `\n  Slowest: ${metrics.slowestRender.toFixed(2)}ms`,
      `\n  Latest: ${metrics.lastRender.toFixed(2)}ms`
    );
  }
};

/**
 * PerformanceMonitor wraps components with React Profiler to track render performance.
 * 
 * Usage:
 * <PerformanceMonitor id="SidebarSection">
 *   <YourComponent />
 * </PerformanceMonitor>
 * 
 * Metrics are logged to console in development mode.
 * Warnings are shown for renders > 16ms (60fps threshold).
 */
export function PerformanceMonitor({ id, children, enabled = true }: PerformanceMonitorProps) {
  // Skip profiling in production or when disabled
  if (process.env.NODE_ENV !== 'development' || !enabled) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}

/**
 * Utility to get current performance metrics
 * Can be called from console: window.getSidebarMetrics()
 */
export function getPerformanceMetrics(id?: string) {
  if (id) {
    return performanceMetrics[id] || null;
  }
  return performanceMetrics;
}

/**
 * Clear all performance metrics
 */
export function clearPerformanceMetrics() {
  Object.keys(performanceMetrics).forEach(key => {
    delete performanceMetrics[key];
  });
  console.log('✅ Performance metrics cleared');
}

// Expose utilities to window in development
if (process.env.NODE_ENV === 'development') {
  (window as any).getSidebarMetrics = getPerformanceMetrics;
  (window as any).clearSidebarMetrics = clearPerformanceMetrics;
}
