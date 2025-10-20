import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JobFormData } from '@/types/job';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { TermsAndConditions } from './TermsAndConditions';
import { calculateServicePricing } from '@/lib/paymentService';
import { DollarSign, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface JobWizardStep6Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep6({ form }: JobWizardStep6Props) {
  const formData = form.watch();
  
  const [termsAccepted, setTermsAccepted] = useState(formData.termsAccepted || false);
  
  const isSelfManaged = formData.serviceType === 'self-managed' || formData.serviceType === 'rpo';
  const requiresPayment = !isSelfManaged;
  
  const pricing = calculateServicePricing(
    formData.serviceType,
    { min: formData.salaryMin || 0, max: formData.salaryMax || 0 }
  );
  
  const handlePaymentMethodSelect = (method: 'account' | 'credit_card', invoiceRequested?: boolean) => {
    form.setValue('selectedPaymentMethod', method);
    form.setValue('paymentInvoiceRequested', invoiceRequested);
  };
  
  const handleTermsAcceptChange = (accepted: boolean) => {
    setTermsAccepted(accepted);
    form.setValue('termsAccepted', accepted);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {isSelfManaged ? 'Terms & Conditions' : 'Payment & Terms'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isSelfManaged 
            ? 'Review and accept the terms to publish your job posting'
            : 'Complete payment and accept the terms to proceed'}
        </p>
      </div>
      
      {requiresPayment && pricing.totalUpfront > 0 && (
        <PaymentMethodSelector
          employerId={formData.employerId}
          amount={pricing.totalUpfront}
          selectedMethod={formData.selectedPaymentMethod}
          onMethodSelect={handlePaymentMethodSelect}
        />
      )}
      
      <TermsAndConditions
        accepted={termsAccepted}
        onAcceptChange={handleTermsAcceptChange}
        required={true}
      />
      
      {isSelfManaged && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Free HRM8 Posting</AlertTitle>
          <AlertDescription>
            Your job will be posted to HRM8 at no cost. After publishing, you'll have the option to promote to external job boards via JobTarget.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
