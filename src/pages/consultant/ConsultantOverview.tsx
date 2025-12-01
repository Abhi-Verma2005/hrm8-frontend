/**
 * Consultant Overview Dashboard
 * Main overview page for consultants
 */

import { useState, useEffect } from 'react';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService } from '@/lib/consultant/consultantService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { ConsultantPageLayout } from '@/components/layouts/ConsultantPageLayout';
import { Briefcase, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function ConsultantOverview() {
  const { consultant } = useConsultantAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load performance metrics
      const metricsResponse = await consultantService.getPerformance();
      if (metricsResponse.success && metricsResponse.data?.metrics) {
        setMetrics(metricsResponse.data.metrics);
      }

      // Load job count
      const jobsResponse = await consultantService.getJobs();
      if (jobsResponse.success && jobsResponse.data?.jobIds) {
        setJobCount(jobsResponse.data.jobIds.length);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ConsultantPageLayout
        title="Consultant Dashboard"
        subtitle="Loading..."
      >
        <div className="p-6" />
      </ConsultantPageLayout>
    );
  }

  return (
    <ConsultantPageLayout
      title="Consultant Dashboard"
      subtitle={`Welcome back, ${consultant?.firstName}! Here's your overview.`}
    >
      <div className="p-6 space-y-6">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatCard
          title="Active Jobs"
          value={jobCount.toString()}
          icon={<Briefcase className="h-6 w-6" />}
          variant="primary"
        />

        <EnhancedStatCard
          title="Total Placements"
          value={(metrics?.totalPlacements || 0).toString()}
          icon={<Users className="h-6 w-6" />}
          variant="success"
        />

        <EnhancedStatCard
          title="Pending Commissions"
          value=""
          isCurrency={true}
          rawValue={metrics?.pendingCommissions || 0}
          icon={<DollarSign className="h-6 w-6" />}
          variant="warning"
        />

        <EnhancedStatCard
          title="Success Rate"
          value={metrics?.successRate ? `${metrics.successRate.toFixed(1)}%` : '0%'}
          icon={<TrendingUp className="h-6 w-6" />}
          variant="primary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${(metrics?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Commissions Paid</p>
              <p className="text-2xl font-bold">
                ${(metrics?.totalCommissionsPaid || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Days to Fill</p>
              <p className="text-2xl font-bold">
                {metrics?.averageDaysToFill ? `${metrics.averageDaysToFill.toFixed(1)} days` : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </ConsultantPageLayout>
  );
}
