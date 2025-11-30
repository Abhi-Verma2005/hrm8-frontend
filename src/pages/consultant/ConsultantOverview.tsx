/**
 * Consultant Overview Dashboard
 * Main overview page for consultants
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService } from '@/lib/consultant/consultantService';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { Briefcase, Users, DollarSign, TrendingUp, Eye, Download, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConsultantOverview() {
  const { consultant } = useConsultantAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleExport = () => {
    toast({
      title: "Exporting consultant data...",
      description: "Preparing your export..."
    });
  };

  if (loading) {
    return (
      <DashboardPageLayout
        title="Consultant Dashboard"
        subtitle="Loading..."
      >
        <div className="space-y-6" />
      </DashboardPageLayout>
    );
  }

  // Calculate trends (mock for now - would come from API)
  const previousJobCount = Math.max(0, jobCount - 2);
  const jobTrend = jobCount > previousJobCount ? 'up' : 'stable';
  const jobChange = jobCount > previousJobCount 
    ? `+${((jobCount - previousJobCount) / Math.max(1, previousJobCount) * 100).toFixed(1)}%`
    : 'No change';

  const placementsChange = metrics?.totalPlacements > 0 ? '+5.2%' : '0%';
  const commissionsChange = metrics?.pendingCommissions > 0 ? '+12.3%' : '0%';
  const successRateChange = metrics?.successRate > 0 ? '+2.1%' : '0%';

  return (
    <DashboardPageLayout
      title="Consultant Dashboard"
      subtitle={`Welcome back, ${consultant?.firstName}! Here's your overview.`}
    >
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Active Jobs"
            value={jobCount.toString()}
            change={jobChange}
            trend={jobTrend}
            icon={<Briefcase className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              { label: "View All Jobs", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/consultant/jobs') },
              { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Total Placements"
            value={(metrics?.totalPlacements || 0).toString()}
            change={placementsChange}
            trend="up"
            icon={<Users className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Pending Commissions"
            value=""
            rawValue={metrics?.pendingCommissions || 0}
            isCurrency={true}
            change={commissionsChange}
            trend="up"
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              { label: "View Commissions", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/consultant/commissions') },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Success Rate"
            value={metrics?.successRate ? `${metrics.successRate.toFixed(1)}%` : '0%'}
            change={successRateChange}
            trend="up"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              { label: "View Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <EnhancedStatCard
            title="Total Revenue"
            value=""
            rawValue={metrics?.totalRevenue || 0}
            isCurrency={true}
            change="All time"
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
            size="default"
          />

          <EnhancedStatCard
            title="Total Commissions Paid"
            value=""
            rawValue={metrics?.totalCommissionsPaid || 0}
            isCurrency={true}
            change="All time"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
            size="default"
          />

          <EnhancedStatCard
            title="Average Days to Fill"
            value={metrics?.averageDaysToFill ? `${metrics.averageDaysToFill.toFixed(1)} days` : 'N/A'}
            change="Average"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="neutral"
            size="default"
          />
        </div>
      </div>
    </DashboardPageLayout>
  );
}
