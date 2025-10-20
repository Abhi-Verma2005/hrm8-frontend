import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/employerUtils";
import type { Employer } from "@/types/entities";

interface EmployerStatusBadgeProps {
  status: Employer['status'];
  className?: string;
}

const statusLabels: Record<Employer['status'], string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  trial: "Trial",
  expired: "Expired",
};

export function EmployerStatusBadge({ status, className }: EmployerStatusBadgeProps) {
  return (
    <Badge variant="outline" className={`${getStatusColor(status)} ${className || ""}`}>
      {statusLabels[status]}
    </Badge>
  );
}
