import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { getServiceTypeVariant, formatServiceType } from "@/lib/jobUtils";

interface ServiceTypeBadgeProps {
  type: Job['serviceType'];
  className?: string;
}

export function ServiceTypeBadge({ type, className }: ServiceTypeBadgeProps) {
  return (
    <Badge variant={getServiceTypeVariant(type)} className={className}>
      {formatServiceType(type)}
    </Badge>
  );
}
