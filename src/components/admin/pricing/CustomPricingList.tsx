import { CustomPricing } from '@/types/pricing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CustomPricingListProps {
  customPricing: CustomPricing[];
  onEdit: (pricing: CustomPricing) => void;
}

export function CustomPricingList({ customPricing, onEdit }: CustomPricingListProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      draft: 'bg-yellow-500/10 text-yellow-500',
      archived: 'bg-gray-500/10 text-gray-500',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500';
  };

  if (customPricing.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No custom pricing agreements found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customPricing.map((pricing) => (
        <div key={pricing.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{pricing.employerName}</h3>
                <Badge className={getStatusColor(pricing.status)} variant="secondary">
                  {pricing.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Base Tier: {pricing.baseTierId}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(pricing)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            {pricing.customMonthlyPrice !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Monthly Price</p>
                <p className="font-medium">£{pricing.customMonthlyPrice.toLocaleString()}</p>
              </div>
            )}
            {pricing.customAnnualPrice !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Annual Price</p>
                <p className="font-medium">£{pricing.customAnnualPrice.toLocaleString()}</p>
              </div>
            )}
            {pricing.customMaxJobs !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Max Jobs</p>
                <p className="font-medium">{pricing.customMaxJobs}</p>
              </div>
            )}
            {pricing.customMaxUsers !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Max Users</p>
                <p className="font-medium">{pricing.customMaxUsers}</p>
              </div>
            )}
          </div>

          {pricing.addons.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-1">Add-ons ({pricing.addons.length})</p>
              <div className="flex flex-wrap gap-2">
                {pricing.addons.map((addon, idx) => (
                  <Badge key={idx} variant="outline">
                    {addon.addonId}
                    {addon.customPrice && ` - £${addon.customPrice}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Valid from {format(new Date(pricing.validFrom), 'PP')}</span>
            </div>
            {pricing.validUntil && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Until {format(new Date(pricing.validUntil), 'PP')}</span>
              </div>
            )}
            <span>Approved by: {pricing.approvedBy}</span>
          </div>

          {pricing.notes && (
            <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
              <p className="font-medium mb-1">Notes:</p>
              <p className="text-muted-foreground">{pricing.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
