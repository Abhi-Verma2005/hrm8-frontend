import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { PlatformStatsGrid } from '@/components/admin/PlatformStatsGrid';
import { ActionItemsCard } from '@/components/admin/ActionItemsCard';
import { PendingServicesList } from '@/components/admin/PendingServicesList';
import { RecentNotificationsList } from '@/components/admin/RecentNotificationsList';
import { EmployerOverviewCard } from '@/components/admin/EmployerOverviewCard';
import { ChurnRiskList } from '@/components/admin/ChurnRiskList';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { UpgradeOpportunitiesCard } from '@/components/admin/UpgradeOpportunitiesCard';
import { getPlatformStats } from '@/lib/mockPlatformStats';
import { getActionItems } from '@/lib/mockActionItems';
import { getPlatformNotifications } from '@/lib/mockPlatformNotifications';
import { getEmployerHealthData } from '@/lib/mockEmployerHealth';
import { getSubscriptionMetrics } from '@/lib/mockSubscriptionMetrics';
import { getUpgradeOpportunities } from '@/lib/mockUpgradeOpportunities';
import { getRevenueData } from '@/lib/mockRevenueData';

export default function Index() {
  // Load all dashboard data
  const stats = useMemo(() => getPlatformStats(), []);
  const actionItems = useMemo(() => getActionItems(), []);
  const notifications = useMemo(() => getPlatformNotifications(), []);
  const atRiskEmployers = useMemo(() => getEmployerHealthData(), []);
  const subscriptionMetrics = useMemo(() => getSubscriptionMetrics(), []);
  const upgradeOpportunities = useMemo(() => getUpgradeOpportunities(), []);
  const revenueData = useMemo(() => getRevenueData(), []);

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>Super Admin Dashboard - Platform Operations</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your HRM8 platform operations</p>
        </div>

        {/* Platform Stats Grid */}
        <PlatformStatsGrid stats={stats} />

        {/* Critical Action Items */}
        <ActionItemsCard items={actionItems} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wider */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <RevenueChart data={revenueData} />

            {/* Employer Overview */}
            <EmployerOverviewCard metrics={subscriptionMetrics} />

            {/* At-Risk Employers */}
            <ChurnRiskList employers={atRiskEmployers} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Pending Services */}
            <PendingServicesList />

            {/* Recent Notifications */}
            <RecentNotificationsList notifications={notifications} />

            {/* Upgrade Opportunities */}
            <UpgradeOpportunitiesCard opportunities={upgradeOpportunities} />
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
