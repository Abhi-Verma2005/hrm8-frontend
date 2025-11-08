import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { toast } from 'sonner';
import { ConsultantBasicInfoStep } from './forms/ConsultantBasicInfoStep';
import { ConsultantProfessionalStep } from './forms/ConsultantProfessionalStep';
import { ConsultantCapacityStep } from './forms/ConsultantCapacityStep';

const consultantFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  photo: z.string().optional(),
  
  type: z.enum(['sales-rep', 'recruiter', '360-consultant', 'industry-partner']),
  status: z.enum(['active', 'on-leave', 'inactive', 'suspended']),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'freelance']),
  
  title: z.string().optional(),
  specialization: z.array(z.string()).min(1, 'At least one specialization is required'),
  yearsOfExperience: z.number().min(0),
  bio: z.string().optional(),
  
  location: z.string().min(1, 'Location is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  
  maxEmployers: z.number().min(1),
  maxJobs: z.number().min(1),
  
  commissionStructure: z.enum(['percentage', 'flat', 'tiered', 'custom']),
  defaultCommissionRate: z.number().min(0).max(100).optional(),
  
  linkedInUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
});

type ConsultantFormData = z.infer<typeof consultantFormSchema>;

const STEPS = [
  { title: 'Basic Info', component: ConsultantBasicInfoStep },
  { title: 'Professional', component: ConsultantProfessionalStep },
  { title: 'Capacity', component: ConsultantCapacityStep },
];

interface ConsultantFormWizardProps {
  consultant?: Consultant;
  onSave: (data: Partial<Consultant>) => Promise<void>;
  onCancel: () => void;
}

export function ConsultantFormWizard({ consultant, onSave, onCancel }: ConsultantFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantFormSchema),
    defaultValues: {
      firstName: consultant?.firstName || '',
      lastName: consultant?.lastName || '',
      email: consultant?.email || '',
      phone: consultant?.phone || '',
      photo: consultant?.photo || '',
      type: consultant?.type || 'recruiter',
      status: consultant?.status || 'active',
      employmentType: consultant?.employmentType || 'full-time',
      title: consultant?.title || '',
      specialization: consultant?.specialization || [],
      yearsOfExperience: consultant?.yearsOfExperience || 0,
      bio: consultant?.bio || '',
      location: consultant?.location || '',
      city: consultant?.city || '',
      state: consultant?.state || '',
      country: consultant?.country || 'United States',
      maxEmployers: consultant?.maxEmployers || 10,
      maxJobs: consultant?.maxJobs || 15,
      commissionStructure: consultant?.commissionStructure || 'percentage',
      defaultCommissionRate: consultant?.defaultCommissionRate || 0,
      linkedInUrl: consultant?.linkedInUrl || '',
      portfolioUrl: consultant?.portfolioUrl || '',
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

  const getCurrentStepFields = (): (keyof ConsultantFormData)[] => {
    switch (currentStep) {
      case 0:
        return ['firstName', 'lastName', 'email', 'phone', 'location', 'city', 'state', 'country'];
      case 1:
        return ['type', 'status', 'employmentType', 'specialization', 'yearsOfExperience'];
      case 2:
        return ['maxEmployers', 'maxJobs', 'commissionStructure'];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const values = form.getValues();
      
      const consultantData: Partial<Consultant> = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        photo: values.photo,
        type: values.type,
        status: values.status,
        employmentType: values.employmentType,
        title: values.title,
        specialization: values.specialization,
        yearsOfExperience: values.yearsOfExperience,
        bio: values.bio,
        location: values.location,
        city: values.city,
        state: values.state,
        country: values.country,
        maxEmployers: values.maxEmployers,
        maxJobs: values.maxJobs,
        commissionStructure: values.commissionStructure,
        defaultCommissionRate: values.defaultCommissionRate,
        linkedInUrl: values.linkedInUrl,
        portfolioUrl: values.portfolioUrl,
        // Initialize defaults for new consultants
        currentEmployers: consultant?.currentEmployers || 0,
        currentJobs: consultant?.currentJobs || 0,
        totalPlacements: consultant?.totalPlacements || 0,
        totalRevenue: consultant?.totalRevenue || 0,
        successRate: consultant?.successRate || 0,
        averageDaysToFill: consultant?.averageDaysToFill || 0,
        totalCommissionsPaid: consultant?.totalCommissionsPaid || 0,
        pendingCommissions: consultant?.pendingCommissions || 0,
        assignedEmployers: consultant?.assignedEmployers || [],
        assignedJobs: consultant?.assignedJobs || [],
        tags: consultant?.tags || [],
        emailNotifications: consultant?.emailNotifications ?? true,
        smsNotifications: consultant?.smsNotifications ?? false,
      };

      await onSave(consultantData);
      toast.success(consultant ? 'Consultant updated successfully' : 'Consultant created successfully');
    } catch (error) {
      toast.error('Failed to save consultant');
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
                    Save Consultant
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
