/**
 * HRM8 Overview Dashboard
 * Main overview page for HRM8 Global Admin and Regional Licensees
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { regionService } from '@/lib/hrm8/regionService';
import { consultantManagementService } from '@/lib/hrm8/consultantManagementService';
import { jobService } from '@/lib/api/jobService';
import { revenueService } from '@/lib/hrm8/revenueService';
import { MapPin, Users, Briefcase, DollarSign, Eye, Download, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Hrm8Overview() {
  const { hrm8User } = useHrm8Auth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';
  
  const [loading, setLoading] = useState(true);
  const [regionsCount, setRegionsCount] = useState(0);
  const [consultantsCount, setConsultantsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('[HRM8 Overview] Starting to load dashboard data...');
      
      // Load all data in parallel with individual error handling
      const results = await Promise.allSettled([
        (async () => {
          console.log('[HRM8 Overview] Fetching regions...');
          const res = await regionService.getAll({ isActive: true });
          console.log('[HRM8 Overview] Regions response:', { success: res.success, error: res.error, count: res.data?.regions?.length });
          return res;
        })(),
        (async () => {
          console.log('[HRM8 Overview] Fetching consultants...');
          const res = await consultantManagementService.getAll({ status: 'ACTIVE' });
          console.log('[HRM8 Overview] Consultants response:', { success: res.success, error: res.error, count: res.data?.consultants?.length });
          return res;
        })(),
        (async () => {
          console.log('[HRM8 Overview] Fetching jobs...');
          try {
            // Note: /api/jobs is company-scoped, HRM8 admin may not have companyId
            // This might fail for HRM8 users, so we'll handle it gracefully
            const res = await jobService.getJobs();
            console.log('[HRM8 Overview] Jobs response:', { 
              success: res.success, 
              error: res.error, 
              dataType: typeof res.data,
              isArray: Array.isArray(res.data),
              count: Array.isArray(res.data) ? res.data.length : 'not array',
              data: res.data 
            });
            return res;
          } catch (error) {
            console.warn('[HRM8 Overview] Jobs fetch failed (expected for HRM8 admin):', error);
            return { success: false, error: 'Jobs endpoint requires company context', data: [] };
          }
        })(),
        (async () => {
          console.log('[HRM8 Overview] Fetching revenue...');
          const res = await revenueService.getAll();
          console.log('[HRM8 Overview] Revenue response:', { success: res.success, error: res.error, count: res.data?.revenues?.length });
          return res;
        })(),
      ]);

      // Process regions
      if (results[0].status === 'fulfilled') {
        const regionsRes = results[0].value;
        if (regionsRes.success && regionsRes.data?.regions) {
          setRegionsCount(regionsRes.data.regions.length);
          console.log('[HRM8 Overview] Set regions count:', regionsRes.data.regions.length);
        } else {
          console.error('[HRM8 Overview] Regions failed:', regionsRes.error);
        }
      } else {
        console.error('[HRM8 Overview] Regions promise rejected:', results[0].reason);
      }
      
      // Process consultants
      if (results[1].status === 'fulfilled') {
        const consultantsRes = results[1].value;
        if (consultantsRes.success && consultantsRes.data?.consultants) {
          setConsultantsCount(consultantsRes.data.consultants.length);
          console.log('[HRM8 Overview] Set consultants count:', consultantsRes.data.consultants.length);
        } else {
          console.error('[HRM8 Overview] Consultants failed:', consultantsRes.error);
        }
      } else {
        console.error('[HRM8 Overview] Consultants promise rejected:', results[1].reason);
      }
      
      // Process jobs
      if (results[2].status === 'fulfilled') {
        const jobsRes = results[2].value;
        if (jobsRes.success && Array.isArray(jobsRes.data)) {
          setJobsCount(jobsRes.data.length);
          console.log('[HRM8 Overview] Set jobs count:', jobsRes.data.length);
        } else {
          // Jobs endpoint requires company context, which HRM8 admin doesn't have
          // This is expected behavior, not an error
          console.log('[HRM8 Overview] Jobs endpoint not available for HRM8 admin (requires company context)');
          setJobsCount(0);
        }
      } else {
        console.log('[HRM8 Overview] Jobs endpoint not available for HRM8 admin');
        setJobsCount(0);
      }
      
      // Process revenue
      if (results[3].status === 'fulfilled') {
        const revenueRes = results[3].value;
        if (revenueRes.success && revenueRes.data?.revenues) {
          const total = revenueRes.data.revenues.reduce((sum: number, rev: { totalRevenue: number }) => sum + rev.totalRevenue, 0);
          setTotalRevenue(total);
          console.log('[HRM8 Overview] Set revenue total:', total);
        } else {
          console.warn('[HRM8 Overview] Revenue failed:', revenueRes.error);
          setTotalRevenue(0);
        }
      } else {
        console.warn('[HRM8 Overview] Revenue promise rejected:', results[3].reason);
        setTotalRevenue(0);
      }

      // Check if critical data failed to load
      const criticalFailures: string[] = [];
      if (results[0].status === 'rejected' || (results[0].status === 'fulfilled' && !results[0].value.success)) {
        criticalFailures.push('Regions');
      }
      if (results[1].status === 'rejected' || (results[1].status === 'fulfilled' && !results[1].value.success)) {
        criticalFailures.push('Consultants');
      }
      // Jobs and Revenue are optional, so we don't count them as critical failures

      if (criticalFailures.length > 0) {
        console.error('[HRM8 Overview] Critical data failed to load:', criticalFailures);
        toast({
          title: "Error",
          description: `Failed to load: ${criticalFailures.join(', ')}`,
          variant: "destructive"
        });
      } else {
        console.log('[HRM8 Overview] Dashboard data loading completed successfully');
      }
    } catch (error) {
      console.error('[HRM8 Overview] Unexpected error loading dashboard data:', error);
      console.error('[HRM8 Overview] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        title: "Error",
        description: `Failed to load dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Exporting HRM8 data...",
      description: "Preparing your export..."
    });
  };

  // Calculate trends (mock for now - would come from API)
  const regionsChange = regionsCount > 0 ? '+1 new' : '0';
  const consultantsChange = consultantsCount > 0 ? '+5.2%' : '0%';
  const jobsChange = jobsCount > 0 ? '+12.3%' : '0%';
  const revenueChange = totalRevenue > 0 ? '+8.5%' : '0%';

  if (loading) {
    return (
      <DashboardPageLayout
        title="HRM8 Dashboard"
        subtitle={
          isGlobalAdmin
            ? 'Global overview of all regions, licensees, and consultants'
            : 'Regional overview of your assigned regions'
        }
      >
        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      title="HRM8 Dashboard"
      subtitle={
        isGlobalAdmin
          ? 'Global overview of all regions, licensees, and consultants'
          : 'Regional overview of your assigned regions'
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Regions"
            value={regionsCount.toString()}
            change={regionsChange}
            trend={regionsCount > 0 ? 'up' : 'stable'}
            icon={<MapPin className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              { label: "View All Regions", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/hrm8/regions') },
              { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Consultants"
            value={consultantsCount.toString()}
            change={consultantsChange}
            trend="up"
            icon={<Users className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              { label: "View All Consultants", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/hrm8/consultants') },
              { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Active Jobs"
            value={jobsCount.toString()}
            change={jobsChange}
            trend="up"
            icon={<Briefcase className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              { label: "View Job Allocation", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/hrm8/jobs') },
              { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Total Revenue"
            value=""
            rawValue={totalRevenue}
            isCurrency={true}
            change={revenueChange}
            trend="up"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              { label: "View Revenue", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/hrm8/revenue') },
              { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />
        </div>
      </div>
    </DashboardPageLayout>
  );
}

