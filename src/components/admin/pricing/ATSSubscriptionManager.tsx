import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ATSSubscriptionTier } from '@/types/pricing';
import { getATSSubscriptionTiers } from '@/lib/pricingStorage';
import { ATSSubscriptionList } from './ATSSubscriptionList';
import { ATSSubscriptionDialog } from './ATSSubscriptionDialog';

export function ATSSubscriptionManager() {
  const [tiers, setTiers] = useState<ATSSubscriptionTier[]>(getATSSubscriptionTiers());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ATSSubscriptionTier | undefined>();

  const handleCreate = () => {
    setSelectedTier(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (tier: ATSSubscriptionTier) => {
    setSelectedTier(tier);
    setDialogOpen(true);
  };

  const handleSave = () => {
    setTiers(getATSSubscriptionTiers());
    setDialogOpen(false);
    setSelectedTier(undefined);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedTier(undefined);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>ATS Subscription Tiers</CardTitle>
            <CardDescription>Manage subscription plans and pricing</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ATSSubscriptionList tiers={tiers} onEdit={handleEdit} />
        <ATSSubscriptionDialog
          open={dialogOpen}
          onOpenChange={handleDialogChange}
          tier={selectedTier}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  );
}
