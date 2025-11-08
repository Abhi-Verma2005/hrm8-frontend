import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { EmployeePersonalInfoStep } from './forms/EmployeePersonalInfoStep';
import { EmployeeJobDetailsStep } from './forms/EmployeeJobDetailsStep';
import { EmployeeContactInfoStep } from './forms/EmployeeContactInfoStep';
import { EmployeeCompensationStep } from './forms/EmployeeCompensationStep';
import { employeeWizardSchema, employeeStepFields, type EmployeeWizardFormData } from '@/lib/validations';

type EmployeeFormData = EmployeeWizardFormData;

const STEPS = [
  { title: 'Personal Info', component: EmployeePersonalInfoStep },
  { title: 'Job Details', component: EmployeeJobDetailsStep },
  { title: 'Contact', component: EmployeeContactInfoStep },
  { title: 'Compensation', component: EmployeeCompensationStep },
];

interface EmployeeFormWizardProps {
  employee?: Employee;
  onSave: (data: Partial<Employee>) => Promise<void>;
  onCancel: () => void;
}

export function EmployeeFormWizard({ employee, onSave, onCancel }: EmployeeFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeWizardSchema),
    defaultValues: {
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      dateOfBirth: employee?.dateOfBirth || '',
      gender: employee?.gender || 'prefer-not-to-say',
      jobTitle: employee?.jobTitle || '',
      department: employee?.department || '',
      location: employee?.location || '',
      employmentType: employee?.employmentType || 'full-time',
      status: employee?.status || 'active',
      hireDate: employee?.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
      startDate: employee?.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : '',
      address: employee?.address || '',
      city: employee?.city || '',
      state: employee?.state || '',
      postalCode: employee?.postalCode || '',
      country: employee?.country || 'United States',
      emergencyContactName: employee?.emergencyContactName || '',
      emergencyContactPhone: employee?.emergencyContactPhone || '',
      emergencyContactRelationship: employee?.emergencyContactRelationship || '',
      salary: employee?.salary || 0,
      currency: employee?.currency || 'USD',
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

  const getCurrentStepFields = (): (keyof EmployeeFormData)[] => {
    switch (currentStep) {
      case 0:
        return [...employeeStepFields.personalInfo];
      case 1:
        return [...employeeStepFields.jobDetails];
      case 2:
        return [...employeeStepFields.contactInfo];
      case 3:
        return [...employeeStepFields.compensation];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const values = form.getValues();
      
      const employeeData: Partial<Employee> = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        jobTitle: values.jobTitle,
        department: values.department,
        location: values.location,
        employmentType: values.employmentType,
        status: values.status,
        hireDate: new Date(values.hireDate).toISOString(),
        startDate: values.startDate ? new Date(values.startDate).toISOString() : new Date(values.hireDate).toISOString(),
        address: values.address,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
        emergencyContactName: values.emergencyContactName,
        emergencyContactPhone: values.emergencyContactPhone,
        emergencyContactRelationship: values.emergencyContactRelationship,
        salary: values.salary,
        currency: values.currency,
        // Initialize defaults for new employees
        payFrequency: employee?.payFrequency || 'annually',
        skills: employee?.skills || [],
        certifications: employee?.certifications || [],
        notes: employee?.notes || "",
        customFields: employee?.customFields || {},
      };

      await onSave(employeeData);
      toast.success(employee ? 'Employee updated successfully' : 'Employee created successfully');
    } catch (error) {
      toast.error('Failed to save employee');
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
                    Save Employee
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
