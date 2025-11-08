import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Employer } from '@/types/entities';
import { toast } from 'sonner';
import { EmployerBasicInfoStep } from './forms/EmployerBasicInfoStep';
import { EmployerAccountStep } from './forms/EmployerAccountStep';
import { EmployerSubscriptionStep } from './forms/EmployerSubscriptionStep';

const employerFormSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  location: z.string().min(1, 'Location is required'),
  companySize: z.string().optional(),
  description: z.string().optional(),
  
  accountType: z.enum(['approved', 'payg']),
  status: z.enum(['active', 'inactive', 'pending', 'trial', 'expired']),
  creditLimit: z.number().optional(),
  paymentTerms: z.string().optional(),
  
  subscriptionTier: z.enum(['ats-lite', 'payg', 'small', 'medium', 'large', 'enterprise']),
  maxOpenJobs: z.number().min(1),
  maxUsers: z.number().min(1),
  monthlySubscriptionFee: z.number().min(0).optional(),
});

type EmployerFormData = z.infer<typeof employerFormSchema>;

const STEPS = [
  { title: 'Company Info', component: EmployerBasicInfoStep },
  { title: 'Account Setup', component: EmployerAccountStep },
  { title: 'Subscription', component: EmployerSubscriptionStep },
];

interface EmployerFormWizardProps {
  employer?: Employer;
  onSave: (data: Partial<Employer>) => Promise<void>;
  onCancel: () => void;
}

export function EmployerFormWizard({ employer, onSave, onCancel }: EmployerFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EmployerFormData>({
    resolver: zodResolver(employerFormSchema),
    defaultValues: {
      name: employer?.name || '',
      email: employer?.email || '',
      website: employer?.website || '',
      industry: employer?.industry || '',
      location: employer?.location || '',
      companySize: employer?.companySize || '',
      description: employer?.description || '',
      accountType: employer?.accountType || 'payg',
      status: employer?.status || 'pending',
      creditLimit: employer?.creditLimit || 0,
      paymentTerms: employer?.paymentTerms || 'Net 30',
      subscriptionTier: employer?.subscriptionTier || 'ats-lite',
      maxOpenJobs: employer?.maxOpenJobs || 3,
      maxUsers: employer?.maxUsers || 1,
      monthlySubscriptionFee: employer?.monthlySubscriptionFee || 0,
    },
  });

  const CurrentStepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = async () => {
    const currentFields = getCurrentStepFields();
    const isValid = await form.trigger(currentFields);
    
    if (isValid) {
      if (isLastStep) {
        await handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const getCurrentStepFields = (): (keyof EmployerFormData)[] => {
    switch (currentStep) {
      case 0:
        return ['name', 'email', 'website', 'industry', 'location'];
      case 1:
        return ['accountType', 'status'];
      case 2:
        return ['subscriptionTier', 'maxOpenJobs', 'maxUsers'];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const values = form.getValues();
      
      const employerData: Partial<Employer> = {
        name: values.name,
        email: values.email || undefined,
        website: values.website,
        industry: values.industry,
        location: values.location,
        companySize: values.companySize,
        description: values.description,
        accountType: values.accountType,
        status: values.status,
        creditLimit: values.creditLimit,
        paymentTerms: values.paymentTerms,
        subscriptionTier: values.subscriptionTier,
        maxOpenJobs: values.maxOpenJobs,
        maxUsers: values.maxUsers,
        monthlySubscriptionFee: values.monthlySubscriptionFee,
        // Initialize defaults for new employers
        activeJobs: employer?.activeJobs || 0,
        currentOpenJobs: employer?.currentOpenJobs || 0,
        currentUsers: employer?.currentUsers || 0,
        activeJobCount: employer?.activeJobCount || 0,
        userCount: employer?.userCount || 0,
        totalJobsPosted: employer?.totalJobsPosted || 0,
        lastContact: employer?.lastContact || new Date(),
      };

      await onSave(employerData);
      toast.success(employer ? 'Employer updated successfully' : 'Employer created successfully');
    } catch (error) {
      toast.error('Failed to save employer');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
            </h3>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Form Content */}
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <CurrentStepComponent form={form} />
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 0 ? onCancel : handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentStep === 0 ? 'Cancel' : 'Back'}
              </Button>

              <Button
                type="button"
                onClick={handleNext}
                disabled={isSaving}
              >
                {isSaving ? (
                  'Saving...'
                ) : isLastStep ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Employer
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
