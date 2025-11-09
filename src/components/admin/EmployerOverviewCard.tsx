import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, Users } from 'lucide-react';
import { SubscriptionMetrics } from '@/types/platformAdmin';

interface EmployerOverviewCardProps {
  metrics: SubscriptionMetrics;
}

export function EmployerOverviewCard({ metrics }: EmployerOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Employer Overview
        </CardTitle>
        <CardDescription>Subscription metrics and growth</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Starter</p>
            <p className="text-2xl font-bold">{metrics.byTier.starter}</p>
            <p className="text-xs text-muted-foreground">
              {Math.round((metrics.byTier.starter / metrics.totalSubscriptions) * 100)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Professional</p>
            <p className="text-2xl font-bold">{metrics.byTier.professional}</p>
            <p className="text-xs text-muted-foreground">
              {Math.round((metrics.byTier.professional / metrics.totalSubscriptions) * 100)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Enterprise</p>
            <p className="text-2xl font-bold">{metrics.byTier.enterprise}</p>
            <p className="text-xs text-muted-foreground">
              {Math.round((metrics.byTier.enterprise / metrics.totalSubscriptions) * 100)}%
            </p>
          </div>
        </div>

        <div className="border-t pt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-sm text-muted-foreground">Upgrades</p>
            </div>
            <p className="text-xl font-bold">{metrics.upgrades}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-muted-foreground">Trial Conversion</p>
            </div>
            <p className="text-xl font-bold">{metrics.trialConversions}%</p>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Churn Rate</span>
            <span className={`text-sm font-medium ${metrics.churnRate < 5 ? 'text-green-600' : 'text-orange-600'}`}>
              {metrics.churnRate}%
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Downgrades</span>
            <span className="text-sm font-medium">{metrics.downgrades}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
