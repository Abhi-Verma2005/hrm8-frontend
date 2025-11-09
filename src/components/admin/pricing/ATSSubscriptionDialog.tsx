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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, DollarSign, Users, List } from 'lucide-react';

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
  const [features, setFeatures] = useState<string[]>([]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
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

  // Reset form and features when tier changes or dialog opens
  useEffect(() => {
    if (open) {
      if (tier) {
        form.reset(tier);
        setFeatures(tier.features || []);
      } else {
        form.reset({
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
        });
        setFeatures([]);
      }
    }
  }, [tier, open, form]);

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{tier ? 'Edit' : 'Create'} Subscription Tier</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">
                    <Info className="h-4 w-4 mr-2" />
                    Basic
                  </TabsTrigger>
                  <TabsTrigger value="pricing">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pricing
                  </TabsTrigger>
                  <TabsTrigger value="limits">
                    <Users className="h-4 w-4 mr-2" />
                    Limits
                  </TabsTrigger>
                  <TabsTrigger value="features">
                    <List className="h-4 w-4 mr-2" />
                    Features
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <FormInput form={form} name="name" label="Tier Name" required />
                  <FormInput form={form} name="description" label="Description" required />
                  <FormInput
                    form={form}
                    name="sortOrder"
                    label="Sort Order"
                    type="number"
                    required
                  />
                  <FormCheckbox
                    form={form}
                    name="popularBadge"
                    label="Show as Popular"
                    description="Display a 'Popular' badge on this tier"
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
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      form={form}
                      name="monthlyPrice"
                      label="Monthly Price ($)"
                      type="number"
                      required
                    />
                    <FormInput
                      form={form}
                      name="annualPrice"
                      label="Annual Price ($)"
                      type="number"
                      required
                    />
                  </div>
                  <FormInput
                    form={form}
                    name="annualDiscount"
                    label="Annual Discount %"
                    type="number"
                    required
                  />
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="font-medium mb-1">Pricing Preview</p>
                    <p className="text-muted-foreground">
                      Monthly: ${form.watch('monthlyPrice') || 0} • Annual: $
                      {form.watch('annualPrice') || 0} ({form.watch('annualDiscount') || 0}% discount)
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="limits" className="space-y-4 mt-4">
                  <div className="rounded-lg bg-muted p-4 text-sm mb-4">
                    <p className="font-medium mb-1">Unlimited Values</p>
                    <p className="text-muted-foreground">
                      Enter <strong>999999</strong> to indicate unlimited jobs or users
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                </TabsContent>

                <TabsContent value="features" className="space-y-4 mt-4">
                  <ATSFeatureManager features={features} onChange={setFeatures} />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
