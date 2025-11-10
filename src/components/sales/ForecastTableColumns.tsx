import { Column } from '@/components/tables/DataTable';
import { ForecastItem } from '@/lib/salesForecastUtils';
import { SalesAgentAvatar } from './SalesAgentAvatar';
import { OpportunityStageBadge } from './OpportunityStageBadge';
import { ForecastConfidenceBadge } from './ForecastConfidenceBadge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, TrendingUp, Mail } from 'lucide-react';
import { format } from 'date-fns';

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function createForecastColumns(): Column<ForecastItem>[] {
  return [
    {
      key: 'opportunity',
      label: 'Opportunity',
      sortable: true,
      render: (item) => {
        const [firstName = 'Unknown', lastName = ''] = item.employerName.split(' ');
        return (
          <div className="flex items-center gap-3">
            <SalesAgentAvatar firstName={firstName} lastName={lastName} />
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.employerName}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'salesAgent',
      label: 'Sales Agent',
      sortable: true,
      render: (item) => {
        const [firstName = 'Unknown', lastName = ''] = item.salesAgentName.split(' ');
        return (
          <div className="flex items-center gap-2">
            <SalesAgentAvatar firstName={firstName} lastName={lastName} className="h-8 w-8" />
            <span>{item.salesAgentName}</span>
          </div>
        );
      },
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      render: (item) => <OpportunityStageBadge stage={item.stage} />,
    },
    {
      key: 'dealValue',
      label: 'Deal Value',
      sortable: true,
      render: (item) => (
        <span className="font-medium">{formatCurrency(item.estimatedValue)}</span>
      ),
    },
    {
      key: 'weightedValue',
      label: 'Weighted Value',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-primary">
          {formatCurrency(item.weightedValue)}
        </span>
      ),
    },
    {
      key: 'probability',
      label: 'Probability',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${item.probability}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{item.probability}%</span>
        </div>
      ),
    },
    {
      key: 'expectedClose',
      label: 'Expected Close',
      sortable: true,
      render: (item) => {
        try {
          const date = new Date(item.expectedCloseDate);
          if (isNaN(date.getTime())) {
            return <div className="text-sm text-muted-foreground">Invalid date</div>;
          }
          return (
            <div>
              <div className="text-sm">{format(date, 'MMM d, yyyy')}</div>
              <div className="text-xs text-muted-foreground">{item.quarter}</div>
            </div>
          );
        } catch {
          return <div className="text-sm text-muted-foreground">Invalid date</div>;
        }
      },
    },
    {
      key: 'confidence',
      label: 'Confidence',
      sortable: true,
      render: (item) => <ForecastConfidenceBadge level={item.confidenceLevel} />,
    },
    {
      key: 'actions',
      label: '',
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Opportunity
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Adjust Forecast
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
