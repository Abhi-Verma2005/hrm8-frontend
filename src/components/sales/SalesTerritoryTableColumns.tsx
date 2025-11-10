import { Column } from '@/components/tables/DataTable';
import type { SalesTerritory } from '@/types/salesTerritory';
import { TerritoryRegionBadge } from './TerritoryRegionBadge';
import { Badge } from '@/components/ui/badge';
import { MapPin, MoreHorizontal, Eye, Edit, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

export function createTerritoryColumns(): Column<SalesTerritory>[] {
  return [
    {
      key: 'name',
      label: 'Territory',
      sortable: true,
      render: (territory) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium">{territory.name}</div>
            <div className="text-sm text-muted-foreground">
              <TerritoryRegionBadge region={territory.region} />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'primarySalesAgentName',
      label: 'Primary Agent',
      sortable: true,
      render: (territory) => (
        <span className="text-sm">{territory.primarySalesAgentName || 'Unassigned'}</span>
      ),
    },
    {
      key: 'activeEmployers',
      label: 'Active Employers',
      sortable: true,
      render: (territory) => <span className="text-sm font-medium">{territory.activeEmployers}</span>,
    },
    {
      key: 'totalEmployers',
      label: 'Total Employers',
      sortable: true,
      render: (territory) => <span className="text-sm">{territory.totalEmployers}</span>,
    },
    {
      key: 'annualRevenue',
      label: 'Revenue',
      sortable: true,
      render: (territory) => (
        <span className="font-medium">{formatRevenue(territory.annualRevenue)}</span>
      ),
    },
    {
      key: 'quota',
      label: 'Quota Attainment',
      sortable: true,
      render: (territory) => {
        const attainment = (territory.annualRevenue / territory.quota * 100);
        const color = attainment >= 100 ? 'text-green-600' : attainment >= 75 ? 'text-yellow-600' : 'text-red-600';
        return (
          <span className={`text-sm font-medium ${color}`}>
            {attainment.toFixed(0)}%
          </span>
        );
      },
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (territory) => (
        <Badge variant={territory.isActive ? 'success' : 'neutral'}>
          {territory.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (territory) => (
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
              Edit Territory
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="h-4 w-4 mr-2" />
              Assign Agents
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
