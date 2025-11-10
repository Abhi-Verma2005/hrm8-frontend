import { Column } from '@/components/tables/DataTable';
import { SalesCommission } from '@/types/salesCommission';
import { SalesAgentAvatar } from './SalesAgentAvatar';
import { CommissionStatusBadge } from './CommissionStatusBadge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, CheckCircle, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function createCommissionColumns(): Column<SalesCommission>[] {
  return [
    {
      key: 'deal',
      label: 'Deal',
      sortable: true,
      render: (commission) => {
        const [firstName = 'Unknown', lastName = ''] = commission.employerName.split(' ');
        return (
          <div className="flex items-center gap-3">
            <SalesAgentAvatar firstName={firstName} lastName={lastName} />
            <div>
              <div className="font-medium">{commission.opportunityName}</div>
              <div className="text-sm text-muted-foreground">{commission.employerName}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'salesAgent',
      label: 'Sales Agent',
      sortable: true,
      render: (commission) => {
        const [firstName = 'Unknown', lastName = ''] = commission.salesAgentName.split(' ');
        return (
          <div className="flex items-center gap-2">
            <SalesAgentAvatar firstName={firstName} lastName={lastName} className="h-8 w-8" />
            <span>{commission.salesAgentName}</span>
          </div>
        );
      },
    },
    {
      key: 'dealValue',
      label: 'Deal Value',
      sortable: true,
      render: (commission) => (
        <span className="font-medium">{formatCurrency(commission.dealValue)}</span>
      ),
    },
    {
      key: 'commissionRate',
      label: 'Rate',
      sortable: true,
      render: (commission) => (
        <span className="text-muted-foreground">{commission.commissionRate}%</span>
      ),
    },
    {
      key: 'commissionAmount',
      label: 'Commission',
      sortable: true,
      render: (commission) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(commission.commissionAmount)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (commission) => <CommissionStatusBadge status={commission.status} />,
    },
    {
      key: 'paymentDate',
      label: 'Payment Date',
      sortable: true,
      render: (commission) => (
        <span className="text-sm">
          {commission.paidAt 
            ? format(new Date(commission.paidAt), 'MMM d, yyyy')
            : commission.approvedAt
            ? 'Approved'
            : 'Pending'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (commission) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Commission
            </DropdownMenuItem>
            {commission.status === 'pending' && (
              <DropdownMenuItem>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
            {commission.status === 'approved' && (
              <DropdownMenuItem>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
