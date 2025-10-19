import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JobFormData } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { JobTargetPromotionOptIn } from './JobTargetPromotionOptIn';
import { JobBoardBudgetSelector } from './JobBoardBudgetSelector';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { TermsAndConditions } from './TermsAndConditions';
import { calculateServicePricing } from '@/lib/paymentService';
import { DollarSign, Briefcase, Megaphone, AlertCircle } from 'lucide-react';
import { JOBTARGET_BUDGET_TIERS } from '@/types/billing';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface JobWizardStep6Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep6({ form }: JobWizardStep6Props) {
  const formData = form.watch();
  
  const [promotionEnabled, setPromotionEnabled] = useState(
    formData.includeJobTargetPromotion ?? (formData.serviceType !== 'self-managed')
  );
  const [selectedTier, setSelectedTier] = useState<string>(
    formData.jobTargetBudgetTier || (formData.serviceType === 'self-managed' ? 'none' : 'standard')
  );
  const [customAmount, setCustomAmount] = useState<number>(formData.jobTargetBudgetCustom || 0);
  const [termsAccepted, setTermsAccepted] = useState(formData.termsAccepted || false);
  
  const isSelfManaged = formData.serviceType === 'self-managed';
  const requiresPayment = !isSelfManaged || (promotionEnabled && selectedTier !== 'none');
  
  const jobTargetBudget = !promotionEnabled || selectedTier === 'none'
    ? 0
    : selectedTier === 'custom'
    ? customAmount
    : JOBTARGET_BUDGET_TIERS.find(t => t.id === selectedTier)?.amount || 0;
  
  const pricing = calculateServicePricing(
    formData.serviceType,
    jobTargetBudget,
    { min: formData.salaryMin || 0, max: formData.salaryMax || 0 }
  );
  
  const handlePromotionToggle = (enabled: boolean) => {
    setPromotionEnabled(enabled);
    form.setValue('includeJobTargetPromotion', enabled);
    if (!enabled) {
      setSelectedTier('none');
      form.setValue('jobTargetBudgetTier', 'none');
    } else {
      setSelectedTier('standard');
      form.setValue('jobTargetBudgetTier', 'standard');
    }
  };
  
  const handleTierChange = (tier: string) => {
    setSelectedTier(tier);
    form.setValue('jobTargetBudgetTier', tier as any);
  };
  
  const handleCustomAmountChange = (amount: number) => {
    setCustomAmount(amount);
    form.setValue('jobTargetBudgetCustom', amount);
  };
  
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
          {isSelfManaged ? 'Job Board Promotion & Payment' : 'Budget Allocation & Payment'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isSelfManaged 
            ? 'Maximize your reach by promoting to external job boards'
            : 'Allocate promotion budget and complete payment'}
        </p>
      </div>
      
      <JobTargetPromotionOptIn
        enabled={promotionEnabled}
        onToggle={handlePromotionToggle}
        serviceType={formData.serviceType}
      />
      
      {promotionEnabled && (
        <>
          <Separator />
          <JobBoardBudgetSelector
            selectedTier={selectedTier}
            customAmount={customAmount}
            onTierChange={handleTierChange}
            onCustomAmountChange={handleCustomAmountChange}
            serviceType={formData.serviceType}
          />
        </>
      )}
      
      {requiresPayment && pricing.totalUpfront > 0 && (
        <>
          <Separator />
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h4 className="font-semibold">Payment Breakdown</h4>
              
              <div className="space-y-2">
                {!isSelfManaged && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Recruitment Service Fee (50% upfront)
                    </span>
                    <span className="font-medium">
                      ${(pricing.baseFee * pricing.upfrontPercentage).toLocaleString()}
                    </span>
                  </div>
                )}
                
                {jobTargetBudget > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Megaphone className="h-4 w-4" />
                      Job Board Promotion Budget (100% upfront)
                    </span>
                    <span className="font-medium">
                      ${jobTargetBudget.toLocaleString()}
                    </span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Due Now</span>
                  <span className="text-primary">
                    ${pricing.totalUpfront.toLocaleString()}
                  </span>
                </div>
                
                {!isSelfManaged && pricing.balanceOnCompletion > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Balance Due on Completion</span>
                    <span>${pricing.balanceOnCompletion.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-semibold">Select Payment Method</h4>
            <PaymentMethodSelector
              employerId={formData.employerId}
              amount={pricing.totalUpfront}
              selectedMethod={formData.selectedPaymentMethod}
              onMethodSelect={handlePaymentMethodSelect}
            />
          </div>
          
          <Separator />
        </>
      )}
      
      <TermsAndConditions
        accepted={termsAccepted}
        onAcceptChange={handleTermsAcceptChange}
        required={true}
      />
      
      {isSelfManaged && !promotionEnabled && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Payment Required</AlertTitle>
          <AlertDescription>
            Your job will be posted to HRM8 for free. You can add JobTarget promotion later from the job detail page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
