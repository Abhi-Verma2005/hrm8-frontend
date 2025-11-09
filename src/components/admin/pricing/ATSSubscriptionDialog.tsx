import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect } from '@/components/common/form-fields';
import { ATSSubscriptionTier } from '@/types/pricing';
import { createATSSubscriptionTier, updateATSSubscriptionTier } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  monthlyPrice: z.number().min(0),
  annualPrice: z.number().min(0),
  maxJobs: z.number().min(1),
  maxUsers: z.number().min(1),
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
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: tier || {
      name: '',
      monthlyPrice: 0,
      annualPrice: 0,
      maxJobs: 1,
      maxUsers: 1,
      status: 'draft',
    },
  });

  const handleSubmit = (data: FormData) => {
    try {
      if (tier) {
        updateATSSubscriptionTier(tier.id, data, 'current-user');
        toast({ title: 'Tier updated successfully' });
      } else {
        const newTier: Omit<ATSSubscriptionTier, 'id' | 'createdAt' | 'updatedAt'> = {
          name: data.name,
          monthlyPrice: data.monthlyPrice,
          annualPrice: data.annualPrice,
          maxJobs: data.maxJobs,
          maxUsers: data.maxUsers,
          status: data.status,
          features: [],
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
