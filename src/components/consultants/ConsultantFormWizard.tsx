import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Consultant } from '@/types/consultant';
import { toast } from 'sonner';
import { ConsultantBasicInfoStep } from './forms/ConsultantBasicInfoStep';
import { ConsultantProfessionalStep } from './forms/ConsultantProfessionalStep';
import { ConsultantCapacityStep } from './forms/ConsultantCapacityStep';
import { consultantWizardSchema, consultantStepFields, type ConsultantWizardFormData } from '@/lib/validations';
import { FormWizard, WizardStep } from '@/components/common/FormWizard';

const STEPS: WizardStep<ConsultantWizardFormData>[] = [
  { title: 'Basic Info', component: ConsultantBasicInfoStep, fields: consultantStepFields.basicInfo },
  { title: 'Professional', component: ConsultantProfessionalStep, fields: consultantStepFields.professional },
  { title: 'Capacity', component: ConsultantCapacityStep, fields: consultantStepFields.capacity },
];

interface ConsultantFormWizardProps {
  consultant?: Consultant;
  onSave: (data: Partial<Consultant>) => Promise<void>;
  onCancel: () => void;
}

export function ConsultantFormWizard({ consultant, onSave, onCancel }: ConsultantFormWizardProps) {
  const form = useForm<ConsultantWizardFormData>({
    resolver: zodResolver(consultantWizardSchema),
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

  const handleSave = async () => {
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
  };

  return (
    <FormWizard
      steps={STEPS}
      form={form}
      onSave={handleSave}
      onCancel={onCancel}
      entityName="Consultant"
      entityId={consultant?.id}
      enableAutosave={true}
    />
  );
}
