import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { getEmploymentTypeVariant, formatEmploymentType } from "@/lib/jobUtils";

interface EmploymentTypeBadgeProps {
  type: Job['employmentType'];
  className?: string;
}

export function EmploymentTypeBadge({ type, className }: EmploymentTypeBadgeProps) {
  return (
    <Badge variant={getEmploymentTypeVariant(type)} className={className}>
      {formatEmploymentType(type)}
    </Badge>
  );
}
