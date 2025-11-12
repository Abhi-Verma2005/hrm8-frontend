import { Column } from '@/components/tables/DataTable';
import type { SalesAgent } from '@/types/salesAgent';
import { SalesAgentAvatar } from './SalesAgentAvatar';
import { SalesAgentStatusBadge } from './SalesAgentStatusBadge';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Eye, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const formatRevenue = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

export function createSalesAgentColumns(): Column<SalesAgent>[] {
  return [
    {
      key: 'name',
      label: 'Sales Agent',
      sortable: true,
      render: (agent) => (
        <div className="flex items-center gap-3">
          <SalesAgentAvatar
            firstName={agent.firstName}
            lastName={agent.lastName}
            photo={agent.photo}
            className="h-10 w-10"
          />
          <div>
            <div className="font-medium">{agent.firstName} {agent.lastName}</div>
            <div className="text-sm text-muted-foreground">{agent.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'salesRole',
      label: 'Role',
      sortable: true,
      render: (agent) => {
        const roleLabels = {
          'sales-rep': 'Sales Rep',
          'account-manager': 'Account Manager',
          'sales-manager': 'Sales Manager',
          'sales-director': 'Sales Director',
        };
        return <span className="text-sm">{roleLabels[agent.salesRole]}</span>;
      },
    },
    {
      key: 'salesType',
      label: 'Type',
      sortable: true,
      render: (agent) => {
        const typeLabels = {
          'inside-sales': 'Inside Sales',
          'outside-sales': 'Outside Sales',
          'enterprise-sales': 'Enterprise Sales',
          'smb-sales': 'SMB Sales',
        };
        return <Badge variant="outline">{typeLabels[agent.salesType]}</Badge>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (agent) => <SalesAgentStatusBadge status={agent.status} />,
    },
    {
      key: 'currentRevenue',
      label: 'Revenue',
      sortable: true,
      render: (agent) => (
        <span className="font-medium">{formatRevenue(agent.currentRevenue)}</span>
      ),
    },
    {
      key: 'closedDeals',
      label: 'Closed Deals',
      sortable: true,
      render: (agent) => <span className="text-sm">{agent.closedDeals}</span>,
    },
    {
      key: 'conversionRate',
      label: 'Win Rate',
      sortable: true,
      render: (agent) => (
        <span className="text-sm font-medium">{agent.conversionRate.toFixed(1)}%</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '80px',
      render: (agent) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Agent
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
