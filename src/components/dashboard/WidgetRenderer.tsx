import { EnhancedStatCard } from './EnhancedStatCard';
import { HiringTrendsChart } from './charts/HiringTrendsChart';
import { ApplicationFunnelChart } from './charts/ApplicationFunnelChart';
import { JobDistributionChart } from './charts/JobDistributionChart';
import { SourceOfHireChart } from './charts/SourceOfHireChart';
import { RecentActivityCard } from './RecentActivityCard';
import { Users, Briefcase, FileText, UserCheck, Eye, Plus, Filter, Download, XCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DashboardWidget } from '@/lib/dashboard/types';

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  EnhancedStatCard,
  HiringTrendsChart,
  ApplicationFunnelChart,
  JobDistributionChart,
  SourceOfHireChart,
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
      'Active Jobs': <Briefcase className="h-6 w-6" />,
      'Total Candidates': <Users className="h-6 w-6" />,
      'Applications': <FileText className="h-6 w-6" />,
      'Hired This Month': <UserCheck className="h-6 w-6" />,
    };

    const actionMap: Record<string, { label: string; action: () => void }> = {
      'Active Jobs': { label: 'View Jobs', action: () => navigate('/jobs') },
      'Total Candidates': { label: 'View All', action: () => navigate('/candidates') },
      'Applications': { label: 'Review', action: () => navigate('/applications') },
      'Hired This Month': { label: 'View Hires', action: () => navigate('/candidates') },
    };

    const menuMap: Record<string, Array<{ label: string; icon: React.ReactNode; onClick: () => void }>> = {
      'Active Jobs': [
        { label: "View all jobs", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/jobs') },
        { label: "Create new job", icon: <Plus className="h-4 w-4" />, onClick: () => navigate('/jobs') },
        { label: "Filter by department", icon: <Filter className="h-4 w-4" />, onClick: () => console.log('Filter') },
        { label: "Export to CSV", icon: <Download className="h-4 w-4" />, onClick: () => console.log('Export') },
      ],
      'Total Candidates': [
        { label: "Browse candidates", icon: <Users className="h-4 w-4" />, onClick: () => navigate('/candidates') },
        { label: "Add candidate", icon: <Plus className="h-4 w-4" />, onClick: () => navigate('/candidates') },
        { label: "Filter by skills", icon: <Filter className="h-4 w-4" />, onClick: () => console.log('Filter') },
        { label: "Export list", icon: <Download className="h-4 w-4" />, onClick: () => console.log('Export') },
      ],
      'Applications': [
        { label: "Review pending", icon: <FileText className="h-4 w-4" />, onClick: () => navigate('/applications') },
        { label: "View rejected", icon: <XCircle className="h-4 w-4" />, onClick: () => navigate('/applications') },
        { label: "Filter by date", icon: <Filter className="h-4 w-4" />, onClick: () => console.log('Filter') },
        { label: "Export data", icon: <Download className="h-4 w-4" />, onClick: () => console.log('Export') },
      ],
      'Hired This Month': [
        { label: "View hires", icon: <UserCheck className="h-4 w-4" />, onClick: () => navigate('/candidates') },
        { label: "Onboarding status", icon: <CheckCircle className="h-4 w-4" />, onClick: () => console.log('Onboarding') },
        { label: "Monthly report", icon: <FileText className="h-4 w-4" />, onClick: () => console.log('Report') },
        { label: "Export hires", icon: <Download className="h-4 w-4" />, onClick: () => console.log('Export') },
      ],
    };

    const icon = iconMap[widget.title];
    const action = actionMap[widget.title];
    const menuItems = menuMap[widget.title];

    return (
      <Component
        {...widget.props}
        icon={icon}
        showAction={true}
        actionLabel={action?.label}
        onAction={action?.action}
        showMenu={true}
        menuItems={menuItems}
      />
    );
  }
  
  return <Component {...widget.props} />;
}
