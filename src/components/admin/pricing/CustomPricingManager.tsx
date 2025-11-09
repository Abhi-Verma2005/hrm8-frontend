import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CustomPricing } from '@/types/pricing';
import { getCustomPricing } from '@/lib/pricingStorage';
import { CustomPricingList } from './CustomPricingList';
import { CustomPricingDialog } from './CustomPricingDialog';

export function CustomPricingManager() {
  const [customPricing, setCustomPricing] = useState<CustomPricing[]>(getCustomPricing());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<CustomPricing | undefined>();

  const handleCreate = () => {
    setSelectedPricing(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (pricing: CustomPricing) => {
    setSelectedPricing(pricing);
    setDialogOpen(true);
  };

  const handleSave = () => {
    setCustomPricing(getCustomPricing());
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Custom Pricing Agreements</CardTitle>
            <CardDescription>Manage employer-specific pricing arrangements</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Agreement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CustomPricingList customPricing={customPricing} onEdit={handleEdit} />
        <CustomPricingDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          customPricing={selectedPricing}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  );
}
