import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JobFormData } from '@/types/job';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { TermsAndConditions } from './TermsAndConditions';
import { calculateTotalJobCost } from '@/lib/paymentService';
import { DollarSign, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RECRUITMENT_SERVICES } from '@/lib/subscriptionConfig';

interface JobWizardStep6Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep6({ form }: JobWizardStep6Props) {
  const formData = form.watch();
  
  const [termsAccepted, setTermsAccepted] = useState(formData.termsAccepted || false);
  
  const isSelfManaged = formData.serviceType === 'self-managed' || formData.serviceType === 'rpo';
  
  const costBreakdown = calculateTotalJobCost(
    formData.employerId,
    formData.serviceType,
    { min: formData.salaryMin || 0, max: formData.salaryMax || 0 }
  );

  const serviceName = RECRUITMENT_SERVICES[formData.serviceType as keyof typeof RECRUITMENT_SERVICES]?.name || '';
  
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
          {costBreakdown.totalUpfront > 0 ? 'Payment & Terms' : 'Review & Confirm'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {costBreakdown.totalUpfront > 0 
            ? 'Review costs and complete payment to publish your job posting'
            : 'Review and accept the terms to publish your job posting'}
        </p>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Posting Cost */}
          <div className="flex justify-between items-center pb-3 border-b">
            <div>
              <p className="font-medium">Job Posting</p>
              <p className="text-sm text-muted-foreground">
                {costBreakdown.jobPostingCost === 0 
                  ? 'Included in your plan' 
                  : '30-day HRM8 posting'}
              </p>
            </div>
            <p className="text-lg font-semibold">
              {costBreakdown.jobPostingCost === 0 ? 'FREE' : `$${costBreakdown.jobPostingCost}`}
            </p>
          </div>

          {/* Recruitment Service Cost (if not self-managed) */}
          {!isSelfManaged && costBreakdown.recruitmentServiceCost > 0 && (
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-medium">Recruitment Service</p>
                <p className="text-sm text-muted-foreground">
                  {serviceName} - Upfront payment (50%)
                </p>
              </div>
              <p className="text-lg font-semibold">
                ${costBreakdown.upfrontRecruitmentCost}
              </p>
            </div>
          )}

          {/* Total Due Now */}
          <div className="flex justify-between items-center pt-3">
            <p className="text-lg font-semibold">Total Due Now</p>
            <p className="text-2xl font-bold text-primary">
              {costBreakdown.totalUpfront === 0 ? 'FREE' : `$${costBreakdown.totalUpfront}`}
            </p>
          </div>

          {/* Balance on Completion (if applicable) */}
          {costBreakdown.balanceRecruitmentCost > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Balance of ${costBreakdown.balanceRecruitmentCost} due upon successful hire
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Payment Method (only if totalUpfront > 0) */}
      {costBreakdown.totalUpfront > 0 && (
        <PaymentMethodSelector
          employerId={formData.employerId}
          amount={costBreakdown.totalUpfront}
          selectedMethod={formData.selectedPaymentMethod}
          onMethodSelect={handlePaymentMethodSelect}
        />
      )}
      
      <TermsAndConditions
        accepted={termsAccepted}
        onAcceptChange={handleTermsAcceptChange}
        required={true}
      />
      
      {isSelfManaged && costBreakdown.jobPostingCost === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Free Job Posting</AlertTitle>
          <AlertDescription>
            Your job will be posted to HRM8 at no cost. After publishing, you'll have the option to promote to external job boards.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
