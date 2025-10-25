import type { ColumnDef } from '@tanstack/react-table';
import type { Consultant } from '@/types/consultant';
import { ConsultantTypeBadge } from './ConsultantTypeBadge';
import { ConsultantStatusBadge } from './ConsultantStatusBadge';
import { getConsultantFullName, formatRevenue } from '@/lib/consultantUtils';

export const ConsultantTableColumns: ColumnDef<Consultant>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const consultant = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {consultant.firstName[0]}{consultant.lastName[0]}
          </div>
          <div>
            <div className="font-medium">{getConsultantFullName(consultant)}</div>
            <div className="text-sm text-muted-foreground">{consultant.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <ConsultantTypeBadge type={row.original.type} />,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ConsultantStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'specialization',
    header: 'Specialization',
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div className="truncate">{row.original.specialization.join(', ')}</div>
      </div>
    ),
  },
  {
    accessorKey: 'totalPlacements',
    header: 'Placements',
    cell: ({ row }) => <div className="text-right">{row.original.totalPlacements}</div>,
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Revenue',
    cell: ({ row }) => (
      <div className="text-right font-medium">{formatRevenue(row.original.totalRevenue)}</div>
    ),
  },
  {
    accessorKey: 'successRate',
    header: 'Success Rate',
    cell: ({ row }) => (
      <div className="text-right">{(row.original.successRate * 100).toFixed(1)}%</div>
    ),
  },
];
