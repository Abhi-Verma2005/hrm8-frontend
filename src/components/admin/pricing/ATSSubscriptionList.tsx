import { ATSSubscriptionTier } from '@/types/pricing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';

interface ATSSubscriptionListProps {
  tiers: ATSSubscriptionTier[];
  onEdit: (tier: ATSSubscriptionTier) => void;
}

export function ATSSubscriptionList({ tiers, onEdit }: ATSSubscriptionListProps) {
  return (
    <div className="space-y-4">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{tier.name}</h3>
                <Badge variant={tier.status === 'active' ? 'default' : 'secondary'}>
                  {tier.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Monthly:</span>
                  <span className="ml-2 font-medium">${tier.monthlyPrice}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Annual:</span>
                  <span className="ml-2 font-medium">${tier.annualPrice}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Jobs:</span>
                  <span className="ml-2 font-medium">{tier.maxJobs}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Users:</span>
                  <span className="ml-2 font-medium">{tier.maxUsers}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {tier.features.slice(0, 3).map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {tier.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tier.features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onEdit(tier)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
