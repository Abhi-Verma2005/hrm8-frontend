import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput, FormTextarea, FormSelect } from '@/components/common/form-fields';
import { CustomPricing } from '@/types/pricing';
import { createCustomPricing, getATSSubscriptionTiers, getAddonServices } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const schema = z.object({
  employerName: z.string().trim().min(1, 'Employer name is required').max(200),
  baseTierId: z.string().min(1, 'Base tier is required'),
  customMonthlyPrice: z.number().min(0).optional(),
  customAnnualPrice: z.number().min(0).optional(),
  customMaxJobs: z.number().int().min(0).optional(),
  customMaxUsers: z.number().int().min(0).optional(),
  notes: z.string().trim().optional(),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validUntil: z.string().optional(),
  approvedBy: z.string().trim().min(1, 'Approver is required'),
  status: z.enum(['active', 'draft', 'archived']),
});

type FormData = z.infer<typeof schema>;

interface CustomPricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customPricing?: CustomPricing;
  onSave: () => void;
}

export function CustomPricingDialog({ open, onOpenChange, customPricing, onSave }: CustomPricingDialogProps) {
  const [selectedAddons, setSelectedAddons] = useState<Array<{ addonId: string; customPrice?: number }>>([]);
  const { toast } = useToast();
  const availableTiers = getATSSubscriptionTiers();
  const availableAddons = getAddonServices();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      employerName: '',
      baseTierId: '',
      customMonthlyPrice: undefined,
      customAnnualPrice: undefined,
      customMaxJobs: undefined,
      customMaxUsers: undefined,
      notes: '',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      approvedBy: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (open) {
      if (customPricing) {
        form.reset({
          employerName: customPricing.employerName,
          baseTierId: customPricing.baseTierId,
          customMonthlyPrice: customPricing.customMonthlyPrice,
          customAnnualPrice: customPricing.customAnnualPrice,
          customMaxJobs: customPricing.customMaxJobs,
          customMaxUsers: customPricing.customMaxUsers,
          notes: customPricing.notes || '',
          validFrom: customPricing.validFrom.split('T')[0],
          validUntil: customPricing.validUntil?.split('T')[0] || '',
          approvedBy: customPricing.approvedBy,
          status: customPricing.status,
        });
        setSelectedAddons(customPricing.addons);
      } else {
        form.reset({
          employerName: '',
          baseTierId: '',
          customMonthlyPrice: undefined,
          customAnnualPrice: undefined,
          customMaxJobs: undefined,
          customMaxUsers: undefined,
          notes: '',
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: '',
          approvedBy: '',
          status: 'draft',
        });
        setSelectedAddons([]);
      }
    }
  }, [open, customPricing, form]);

  const handleSubmit = (data: FormData) => {
    const pricingData: Omit<CustomPricing, 'id' | 'createdAt' | 'updatedAt'> = {
      employerId: `employer-${Date.now()}`,
      employerName: data.employerName,
      baseTierId: data.baseTierId,
      customMonthlyPrice: data.customMonthlyPrice,
      customAnnualPrice: data.customAnnualPrice,
      customMaxJobs: data.customMaxJobs,
      customMaxUsers: data.customMaxUsers,
      customFeatures: undefined,
      addons: selectedAddons,
      notes: data.notes,
      validFrom: new Date(data.validFrom).toISOString(),
      validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : undefined,
      approvedBy: data.approvedBy,
      status: data.status,
    };

    try {
      createCustomPricing(pricingData);
      toast({
        title: 'Custom pricing created',
        description: 'The custom pricing agreement has been created successfully.',
      });
      onSave();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save custom pricing. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.addonId === addonId);
      if (exists) {
        return prev.filter((a) => a.addonId !== addonId);
      }
      return [...prev, { addonId }];
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customPricing ? 'Edit Custom Pricing' : 'Create Custom Pricing Agreement'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormInput
              form={form}
              name="employerName"
              label="Employer Name"
              placeholder="e.g., Acme Corporation"
              required
            />

            <FormSelect
              form={form}
              name="baseTierId"
              label="Base Subscription Tier"
              options={availableTiers.map((tier) => ({
                value: tier.id,
                label: tier.name,
              }))}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                form={form}
                name="customMonthlyPrice"
                label="Custom Monthly Price (£)"
                type="number"
                placeholder="Leave empty to use tier default"
              />
              <FormInput
                form={form}
                name="customAnnualPrice"
                label="Custom Annual Price (£)"
                type="number"
                placeholder="Leave empty to use tier default"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                form={form}
                name="customMaxJobs"
                label="Custom Max Jobs"
                type="number"
                placeholder="Leave empty to use tier default"
              />
              <FormInput
                form={form}
                name="customMaxUsers"
                label="Custom Max Users"
                type="number"
                placeholder="Leave empty to use tier default"
              />
            </div>

            <div className="space-y-3">
              <Label>Add-ons</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableAddons.map((addon) => (
                  <div key={addon.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`addon-${addon.id}`}
                      checked={selectedAddons.some((a) => a.addonId === addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="h-4 w-4"
                    />
                    <label htmlFor={`addon-${addon.id}`} className="text-sm">
                      {addon.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput form={form} name="validFrom" label="Valid From" type="date" required />
              <FormInput form={form} name="validUntil" label="Valid Until" type="date" />
            </div>

            <FormInput
              form={form}
              name="approvedBy"
              label="Approved By"
              placeholder="e.g., John Doe"
              required
            />

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

            <FormTextarea
              form={form}
              name="notes"
              label="Notes"
              placeholder="Additional notes about this pricing agreement..."
              rows={3}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Agreement</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
