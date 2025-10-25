import { Link } from 'react-router-dom';
import type { Consultant } from '@/types/consultant';
import type { Column } from '@/components/tables/DataTable';
import { ConsultantTypeBadge } from './ConsultantTypeBadge';
import { ConsultantStatusBadge } from './ConsultantStatusBadge';
import { getConsultantFullName, formatRevenue } from '@/lib/consultantUtils';

export const createConsultantColumns = (): Column<Consultant>[] => [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (consultant) => (
      <Link
        to={`/consultants/${consultant.id}`}
        className="flex items-center gap-3 hover:underline"
      >
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
          {consultant.firstName[0]}{consultant.lastName[0]}
        </div>
        <div>
          <div className="font-medium">{getConsultantFullName(consultant)}</div>
          <div className="text-sm text-muted-foreground">{consultant.email}</div>
        </div>
      </Link>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    render: (consultant) => <ConsultantTypeBadge type={consultant.type} />,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (consultant) => <ConsultantStatusBadge status={consultant.status} />,
  },
  {
    key: 'specialization',
    label: 'Specialization',
    render: (consultant) => (
      <div className="max-w-[200px]">
        <div className="truncate">{consultant.specialization.join(', ')}</div>
      </div>
    ),
  },
  {
    key: 'totalPlacements',
    label: 'Placements',
    sortable: true,
    render: (consultant) => <div className="text-right">{consultant.totalPlacements}</div>,
  },
  {
    key: 'totalRevenue',
    label: 'Revenue',
    sortable: true,
    render: (consultant) => (
      <div className="text-right font-medium">{formatRevenue(consultant.totalRevenue)}</div>
    ),
  },
  {
    key: 'successRate',
    label: 'Success Rate',
    sortable: true,
    render: (consultant) => (
      <div className="text-right">{(consultant.successRate * 100).toFixed(1)}%</div>
    ),
  },
];
