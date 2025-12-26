import { Badge } from '@/components/ui/badge';
import type { ConsultantType } from '@/types/consultant';

interface ConsultantTypeBadgeProps {
  type: ConsultantType;
}

export function ConsultantTypeBadge({ type }: ConsultantTypeBadgeProps) {
  const config: Record<ConsultantType, { label: string; variant: "default" | "teal" | "purple" | "coral" }> = {
    'sales-rep': { label: 'Sales Rep', variant: 'default' },
    'recruiter': { label: 'Recruiter', variant: 'teal' },
    '360-consultant': { label: '360 Consultant', variant: 'purple' },
    'industry-partner': { label: 'Industry Partner', variant: 'coral' },
  };

  const { label, variant } = config[type];

  return <Badge variant={variant}>{label}</Badge>;
}
