import { EnhancedStatCard } from './EnhancedStatCard';
import { HiringTrendsChart } from './charts/HiringTrendsChart';
import { ApplicationFunnelChart } from './charts/ApplicationFunnelChart';
import { JobDistributionChart } from './charts/JobDistributionChart';
import { SourceOfHireChart } from './charts/SourceOfHireChart';
import { ServicePipelineChart } from './charts/ServicePipelineChart';
import { ServiceTypeDistributionChart } from './charts/ServiceTypeDistributionChart';
import { ConsultantPerformanceChart } from './charts/ConsultantPerformanceChart';
import { ServiceRevenueTrendsChart } from './charts/ServiceRevenueTrendsChart';
import { ProjectCompletionRateChart } from './charts/ProjectCompletionRateChart';
import { AttendanceTrendsChart } from './charts/AttendanceTrendsChart';
import { EmployeeDistributionChart } from './charts/EmployeeDistributionChart';
import { LeaveAnalysisChart } from './charts/LeaveAnalysisChart';
import { PerformanceOverviewChart } from './charts/PerformanceOverviewChart';
import { RevenueExpenseChart } from './charts/RevenueExpenseChart';
import { BudgetAnalysisChart } from './charts/BudgetAnalysisChart';
import { CostBreakdownChart } from './charts/CostBreakdownChart';
import { PayrollTrendsChart } from './charts/PayrollTrendsChart';
import { ProjectPipelineChart } from './charts/ProjectPipelineChart';
import { ClientDistributionChart } from './charts/ClientDistributionChart';
import { ResourceAllocationChart } from './charts/ResourceAllocationChart';
import { RevenueForecastChart } from './charts/RevenueForecastChart';
import { CandidatePipelineChart } from './charts/CandidatePipelineChart';
import { CandidateSourceDistributionChart } from './charts/CandidateSourceDistributionChart';
import { CandidateExperienceBreakdownChart } from './charts/CandidateExperienceBreakdownChart';
import { CandidatePlacementTrendsChart } from './charts/CandidatePlacementTrendsChart';
import { TopSkillsDemandChart } from './charts/TopSkillsDemandChart';
import { SalaryExpectationsChart } from './charts/SalaryExpectationsChart';
import { RecentActivityCard } from './RecentActivityCard';
import { 
  Users, Briefcase, FileText, UserCheck, Eye, Plus, Filter, Download, XCircle, CheckCircle,
  UserCircle, Calendar, Building2, DollarSign, FolderKanban
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DashboardWidget } from '@/lib/dashboard/types';

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  EnhancedStatCard,
  HiringTrendsChart,
  ApplicationFunnelChart,
  JobDistributionChart,
  SourceOfHireChart,
  ServicePipelineChart,
  ServiceTypeDistributionChart,
  ConsultantPerformanceChart,
  ServiceRevenueTrendsChart,
  ProjectCompletionRateChart,
  AttendanceTrendsChart,
  EmployeeDistributionChart,
  LeaveAnalysisChart,
  PerformanceOverviewChart,
  RevenueExpenseChart,
  BudgetAnalysisChart,
  CostBreakdownChart,
  PayrollTrendsChart,
  ProjectPipelineChart,
  ClientDistributionChart,
  ResourceAllocationChart,
  RevenueForecastChart,
  CandidatePipelineChart,
  CandidateSourceDistributionChart,
  CandidateExperienceBreakdownChart,
  CandidatePlacementTrendsChart,
  TopSkillsDemandChart,
  SalaryExpectationsChart,
  RecentActivityCard
};

interface WidgetRendererProps {
  widget: DashboardWidget;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const navigate = useNavigate();
  const Component = COMPONENT_MAP[widget.component];
  
  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full border-2 border-dashed border-border rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Widget not found: {widget.component}
        </p>
      </div>
    );
  }
  
  // Add navigation and icons to stat cards
  if (widget.component === 'EnhancedStatCard') {
    const iconMap: Record<string, React.ReactNode> = {
      // Jobs
      'Active Jobs': <Briefcase className="h-6 w-6" />,
      'Total Candidates': <Users className="h-6 w-6" />,
      'Applications': <FileText className="h-6 w-6" />,
      'Hired This Month': <UserCheck className="h-6 w-6" />,
      // HRMS
      'Total Employees': <UserCircle className="h-6 w-6" />,
      'Attendance Rate': <Calendar className="h-6 w-6" />,
      'Leave Requests': <FileText className="h-6 w-6" />,
      'Departments': <Building2 className="h-6 w-6" />,
      // Financial
      'Total Revenue': <DollarSign className="h-6 w-6" />,
      'Total Expenses': <DollarSign className="h-6 w-6" />,
      'Profit Margin': <DollarSign className="h-6 w-6" />,
      'Payroll Cost': <DollarSign className="h-6 w-6" />,
      // Consulting
      'Active Projects': <FolderKanban className="h-6 w-6" />,
      'Total Clients': <Building2 className="h-6 w-6" />,
      'Utilization Rate': <Users className="h-6 w-6" />,
      'Billable Hours': <Calendar className="h-6 w-6" />,
    };

    const actionMap: Record<string, { label: string; action: () => void }> = {
      'Active Jobs': { label: 'View Jobs', action: () => navigate('/jobs') },
      'Total Candidates': { label: 'View All', action: () => navigate('/candidates') },
      'Applications': { label: 'Review', action: () => navigate('/applications') },
      'Hired This Month': { label: 'View Hires', action: () => navigate('/candidates') },
      'Total Employees': { label: 'View All', action: () => navigate('/candidates') },
      'Attendance Rate': { label: 'View Details', action: () => navigate('/analytics') },
      'Leave Requests': { label: 'Review', action: () => navigate('/applications') },
      'Active Projects': { label: 'View All', action: () => navigate('/jobs') },
      'Total Clients': { label: 'View All', action: () => navigate('/candidates') },
    };

    const menuMap: Record<string, Array<{ label: string; icon: React.ReactNode; onClick: () => void }>> = {
      'Active Jobs': [
        { label: "View all jobs", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/jobs') },
        { label: "Create new job", icon: <Plus className="h-4 w-4" />, onClick: () => navigate('/jobs') },
      ],
      'Total Candidates': [
        { label: "Browse candidates", icon: <Users className="h-4 w-4" />, onClick: () => navigate('/candidates') },
        { label: "Add candidate", icon: <Plus className="h-4 w-4" />, onClick: () => navigate('/candidates') },
      ],
      'Applications': [
        { label: "Review pending", icon: <FileText className="h-4 w-4" />, onClick: () => navigate('/applications') },
        { label: "View rejected", icon: <XCircle className="h-4 w-4" />, onClick: () => navigate('/applications') },
      ],
      'Hired This Month': [
        { label: "View hires", icon: <UserCheck className="h-4 w-4" />, onClick: () => navigate('/candidates') },
      ],
    };

    const icon = iconMap[widget.title];
    const action = actionMap[widget.title];
    const menuItems = menuMap[widget.title];

    return (
      <Component
        {...widget.props}
        icon={icon}
        showAction={!!action}
        actionLabel={action?.label}
        onAction={action?.action}
        showMenu={!!menuItems}
        menuItems={menuItems}
      />
    );
  }
  
  return <Component {...widget.props} />;
}
