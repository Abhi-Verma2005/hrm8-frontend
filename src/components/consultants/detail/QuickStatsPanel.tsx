import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, Award, Clock } from 'lucide-react';
import type { Consultant } from '@/types/consultant';
import type { ConsultantMetrics } from '@/lib/consultantService';

interface QuickStatsPanelProps {
  consultant: Consultant;
  metrics: ConsultantMetrics;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`text-xs font-medium flex items-center gap-1 ${
            trend.positive ? 'text-success' : 'text-destructive'
          }`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function QuickStatsPanel({ consultant, metrics }: QuickStatsPanelProps) {
  // Calculate quarterly stats (simplified for now)
  const quarterlyPlacements = Math.floor(metrics.currentMonthPlacements * 3);
  const quarterlyRevenue = Math.floor(metrics.currentMonthRevenue * 3);
  
  // Calculate workload percentage
  const workloadPercentage = Math.round(
    ((consultant.currentJobs + consultant.currentEmployers) / 
     (consultant.maxJobs + consultant.maxEmployers)) * 100
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">Quick Stats</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="This Month"
          value={metrics.currentMonthPlacements}
          subtitle={`$${metrics.currentMonthRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Revenue`}
          icon={<Award className="h-5 w-5 text-primary" />}
          trend={{ value: '12% vs last month', positive: true }}
        />
        
        <StatCard
          title="This Quarter"
          value={quarterlyPlacements}
          subtitle={`$${quarterlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Revenue`}
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          trend={{ value: '8% vs last quarter', positive: true }}
        />
        
        <StatCard
          title="Current Workload"
          value={`${workloadPercentage}%`}
          subtitle={`${consultant.currentJobs}/${consultant.maxJobs} Jobs, ${consultant.currentEmployers}/${consultant.maxEmployers} Employers`}
          icon={<Clock className="h-5 w-5 text-primary" />}
        />
        
        <StatCard
          title="Commission"
          value={`$${metrics.pendingCommissions.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle={`$${metrics.lifetimeCommissions.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Paid YTD`}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
}
