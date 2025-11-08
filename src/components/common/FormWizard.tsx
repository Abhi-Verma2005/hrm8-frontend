import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export interface WizardStep<TFormData> {
  title: string;
  component: React.ComponentType<{ form: UseFormReturn<TFormData> }>;
  fields: (keyof TFormData)[];
}

interface FormWizardProps<TFormData extends Record<string, any>> {
  steps: WizardStep<TFormData>[];
  form: UseFormReturn<TFormData>;
  onSave: () => Promise<void>;
  onCancel: () => void;
  entityName: string;
}

export function FormWizard<TFormData extends Record<string, any>>({
  steps,
  form,
  onSave,
  onCancel,
  entityName,
}: FormWizardProps<TFormData>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    const currentFields = steps[currentStep].fields;
    const isValid = await form.trigger(currentFields as any);
    
    if (isValid) {
      if (isLastStep) {
        await handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
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
                    Save {entityName}
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
