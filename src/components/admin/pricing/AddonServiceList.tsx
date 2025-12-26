import { AddonService } from '@/types/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { deleteAddonService } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';

interface AddonServiceListProps {
  addons: AddonService[];
  onEdit: (addon: AddonService) => void;
}

export function AddonServiceList({ addons, onEdit }: AddonServiceListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState<AddonService | null>(null);
  const { toast } = useToast();

  const handleDelete = (addon: AddonService) => {
    setAddonToDelete(addon);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (addonToDelete) {
      deleteAddonService(addonToDelete.id);
      toast({
        title: 'Add-on service deleted',
        description: `${addonToDelete.name} has been deleted successfully.`,
      });
      setDeleteDialogOpen(false);
      setAddonToDelete(null);
      window.location.reload();
    }
  };

  const getPricingModelLabel = (model: string) => {
    const labels: Record<string, string> = {
      flat: 'Flat Rate',
      per_use: 'Per Use',
      tiered: 'Tiered',
      percentage: 'Percentage',
    };
    return labels[model] || model;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      draft: 'bg-yellow-500/10 text-yellow-500',
      archived: 'bg-gray-500/10 text-gray-500',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500';
  };

  if (addons.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No add-on services found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {addons.map((addon) => (
          <Card key={addon.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <CardDescription className="mt-2">{addon.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(addon.status)} variant="secondary">
                  {addon.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Pricing Model</p>
                  <p className="font-medium">{getPricingModelLabel(addon.pricingModel)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="font-medium">£{addon.basePrice.toLocaleString()}</p>
                </div>
                {addon.pricePerUnit && (
                  <div>
                    <p className="text-sm text-muted-foreground">Price Per Unit</p>
                    <p className="font-medium">
                      £{addon.pricePerUnit} {addon.unitLabel}
                    </p>
                  </div>
                )}
                {addon.features.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Features</p>
                    <ul className="text-sm space-y-1">
                      {addon.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                      {addon.features.length > 3 && (
                        <li className="text-muted-foreground">+{addon.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(addon)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(addon)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Add-on Service"
        itemName={addonToDelete?.name}
      />
    </>
  );
}
