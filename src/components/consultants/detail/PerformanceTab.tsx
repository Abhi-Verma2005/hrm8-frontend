import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Target, Clock, Users, Star } from 'lucide-react';
import { PerformanceTrendsChart } from './charts/PerformanceTrendsChart';
import { RevenueTrendsChart } from './charts/RevenueTrendsChart';
import { PerformanceBreakdownChart } from './charts/PerformanceBreakdownChart';
import { GoalsSection } from './performance/GoalsSection';
import { RecentReviewsSection } from './performance/RecentReviewsSection';
import { SkillsSection } from './performance/SkillsSection';

interface PerformanceTabProps {
  consultantId: string;
}

export function PerformanceTab({ consultantId }: PerformanceTabProps) {
  // Mock data - would come from performanceStorage
  const metrics = {
    monthlyPlacements: 12,
    monthlyRevenue: 68000,
    avgDaysToFill: 32,
    successRate: 78,
    clientSatisfaction: 4.7,
    candidateSatisfaction: 4.5,
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Placements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.monthlyPlacements}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Days to Fill</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgDaysToFill}</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate}%</div>
            <p className="text-xs text-muted-foreground">Placement rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.clientSatisfaction}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidate Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.candidateSatisfaction}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals & Objectives */}
      <GoalsSection consultantId={consultantId} />

      {/* Reviews & Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentReviewsSection consultantId={consultantId} />
        <SkillsSection consultantId={consultantId} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <PerformanceTrendsChart consultantId={consultantId} />
        <RevenueTrendsChart consultantId={consultantId} />
      </div>

      <PerformanceBreakdownChart consultantId={consultantId} />
    </div>
  );
}
