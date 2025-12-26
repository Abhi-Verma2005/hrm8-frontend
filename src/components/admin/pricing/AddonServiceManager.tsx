import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddonService } from '@/types/pricing';
import { getAddonServices } from '@/lib/pricingStorage';
import { AddonServiceList } from './AddonServiceList';
import { AddonServiceDialog } from './AddonServiceDialog';

export function AddonServiceManager() {
  const [addons, setAddons] = useState<AddonService[]>(getAddonServices());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<AddonService | undefined>();

  const handleCreate = () => {
    setSelectedAddon(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (addon: AddonService) => {
    setSelectedAddon(addon);
    setDialogOpen(true);
  };

  const handleSave = () => {
    setAddons(getAddonServices());
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-lg md:text-xl">Add-on Services</CardTitle>
            <CardDescription className="text-xs md:text-sm">Manage additional services and their pricing</CardDescription>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto touch-manipulation min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <AddonServiceList addons={addons} onEdit={handleEdit} />
        <AddonServiceDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          addon={selectedAddon}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  );
}
