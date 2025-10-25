import { Badge } from '@/components/ui/badge';
import type { ConsultantType } from '@/types/consultant';

interface ConsultantTypeBadgeProps {
  type: ConsultantType;
}

export function ConsultantTypeBadge({ type }: ConsultantTypeBadgeProps) {
  const config = {
    'sales-rep': { label: 'Sales Rep', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    'recruiter': { label: 'Recruiter', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    '360-consultant': { label: '360 Consultant', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
    'industry-partner': { label: 'Industry Partner', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  };

  const { label, className } = config[type];

  return <Badge variant="secondary" className={className}>{label}</Badge>;
}
