import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput, FormTextarea, FormSelect } from '@/components/common/form-fields';
import { RecruitmentService } from '@/types/pricing';
import { createRecruitmentService, updateRecruitmentService } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';
import { ATSFeatureManager } from './ATSFeatureManager';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().min(1, 'Description is required').max(500),
  serviceType: z.enum(['shortlisting', 'full-service', 'executive-search', 'rpo']),
  pricingModel: z.enum(['flat', 'per_use', 'tiered', 'percentage']),
  baseFee: z.number().min(0, 'Base fee must be positive'),
  percentageFee: z.number().min(0).max(100).optional(),
  minFee: z.number().min(0).optional(),
  maxFee: z.number().min(0).optional(),
  estimatedDuration: z.string().trim().optional(),
  status: z.enum(['active', 'draft', 'archived']),
});

type FormData = z.infer<typeof schema>;

interface RecruitmentServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: RecruitmentService;
  onSave: () => void;
}

export function RecruitmentServiceDialog({ open, onOpenChange, service, onSave }: RecruitmentServiceDialogProps) {
  const [features, setFeatures] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      serviceType: 'shortlisting',
      pricingModel: 'flat',
      baseFee: 0,
      percentageFee: 0,
      minFee: 0,
      maxFee: 0,
      estimatedDuration: '',
      status: 'active',
    },
  });

  const pricingModel = form.watch('pricingModel');

  useEffect(() => {
    if (open) {
      if (service) {
        form.reset({
          name: service.name,
          description: service.description,
          serviceType: service.serviceType,
          pricingModel: service.pricingModel,
          baseFee: service.baseFee,
          percentageFee: service.percentageFee || 0,
          minFee: service.minFee || 0,
          maxFee: service.maxFee || 0,
          estimatedDuration: service.estimatedDuration || '',
          status: service.status,
        });
        setFeatures(service.features);
      } else {
        form.reset({
          name: '',
          description: '',
          serviceType: 'shortlisting',
          pricingModel: 'flat',
          baseFee: 0,
          percentageFee: 0,
          minFee: 0,
          maxFee: 0,
          estimatedDuration: '',
          status: 'active',
        });
        setFeatures([]);
      }
    }
  }, [open, service, form]);

  const handleSubmit = (data: FormData) => {
    const serviceData: Omit<RecruitmentService, 'id' | 'createdAt' | 'updatedAt'> = {
      name: data.name,
      description: data.description,
      serviceType: data.serviceType,
      pricingModel: data.pricingModel,
      baseFee: data.baseFee,
      percentageFee: data.percentageFee || undefined,
      minFee: data.minFee || undefined,
      maxFee: data.maxFee || undefined,
      estimatedDuration: data.estimatedDuration || undefined,
      features,
      status: data.status,
    };

    try {
      if (service) {
        updateRecruitmentService(service.id, serviceData);
        toast({
          title: 'Recruitment service updated',
          description: 'The recruitment service has been updated successfully.',
        });
      } else {
        createRecruitmentService(serviceData);
        toast({
          title: 'Recruitment service created',
          description: 'The recruitment service has been created successfully.',
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save recruitment service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Recruitment Service' : 'Create Recruitment Service'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormInput form={form} name="name" label="Service Name" placeholder="e.g., Executive Search Premium" required />
            <FormTextarea form={form} name="description" label="Description" placeholder="Describe the recruitment service..." rows={3} required />
            
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                form={form}
                name="serviceType"
                label="Service Type"
                options={[
                  { value: 'shortlisting', label: 'Shortlisting' },
                  { value: 'full-service', label: 'Full Service' },
                  { value: 'executive-search', label: 'Executive Search' },
                  { value: 'rpo', label: 'RPO' },
                ]}
                required
              />
              <FormSelect
                form={form}
                name="pricingModel"
                label="Pricing Model"
                options={[
                  { value: 'flat', label: 'Flat Rate' },
                  { value: 'percentage', label: 'Percentage' },
                  { value: 'tiered', label: 'Tiered' },
                  { value: 'per_use', label: 'Per Use' },
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput form={form} name="baseFee" label="Base Fee (£)" type="number" required />
              {(pricingModel === 'percentage' || pricingModel === 'tiered') && (
                <FormInput form={form} name="percentageFee" label="Percentage Fee (%)" type="number" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput form={form} name="minFee" label="Minimum Fee (£)" type="number" />
              <FormInput form={form} name="maxFee" label="Maximum Fee (£)" type="number" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput form={form} name="estimatedDuration" label="Estimated Duration" placeholder="e.g., 4-6 weeks" />
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
            </div>

            <ATSFeatureManager features={features} onChange={setFeatures} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Recruitment Service</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
