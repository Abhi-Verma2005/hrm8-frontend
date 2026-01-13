import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { revenueService, RegionalRevenue } from '@/lib/hrm8/revenueService';
import { DataTable } from '@/components/tables/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TableSkeleton } from '@/components/tables/TableSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyRevenueTable } from '@/components/hrm8/CompanyRevenueTable';

const columns = [
  {
    key: 'regionId',
    label: 'Region',
    render: (revenue: RegionalRevenue) => revenue.regionId ? revenue.regionId.substring(0, 8) + '...' : 'Unknown',
  },
  {
    key: 'periodStart',
    label: 'Period',
    render: (revenue: RegionalRevenue) => (
      <span>
        {new Date(revenue.periodStart).toLocaleDateString()} - {new Date(revenue.periodEnd).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    render: (revenue: RegionalRevenue) => (
      <span className="font-semibold">${revenue.totalRevenue.toLocaleString()}</span>
    ),
  },
  {
    key: 'hrm8Share',
    label: 'HRM8 Share',
    render: (revenue: RegionalRevenue) => (
      <span className="text-blue-600 font-medium">${revenue.hrm8Share.toLocaleString()}</span>
    ),
  },
  {
    key: 'licenseeShare',
    label: 'Licensee Share',
    render: (revenue: RegionalRevenue) => (
      <span className="text-purple-600 font-medium">${revenue.licenseeShare.toLocaleString()}</span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (revenue: RegionalRevenue) => {
      const statusConfig = {
        PENDING: { color: 'text-yellow-600', bg: 'bg-yellow-50' },
        CONFIRMED: { color: 'text-blue-600', bg: 'bg-blue-50' },
        PAID: { color: 'text-green-600', bg: 'bg-green-50' },
      };
      const config = statusConfig[revenue.status] || statusConfig.PENDING;

      return (
        <Badge className={`${config.color} ${config.bg}`}>
          {revenue.status}
        </Badge>
      );
    },
  },
];

export default function RevenuePage() {
  const { hrm8User } = useHrm8Auth();
  const [revenues, setRevenues] = useState<RegionalRevenue[]>([]);
  const [companyRevenues, setCompanyRevenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadRevenues();
    loadCompanyRevenues(); // Load company data on mount for stats
  }, [statusFilter]);

  useEffect(() => {
    if (activeTab === 'companies') {
      loadCompanyRevenues();
    }
  }, [activeTab]);

  const loadRevenues = async () => {
    try {
      setLoading(true);
      const filters: Record<string, string> = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const response = await revenueService.getAll(filters);
      if (response.success && response.data?.revenues) {
        setRevenues(response.data.revenues);
      }
    } catch (error) {
      toast.error('Failed to load revenue records');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyRevenues = async () => {
    try {
      setCompanyLoading(true);
      const response = await revenueService.getCompanyRevenueBreakdown();
      if (response.success && response.data?.companies) {
        setCompanyRevenues(response.data.companies);
      }
    } catch (error) {
      console.error('Error loading company revenues:', error);
      toast.error('Failed to load company revenue breakdown');
    } finally {
      setCompanyLoading(false);
    }
  };

  // Compute stats from real-time company data (not pre-computed RegionalRevenue table)
  const totalRevenue = companyRevenues.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
  const totalHRM8Share = companyRevenues.reduce((sum, c) => sum + (c.hrm8Share || 0), 0);
  const totalLicenseeShare = companyRevenues.reduce((sum, c) => sum + (c.licenseeShare || 0), 0);

  return (
    <Hrm8PageLayout
      title="Revenue Tracking"
      subtitle="Track regional revenue and shares"
      actions={
        <div className="flex items-center gap-2">
          {activeTab === 'overview' && (
            <>
              <Label>Filter by Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      }
    >
      <div className="p-6 space-y-6">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <EnhancedStatCard
            title="Total Revenue"
            value=""
            isCurrency={true}
            rawValue={totalRevenue}
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
            change="Overall"
          />

          <EnhancedStatCard
            title="HRM8 Share"
            value=""
            isCurrency={true}
            rawValue={totalHRM8Share}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="primary"
            change="Total"
          />

          <EnhancedStatCard
            title="Licensee Share"
            value=""
            isCurrency={true}
            rawValue={totalLicenseeShare}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
            change="Total"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
            <TabsTrigger value="companies">Company Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Revenue Records</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <TableSkeleton columns={6} />
                ) : (
                  <DataTable
                    data={revenues}
                    columns={columns}
                    searchable
                    searchKeys={['status']}
                    emptyMessage="No revenue records found"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Company</CardTitle>
              </CardHeader>
              <CardContent>
                <CompanyRevenueTable
                  data={companyRevenues}
                  loading={companyLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Hrm8PageLayout>
  );
}

