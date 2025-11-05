import { Badge } from "@/components/ui/badge";
import type { EmployeeStatus } from "@/types/employee";

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  const variants: Record<EmployeeStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    'active': { label: 'Active', variant: 'default' },
    'on-leave': { label: 'On Leave', variant: 'secondary' },
    'notice-period': { label: 'Notice Period', variant: 'outline' },
    'inactive': { label: 'Inactive', variant: 'secondary' },
    'terminated': { label: 'Terminated', variant: 'destructive' },
  };

  const { label, variant } = variants[status];

  return <Badge variant={variant}>{label}</Badge>;
}
