import { Badge } from '@/components/ui/badge';
import type { ConsultantStatus } from '@/types/consultant';

interface ConsultantStatusBadgeProps {
  status: ConsultantStatus;
}

export function ConsultantStatusBadge({ status }: ConsultantStatusBadgeProps) {
  const config = {
    'active': { label: 'Active', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    'on-leave': { label: 'On Leave', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    'inactive': { label: 'Inactive', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
    'suspended': { label: 'Suspended', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  };

  const { label, className } = config[status];

  return <Badge variant="secondary" className={className}>{label}</Badge>;
}
