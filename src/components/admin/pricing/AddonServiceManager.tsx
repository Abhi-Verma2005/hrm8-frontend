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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Add-on Services</CardTitle>
            <CardDescription>Manage additional services and their pricing</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
