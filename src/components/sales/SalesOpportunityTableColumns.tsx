import { Column } from '@/components/tables/DataTable';
import type { SalesOpportunity } from '@/types/salesOpportunity';
import { OpportunityStageBadge } from './OpportunityStageBadge';
import { OpportunityTypeBadge } from './OpportunityTypeBadge';
import { Building2, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

const formatRevenue = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

export function createOpportunityColumns(): Column<SalesOpportunity>[] {
  return [
    {
      key: 'name',
      label: 'Opportunity',
      sortable: true,
      render: (opp) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium">{opp.name}</div>
            <div className="text-sm text-muted-foreground">{opp.employerName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'salesAgentName',
      label: 'Sales Agent',
      sortable: true,
      render: (opp) => <span className="text-sm">{opp.salesAgentName}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (opp) => <OpportunityTypeBadge type={opp.type} />,
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      render: (opp) => <OpportunityStageBadge stage={opp.stage} />,
    },
    {
      key: 'estimatedValue',
      label: 'Value',
      sortable: true,
      render: (opp) => (
        <span className="font-medium">{formatRevenue(opp.estimatedValue)}</span>
      ),
    },
    {
      key: 'probability',
      label: 'Probability',
      sortable: true,
      render: (opp) => (
        <span className="text-sm">{opp.probability}%</span>
      ),
    },
    {
      key: 'expectedCloseDate',
      label: 'Expected Close',
      sortable: true,
      render: (opp) => {
        try {
          const date = new Date(opp.expectedCloseDate);
          if (isNaN(date.getTime())) {
            return <span className="text-sm text-muted-foreground">Invalid date</span>;
          }
          return <span className="text-sm">{format(date, 'MMM d, yyyy')}</span>;
        } catch {
          return <span className="text-sm text-muted-foreground">Invalid date</span>;
        }
      },
    },
    {
      key: 'actions',
      label: '',
      render: (opp) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Opportunity
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
