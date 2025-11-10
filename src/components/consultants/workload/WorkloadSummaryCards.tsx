import { Users, AlertCircle, CheckCircle, AlertTriangle, Eye, UserPlus, Download } from 'lucide-react';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import type { TeamWorkloadSummary } from '@/lib/consultantWorkloadUtils';
import { useNavigate } from 'react-router-dom';

interface WorkloadSummaryCardsProps {
  summary: TeamWorkloadSummary;
}

export function WorkloadSummaryCards({ summary }: WorkloadSummaryCardsProps) {
  const navigate = useNavigate();
  
  const atCapacityPercent = summary.totalActive > 0 
    ? Math.round((summary.atCapacity / summary.totalActive) * 100) 
    : 0;

  const availablePercent = summary.totalActive > 0 
    ? Math.round((summary.available / summary.totalActive) * 100) 
    : 0;

  const avgHoursPerConsultant = summary.totalActive > 0
    ? Math.round(summary.totalHoursAssigned / summary.totalActive)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <EnhancedStatCard
        title="Total Active"
        value={summary.totalActive.toString()}
        change={`${avgHoursPerConsultant}h avg per consultant`}
        icon={<Users className="h-6 w-6" />}
        variant="neutral"
        showMenu={true}
        menuItems={[
          {
            label: "View All Consultants",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => navigate('/consultants')
          },
          {
            label: "Add Consultant",
            icon: <UserPlus className="h-4 w-4" />,
            onClick: () => navigate('/consultants/new')
          },
          {
            label: "Export Report",
            icon: <Download className="h-4 w-4" />,
            onClick: () => {}
          }
        ]}
      />

      <EnhancedStatCard
        title="At Capacity"
        value={summary.atCapacity.toString()}
        change={`${atCapacityPercent}% of team`}
        icon={<AlertCircle className="h-6 w-6" />}
        variant="warning"
        showMenu={true}
        menuItems={[
          {
            label: "View At Capacity",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => {}
          },
          {
            label: "Workload Analysis",
            icon: <Download className="h-4 w-4" />,
            onClick: () => {}
          }
        ]}
      />

      <EnhancedStatCard
        title="Available"
        value={summary.available.toString()}
        change={`${availablePercent}% of team`}
        icon={<CheckCircle className="h-6 w-6" />}
        variant="success"
        showMenu={true}
        menuItems={[
          {
            label: "View Available",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => {}
          },
          {
            label: "Assign Projects",
            icon: <UserPlus className="h-4 w-4" />,
            onClick: () => {}
          }
        ]}
      />

      <EnhancedStatCard
        title="Overloaded"
        value={summary.overloaded.toString()}
        change="Requires attention"
        icon={<AlertTriangle className="h-6 w-6" />}
        variant="warning"
        showMenu={true}
        menuItems={[
          {
            label: "View Overloaded",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => {}
          },
          {
            label: "Redistribute Work",
            icon: <UserPlus className="h-4 w-4" />,
            onClick: () => {}
          },
          {
            label: "Export Report",
            icon: <Download className="h-4 w-4" />,
            onClick: () => {}
          }
        ]}
      />
    </div>
  );
}
