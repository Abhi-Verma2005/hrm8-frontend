import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { RPOContractsTable } from '@/components/rpo/RPOContractsTable';
import { StatsCard } from '@/components/ui/stats-card';
import { Building2, Users, DollarSign, Clock, TrendingUp, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceProject } from '@/types/recruitmentService';
import { useCurrencyFormat } from '@/contexts/CurrencyFormatContext';

// Mock data - replace with real data from your API/state management
const mockContracts: ServiceProject[] = [
  {
    id: '1',
    name: 'Enterprise RPO - Tech Hiring',
    serviceType: 'rpo',
    status: 'active',
    priority: 'high',
    stage: 'in-progress',
    clientId: 'emp-1',
    clientName: 'TechCorp Global',
    clientLogo: undefined,
    location: 'San Francisco, CA',
    country: 'United States',
    consultants: [
      { id: 'c1', name: 'Sarah Johnson', role: 'lead', avatar: undefined },
      { id: 'c2', name: 'Michael Chen', role: 'support', avatar: undefined },
    ],
    progress: 65,
    candidatesShortlisted: 45,
    candidatesInterviewed: 28,
    numberOfVacancies: 15,
    projectValue: 150000,
    upfrontPaid: 75000,
    balanceDue: 75000,
    currency: 'USD',
    startDate: '2024-01-15',
    deadline: '2024-12-31',
    isRPO: true,
    rpoStartDate: '2024-01-15',
    rpoEndDate: '2024-12-31',
    rpoDuration: 12,
    rpoMonthlyRetainer: 12500,
    targetPlacements: 50,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    name: 'Healthcare Recruitment Program',
    serviceType: 'rpo',
    status: 'active',
    priority: 'medium',
    stage: 'in-progress',
    clientId: 'emp-2',
    clientName: 'MediHealth Systems',
    clientLogo: undefined,
    location: 'Boston, MA',
    country: 'United States',
    consultants: [
      { id: 'c3', name: 'Emily Davis', role: 'lead', avatar: undefined },
    ],
    progress: 40,
    candidatesShortlisted: 30,
    candidatesInterviewed: 15,
    numberOfVacancies: 20,
    projectValue: 200000,
    upfrontPaid: 100000,
    balanceDue: 100000,
    currency: 'USD',
    startDate: '2024-02-01',
    deadline: '2025-01-31',
    isRPO: true,
    rpoStartDate: '2024-02-01',
    rpoEndDate: '2025-01-31',
    rpoDuration: 12,
    rpoMonthlyRetainer: 16500,
    targetPlacements: 75,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-19',
  },
  {
    id: '3',
    name: 'Financial Services RPO',
    serviceType: 'rpo',
    status: 'on-hold',
    priority: 'low',
    stage: 'initiated',
    clientId: 'emp-3',
    clientName: 'Capital Finance Group',
    clientLogo: undefined,
    location: 'New York, NY',
    country: 'United States',
    consultants: [],
    progress: 10,
    candidatesShortlisted: 5,
    candidatesInterviewed: 2,
    numberOfVacancies: 8,
    projectValue: 100000,
    upfrontPaid: 50000,
    balanceDue: 50000,
    currency: 'USD',
    startDate: '2024-03-01',
    deadline: '2024-09-30',
    isRPO: true,
    rpoStartDate: '2024-03-01',
    rpoEndDate: '2024-09-30',
    rpoDuration: 7,
    rpoMonthlyRetainer: 14000,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10',
  },
];

export default function RPOManagementPage() {
  const { formatCurrency } = useCurrencyFormat();
  
  // Calculate metrics from contracts
  const totalContracts = mockContracts.filter(c => c.status === 'active').length;
  const totalConsultants = new Set(
    mockContracts.flatMap(c => c.consultants.map(cons => cons.id))
  ).size;
  const monthlyRevenue = mockContracts
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + (c.rpoMonthlyRetainer || 0), 0);
  const expiringContracts = mockContracts.filter(c => {
    if (!c.rpoEndDate) return false;
    const endDate = new Date(c.rpoEndDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }).length;

  return (
    <DashboardPageLayout>
      <div className="w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">RPO Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor your RPO contracts and consultants
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Consultants
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Contracts"
            value={totalContracts.toString()}
            description="Currently running RPO contracts"
            icon={Building2}
            trend={{ value: 12, isPositive: true }}
            change="vs last month"
          />
          <StatsCard
            title="Dedicated Consultants"
            value={totalConsultants.toString()}
            description="Total assigned consultants"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
            change="new this quarter"
          />
          <StatsCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(monthlyRevenue)}
            description="Total MRR from active contracts"
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
            change="growth rate"
          />
          <StatsCard
            title="Expiring Soon"
            value={expiringContracts.toString()}
            description="Contracts ending in 30 days"
            icon={Clock}
            trend={{ value: 2, isPositive: false }}
            change="require action"
          />
        </div>

        {/* Contracts Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">RPO Contracts</h2>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          <RPOContractsTable contracts={mockContracts} />
        </div>
      </div>
    </DashboardPageLayout>
  );
}
