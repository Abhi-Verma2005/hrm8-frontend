import { Badge } from "@/components/ui/badge";
import type { EmploymentType } from "@/types/employee";

interface EmploymentTypeBadgeProps {
  type: EmploymentType;
}

export function EmploymentTypeBadge({ type }: EmploymentTypeBadgeProps) {
  const labels: Record<EmploymentType, string> = {
    'full-time': 'Full-Time',
    'part-time': 'Part-Time',
    'contract': 'Contract',
    'intern': 'Intern',
    'casual': 'Casual',
  };

  return <Badge variant="outline">{labels[type]}</Badge>;
}
