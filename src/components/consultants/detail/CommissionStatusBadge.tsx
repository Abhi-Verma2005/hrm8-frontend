import { Badge } from '@/components/ui/badge';

type CommissionStatus = 'pending' | 'approved' | 'paid' | 'disputed';

interface CommissionStatusBadgeProps {
  status: CommissionStatus;
}

export function CommissionStatusBadge({ status }: CommissionStatusBadgeProps) {
  const config = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    approved: { label: 'Approved', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    paid: { label: 'Paid', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    disputed: { label: 'Disputed', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}
