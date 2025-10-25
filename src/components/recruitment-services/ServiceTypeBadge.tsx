import { Badge } from '@/components/ui/badge';
import type { ServiceType } from '@/types/recruitmentService';
import { cn } from '@/lib/utils';

interface ServiceTypeBadgeProps {
  type: ServiceType;
  className?: string;
}

export function ServiceTypeBadge({ type, className }: ServiceTypeBadgeProps) {
  const config = {
    'shortlisting': { label: 'Shortlisting', variant: 'default' as const },
    'full-service': { label: 'Full-Service', variant: 'default' as const },
    'executive-search': { label: 'Executive Search', variant: 'secondary' as const },
    'rpo': { label: 'RPO', variant: 'outline' as const }
  };

  const { label, variant } = config[type];

  return (
    <Badge variant={variant} className={cn("whitespace-nowrap", className)}>
      {label}
    </Badge>
  );
}
