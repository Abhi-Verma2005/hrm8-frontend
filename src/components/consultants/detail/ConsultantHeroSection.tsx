import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Award, DollarSign, Target, Clock, Briefcase, TrendingUp } from 'lucide-react';
import { PerformanceBadgeCard } from './PerformanceBadgeCard';
import { ConsultantMetricCard } from './ConsultantMetricCard';
import { getConsultantFullName } from '@/lib/consultantUtils';
import type { Consultant } from '@/types/consultant';
import type { ConsultantMetrics } from '@/lib/consultantService';
import { Badge } from '@/components/ui/badge';
import { ConsultantTypeBadge } from '../ConsultantTypeBadge';
import { ConsultantStatusBadge } from '../ConsultantStatusBadge';
import { format } from 'date-fns';

interface ConsultantHeroSectionProps {
  consultant: Consultant;
  metrics: ConsultantMetrics;
}

export function ConsultantHeroSection({ consultant, metrics }: ConsultantHeroSectionProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-muted/50">
      <CardContent className="p-6 lg:p-8 relative">
        {/* Performance Badge - Desktop: Absolute top-right, Mobile: Below avatar */}
        <div className="hidden lg:block absolute top-8 right-8 w-[160px]">
          <PerformanceBadgeCard consultant={consultant} metrics={metrics} />
        </div>

        {/* Top Section: Avatar + Info */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
          {/* Avatar */}
          <div className="w-[100px] h-[100px] rounded-full border-2 border-border bg-background flex items-center justify-center flex-shrink-0">
            {consultant.photo ? (
              <img
                src={consultant.photo}
                alt={getConsultantFullName(consultant)}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="text-3xl font-bold text-muted-foreground">
                {consultant.firstName[0]}{consultant.lastName[0]}
              </div>
            )}
          </div>

          {/* Consultant Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{getConsultantFullName(consultant)}</h1>
            </div>

            <p className="text-lg text-muted-foreground mb-3">{consultant.title || 'Consultant'}</p>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <ConsultantTypeBadge type={consultant.type} />
              <ConsultantStatusBadge status={consultant.status} />
              {consultant.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>Department: {consultant.department || 'Not assigned'}</p>
              <p>Hired {format(new Date(consultant.hireDate), 'MMMM yyyy')} • {Math.floor(metrics.daysEmployed / 365)} years with company</p>
            </div>
          </div>
        </div>

        {/* Mobile: Show performance badge here */}
        <div className="block lg:hidden mb-6 pl-3">
          <PerformanceBadgeCard consultant={consultant} metrics={metrics} />
        </div>

        <Separator className="mb-4" />

        {/* 6 Compact Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <ConsultantMetricCard
            icon={Award}
            value={metrics.totalPlacements}
            label="Placements"
          />
          
          <ConsultantMetricCard
            icon={DollarSign}
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            label="Revenue"
          />
          
          <ConsultantMetricCard
            icon={Target}
            value={`${(metrics.successRate * 100).toFixed(0)}%`}
            label="Success"
          />
          
          <ConsultantMetricCard
            icon={Clock}
            value={`${metrics.averageDaysToFill}d`}
            label="Avg Fill Time"
          />
          
          <ConsultantMetricCard
            icon={Briefcase}
            value={metrics.activeAssignments}
            label="Assignments"
          />
          
          <ConsultantMetricCard
            icon={TrendingUp}
            value={`$${metrics.lifetimeCommissions.toLocaleString()}`}
            label="Commissions"
          />
        </div>
      </CardContent>
    </Card>
  );
}
