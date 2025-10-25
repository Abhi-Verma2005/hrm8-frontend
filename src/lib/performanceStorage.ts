import type {
  PerformanceMetrics,
  PlacementRecord,
  PerformanceTarget,
  LeaderboardEntry,
} from '@/types/performance';

const METRICS_KEY = 'performance_metrics';
const PLACEMENTS_KEY = 'placement_records';
const TARGETS_KEY = 'performance_targets';

// Performance Metrics
export function getPerformanceMetrics(
  consultantId: string,
  period: PerformanceMetrics['period']
): PerformanceMetrics | undefined {
  const stored = localStorage.getItem(METRICS_KEY);
  const all: PerformanceMetrics[] = stored ? JSON.parse(stored) : [];
  return all.find(m => m.consultantId === consultantId && m.period === period);
}

export function savePerformanceMetrics(metrics: PerformanceMetrics): void {
  const stored = localStorage.getItem(METRICS_KEY);
  const all: PerformanceMetrics[] = stored ? JSON.parse(stored) : [];
  
  const index = all.findIndex(
    m => m.consultantId === metrics.consultantId && m.period === metrics.period
  );
  
  if (index === -1) {
    all.push(metrics);
  } else {
    all[index] = metrics;
  }
  
  localStorage.setItem(METRICS_KEY, JSON.stringify(all));
}

// Placement Records
export function getPlacementRecords(consultantId: string): PlacementRecord[] {
  const stored = localStorage.getItem(PLACEMENTS_KEY);
  const all: PlacementRecord[] = stored ? JSON.parse(stored) : [];
  return all
    .filter(p => p.consultantId === consultantId)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export function addPlacementRecord(
  placement: Omit<PlacementRecord, 'id' | 'createdAt' | 'updatedAt'>
): PlacementRecord {
  const stored = localStorage.getItem(PLACEMENTS_KEY);
  const all: PlacementRecord[] = stored ? JSON.parse(stored) : [];
  
  const newPlacement: PlacementRecord = {
    ...placement,
    id: `placement_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  all.push(newPlacement);
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(all));
  
  return newPlacement;
}

export function updatePlacementRecord(
  id: string,
  updates: Partial<PlacementRecord>
): PlacementRecord | null {
  const stored = localStorage.getItem(PLACEMENTS_KEY);
  const all: PlacementRecord[] = stored ? JSON.parse(stored) : [];
  const index = all.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  all[index] = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(all));
  return all[index];
}

// Performance Targets
export function getPerformanceTargets(consultantId: string): PerformanceTarget[] {
  const stored = localStorage.getItem(TARGETS_KEY);
  const all: PerformanceTarget[] = stored ? JSON.parse(stored) : [];
  return all.filter(t => t.consultantId === consultantId);
}

export function getCurrentTarget(consultantId: string): PerformanceTarget | undefined {
  const targets = getPerformanceTargets(consultantId);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  return targets.find(
    t => t.year === currentYear && 
         t.period === 'monthly' && 
         t.month === currentMonth
  );
}

export function addPerformanceTarget(
  target: Omit<PerformanceTarget, 'id' | 'createdAt' | 'updatedAt'>
): PerformanceTarget {
  const stored = localStorage.getItem(TARGETS_KEY);
  const all: PerformanceTarget[] = stored ? JSON.parse(stored) : [];
  
  const newTarget: PerformanceTarget = {
    ...target,
    id: `target_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  all.push(newTarget);
  localStorage.setItem(TARGETS_KEY, JSON.stringify(all));
  
  return newTarget;
}

export function updatePerformanceTarget(
  id: string,
  updates: Partial<PerformanceTarget>
): PerformanceTarget | null {
  const stored = localStorage.getItem(TARGETS_KEY);
  const all: PerformanceTarget[] = stored ? JSON.parse(stored) : [];
  const index = all.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  all[index] = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(TARGETS_KEY, JSON.stringify(all));
  return all[index];
}

// Leaderboard
export function getLeaderboard(
  metricType: LeaderboardEntry['metricType'],
  limit: number = 10
): LeaderboardEntry[] {
  // This would calculate from actual data - simplified for now
  return [];
}

// Mock data generators for charts
export function getMonthlyPlacementTrends(consultantId: string, months: number = 12) {
  const data = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    data.push({
      month: `${monthName} ${year}`,
      placements: Math.floor(Math.random() * 15) + 5,
      target: 12,
    });
  }
  
  return data;
}

export function getMonthlyRevenueTrends(consultantId: string, months: number = 12) {
  const data = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    data.push({
      month: `${monthName} ${year}`,
      revenue: Math.floor(Math.random() * 80000) + 40000,
      target: 60000,
    });
  }
  
  return data;
}

export function getPerformanceBreakdown(consultantId: string) {
  return [
    { name: 'Tech', value: 45, count: 28 },
    { name: 'Finance', value: 25, count: 15 },
    { name: 'Healthcare', value: 18, count: 11 },
    { name: 'Sales', value: 12, count: 7 },
  ];
}
