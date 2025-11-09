import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput, FormTextarea, FormSelect, FormCheckbox } from '@/components/common/form-fields';
import { AddonService } from '@/types/pricing';
import { createAddonService, updateAddonService, getATSSubscriptionTiers } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';
import { ATSFeatureManager } from './ATSFeatureManager';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().min(1, 'Description is required').max(500),
  pricingModel: z.enum(['flat', 'per_use', 'tiered', 'percentage']),
  basePrice: z.number().min(0, 'Base price must be positive'),
  pricePerUnit: z.number().min(0).optional(),
  unitLabel: z.string().trim().optional(),
  status: z.enum(['active', 'draft', 'archived']),
});

type FormData = z.infer<typeof schema>;

interface AddonServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addon?: AddonService;
  onSave: () => void;
}

export function AddonServiceDialog({ open, onOpenChange, addon, onSave }: AddonServiceDialogProps) {
  const [features, setFeatures] = useState<string[]>([]);
  const [applicableTiers, setApplicableTiers] = useState<string[]>([]);
  const { toast } = useToast();
  const availableTiers = getATSSubscriptionTiers();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      pricingModel: 'flat',
      basePrice: 0,
      pricePerUnit: 0,
      unitLabel: '',
      status: 'active',
    },
  });

  const pricingModel = form.watch('pricingModel');

  useEffect(() => {
    if (open) {
      if (addon) {
        form.reset({
          name: addon.name,
          description: addon.description,
          pricingModel: addon.pricingModel,
          basePrice: addon.basePrice,
          pricePerUnit: addon.pricePerUnit || 0,
          unitLabel: addon.unitLabel || '',
          status: addon.status,
        });
        setFeatures(addon.features);
        setApplicableTiers(addon.applicableTiers);
      } else {
        form.reset({
          name: '',
          description: '',
          pricingModel: 'flat',
          basePrice: 0,
          pricePerUnit: 0,
          unitLabel: '',
          status: 'active',
        });
        setFeatures([]);
        setApplicableTiers([]);
      }
    }
  }, [open, addon, form]);

  const handleSubmit = (data: FormData) => {
    const addonData: Omit<AddonService, 'id' | 'createdAt' | 'updatedAt'> = {
      name: data.name,
      description: data.description,
      pricingModel: data.pricingModel,
      basePrice: data.basePrice,
      pricePerUnit: data.pricePerUnit || undefined,
      unitLabel: data.unitLabel || undefined,
      features,
      applicableTiers,
      status: data.status,
    };

    try {
      if (addon) {
        updateAddonService(addon.id, addonData);
        toast({
          title: 'Add-on service updated',
          description: 'The add-on service has been updated successfully.',
        });
      } else {
        createAddonService(addonData);
        toast({
          title: 'Add-on service created',
          description: 'The add-on service has been created successfully.',
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save add-on service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleTier = (tierId: string) => {
    setApplicableTiers((prev) =>
      prev.includes(tierId) ? prev.filter((id) => id !== tierId) : [...prev, tierId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{addon ? 'Edit Add-on Service' : 'Create Add-on Service'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormInput form={form} name="name" label="Service Name" placeholder="e.g., Candidate Assessments" required />
            <FormTextarea form={form} name="description" label="Description" placeholder="Describe the add-on service..." rows={3} required />
            
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                form={form}
                name="pricingModel"
                label="Pricing Model"
                options={[
                  { value: 'flat', label: 'Flat Rate' },
                  { value: 'per_use', label: 'Per Use' },
                  { value: 'tiered', label: 'Tiered' },
                  { value: 'percentage', label: 'Percentage' },
                ]}
                required
              />
              <FormInput form={form} name="basePrice" label="Base Price (£)" type="number" required />
            </div>

            {pricingModel === 'per_use' && (
              <div className="grid grid-cols-2 gap-4">
                <FormInput form={form} name="pricePerUnit" label="Price Per Unit (£)" type="number" />
                <FormInput form={form} name="unitLabel" label="Unit Label" placeholder="e.g., per employee" />
              </div>
            )}

            <FormSelect
              form={form}
              name="status"
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
              ]}
              required
            />

            <ATSFeatureManager features={features} onChange={setFeatures} />

            <div className="space-y-3">
              <label className="text-sm font-medium">Applicable Tiers</label>
              <div className="grid grid-cols-2 gap-2">
                {availableTiers.map((tier) => (
                  <div key={tier.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`tier-${tier.id}`}
                      checked={applicableTiers.includes(tier.id)}
                      onChange={() => toggleTier(tier.id)}
                      className="h-4 w-4"
                    />
                    <label htmlFor={`tier-${tier.id}`} className="text-sm">
                      {tier.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Add-on Service</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
