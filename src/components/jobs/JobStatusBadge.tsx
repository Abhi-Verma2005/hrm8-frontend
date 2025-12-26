import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { getJobStatusVariant } from "@/lib/jobUtils";

interface JobStatusBadgeProps {
  status: Job['status'];
  className?: string;
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const statusLabels: Record<Job['status'], string> = {
    'draft': 'Draft',
    'open': 'Open',
    'closed': 'Closed',
    'on-hold': 'On Hold',
    'filled': 'Filled',
    'cancelled': 'Cancelled',
    'template': 'Template',
  };

  return (
    <Badge variant={getJobStatusVariant(status)} className={className}>
      {statusLabels[status]}
    </Badge>
  );
}
