import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect, FormCheckbox } from '@/components/common/form-fields';
import { ATSSubscriptionTier } from '@/types/pricing';
import { createATSSubscriptionTier, updateATSSubscriptionTier } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';
import { ATSFeatureManager } from './ATSFeatureManager';
import { useState, useEffect } from 'react';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  monthlyPrice: z.number().min(0),
  annualPrice: z.number().min(0),
  annualDiscount: z.number().min(0).max(100),
  maxJobs: z.number().min(1),
  maxUsers: z.number().min(1),
  sortOrder: z.number().min(1),
  popularBadge: z.boolean().optional(),
  status: z.enum(['active', 'draft', 'archived']),
});

type FormData = z.infer<typeof schema>;

interface ATSSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier?: ATSSubscriptionTier;
  onSave: () => void;
}

export function ATSSubscriptionDialog({
  open,
  onOpenChange,
  tier,
  onSave,
}: ATSSubscriptionDialogProps) {
  const { toast } = useToast();
  const [features, setFeatures] = useState<string[]>(tier?.features || []);
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: tier || {
      name: '',
      description: '',
      monthlyPrice: 0,
      annualPrice: 0,
      annualDiscount: 0,
      maxJobs: 1,
      maxUsers: 1,
      sortOrder: 1,
      popularBadge: false,
      status: 'draft',
    },
  });

  useEffect(() => {
    setFeatures(tier?.features || []);
  }, [tier]);

  const handleSubmit = (data: FormData) => {
    try {
      if (tier) {
        updateATSSubscriptionTier(tier.id, { ...data, features }, 'current-user');
        toast({ title: 'Tier updated successfully' });
      } else {
        const newTier: Omit<ATSSubscriptionTier, 'id' | 'createdAt' | 'updatedAt'> = {
          name: data.name,
          description: data.description,
          monthlyPrice: data.monthlyPrice,
          annualPrice: data.annualPrice,
          annualDiscount: data.annualDiscount,
          maxJobs: data.maxJobs,
          maxUsers: data.maxUsers,
          sortOrder: data.sortOrder,
          popularBadge: data.popularBadge,
          status: data.status,
          features: features,
        };
        createATSSubscriptionTier(newTier);
        toast({ title: 'Tier created successfully' });
      }
      onSave();
    } catch (error) {
      toast({ title: 'Error saving tier', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tier ? 'Edit' : 'Create'} Subscription Tier</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormInput form={form} name="name" label="Tier Name" required />
            <FormInput form={form} name="description" label="Description" required />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                form={form}
                name="monthlyPrice"
                label="Monthly Price"
                type="number"
                required
              />
              <FormInput
                form={form}
                name="annualPrice"
                label="Annual Price"
                type="number"
                required
              />
              <FormInput
                form={form}
                name="annualDiscount"
                label="Annual Discount %"
                type="number"
                required
              />
              <FormInput
                form={form}
                name="sortOrder"
                label="Sort Order"
                type="number"
                required
              />
              <FormInput
                form={form}
                name="maxJobs"
                label="Max Jobs"
                type="number"
                required
              />
              <FormInput
                form={form}
                name="maxUsers"
                label="Max Users"
                type="number"
                required
              />
            </div>
            <FormCheckbox
              form={form}
              name="popularBadge"
              label="Show as Popular"
              description="Display a 'Popular' badge on this tier"
            />
            <ATSFeatureManager features={features} onChange={setFeatures} />
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
