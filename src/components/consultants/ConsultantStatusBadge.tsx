import { Badge } from '@/components/ui/badge';
import type { ConsultantStatus } from '@/types/consultant';

interface ConsultantStatusBadgeProps {
  status: ConsultantStatus;
}

export function ConsultantStatusBadge({ status }: ConsultantStatusBadgeProps) {
  const config: Record<ConsultantStatus, { label: string; variant: "success" | "orange" | "neutral" | "destructive" }> = {
    'active': { label: 'Active', variant: 'success' },
    'on-leave': { label: 'On Leave', variant: 'orange' },
    'inactive': { label: 'Inactive', variant: 'neutral' },
    'suspended': { label: 'Suspended', variant: 'destructive' },
  };

  const { label, variant } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}
