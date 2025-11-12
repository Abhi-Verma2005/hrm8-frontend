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
    width: "25%",
    render: (consultant) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
          {consultant.firstName[0]}{consultant.lastName[0]}
        </div>
        <div>
          <Link
            to={`/consultants/${consultant.id}`}
            className="font-semibold text-base hover:underline cursor-pointer line-clamp-1 block"
          >
            {getConsultantFullName(consultant)}
          </Link>
          <div className="text-sm text-muted-foreground">{consultant.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
    width: "12%",
    render: (consultant) => {
      if (!consultant.location) return <span className="text-muted-foreground">—</span>;
      
      return (
        <div className="text-sm">
          <p className="font-medium">{consultant.location}</p>
          <p className="text-xs text-muted-foreground">{consultant.country}</p>
        </div>
      );
    },
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    width: "10%",
    render: (consultant) => <ConsultantTypeBadge type={consultant.type} />,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: "10%",
    render: (consultant) => <ConsultantStatusBadge status={consultant.status} />,
  },
  {
    key: 'specialization',
    label: 'Specialization',
    width: "15%",
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
    width: "10%",
    render: (consultant) => <div className="text-right">{consultant.totalPlacements}</div>,
  },
  {
    key: 'totalRevenue',
    label: 'Revenue',
    sortable: true,
    width: "10%",
    render: (consultant) => (
      <div className="text-right font-medium">{formatRevenue(consultant.totalRevenue)}</div>
    ),
  },
  {
    key: 'successRate',
    label: 'Success Rate',
    sortable: true,
    width: "8%",
    render: (consultant) => (
      <div className="text-right">{(consultant.successRate * 100).toFixed(1)}%</div>
    ),
  },
];
