import { Column } from '@/components/tables/DataTable';
import { SalesOpportunity } from '@/types/salesOpportunity';
import { SalesAgentAvatar } from './SalesAgentAvatar';
import { OpportunityStageBadge } from './OpportunityStageBadge';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function createTopDealsColumns(): Column<SalesOpportunity>[] {
  return [
    {
      key: 'deal',
      label: 'Deal',
      sortable: true,
      render: (opp) => {
        const [firstName = 'Unknown', lastName = ''] = opp.employerName.split(' ');
        return (
          <div className="flex items-center gap-3">
            <SalesAgentAvatar firstName={firstName} lastName={lastName} />
            <div>
              <div className="font-medium">{opp.name}</div>
              <div className="text-sm text-muted-foreground">{opp.employerName}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'salesAgent',
      label: 'Sales Agent',
      sortable: true,
      render: (opp) => {
        const [firstName = 'Unknown', lastName = ''] = opp.salesAgentName.split(' ');
        return (
          <div className="flex items-center gap-2">
            <SalesAgentAvatar firstName={firstName} lastName={lastName} className="h-8 w-8" />
            <span className="text-sm">{opp.salesAgentName}</span>
          </div>
        );
      },
    },
    {
      key: 'value',
      label: 'Value',
      sortable: true,
      render: (opp) => (
        <span className="font-semibold">{formatCurrency(opp.estimatedValue)}</span>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      render: (opp) => <OpportunityStageBadge stage={opp.stage} />,
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (opp) => (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${opp.probability}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{opp.probability}%</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <Button variant="ghost" size="sm">
          View
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      ),
    },
  ];
}
