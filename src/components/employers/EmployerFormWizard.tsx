import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Employer } from '@/types/entities';
import { toast } from 'sonner';
import { EmployerBasicInfoStep } from './forms/EmployerBasicInfoStep';
import { EmployerAccountStep } from './forms/EmployerAccountStep';
import { EmployerSubscriptionStep } from './forms/EmployerSubscriptionStep';
import { employerWizardSchema, employerStepFields, type EmployerWizardFormData } from '@/lib/validations';
import { FormWizard, WizardStep } from '@/components/common/FormWizard';

const STEPS: WizardStep<EmployerWizardFormData>[] = [
  { title: 'Company Info', component: EmployerBasicInfoStep, fields: employerStepFields.companyInfo },
  { title: 'Account Setup', component: EmployerAccountStep, fields: employerStepFields.accountSetup },
  { title: 'Subscription', component: EmployerSubscriptionStep, fields: employerStepFields.subscription },
];

interface EmployerFormWizardProps {
  employer?: Employer;
  onSave: (data: Partial<Employer>) => Promise<void>;
  onCancel: () => void;
}

export function EmployerFormWizard({ employer, onSave, onCancel }: EmployerFormWizardProps) {
  const form = useForm<EmployerWizardFormData>({
    resolver: zodResolver(employerWizardSchema),
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

  const handleSave = async () => {
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
  };

  return (
    <FormWizard
      steps={STEPS}
      form={form}
      onSave={handleSave}
      onCancel={onCancel}
      entityName="Employer"
      entityId={employer?.id}
      enableAutosave={true}
    />
  );
}
