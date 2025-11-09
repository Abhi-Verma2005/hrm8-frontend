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
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-lg md:text-xl">Custom Pricing Agreements</CardTitle>
            <CardDescription className="text-xs md:text-sm">Manage employer-specific pricing arrangements</CardDescription>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto touch-manipulation min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            Add Agreement
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
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
