import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, JobFormData } from "@/types/job";
import { jobFormSchema } from "@/lib/validations/jobValidation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { JobWizardStep1 } from "./JobWizardStep1";
import { JobWizardStep2 } from "./JobWizardStep2";
import { JobWizardStep3 } from "./JobWizardStep3";
import { JobWizardStep4 } from "./JobWizardStep4";
import { JobWizardStep5 } from "./JobWizardStep5";
import { JobWizardStep6 } from "./JobWizardStep6";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { JobBoardPublicPreview } from "./JobBoardPublicPreview";
import { toast } from "@/hooks/use-toast";
import { saveJob } from "@/lib/mockJobStorage";
import { generateJobCode } from "@/lib/jobUtils";
import { getEmployerById } from "@/lib/employerService";
import { calculateServicePricing, processAccountPayment, processCreditCardPayment } from "@/lib/paymentService";
import { JOBTARGET_BUDGET_TIERS } from "@/types/billing";


interface JobWizardProps {
  serviceType: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | 'rpo';
  defaultValues?: Partial<JobFormData>;
  jobId?: string;
  onSuccess?: (jobData: Job) => void;
  onCancel?: () => void;
  embedded?: boolean;
}

export function JobWizard({ serviceType, defaultValues, jobId, onSuccess, onCancel, embedded = false }: JobWizardProps) {
  const [step, setStep] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const findScrollContainer = (): HTMLElement | null => {
    const scrollAreaViewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (scrollAreaViewport) {
      return scrollAreaViewport;
    }
    return document.getElementById('main-scroll-container');
  };
  
  useEffect(() => {
    const scrollContainer = findScrollContainer();
    
    if (scrollContainer) {
      // Synchronous scroll reset
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
      
      // Force browser to acknowledge
      void scrollContainer.offsetHeight;
      
      // Double-check with RAF
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = 0;
        scrollContainer.scrollLeft = 0;
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [step]);
  
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      serviceType,
      postAsHRM8: false,
      employerId: "",
      title: "",
      department: "",
      location: "",
      employmentType: "full-time",
      experienceLevel: "mid",
      workArrangement: "on-site",
      tags: [],
      description: "",
      requirements: [],
      responsibilities: [],
      salaryCurrency: "USD",
      salaryPeriod: "annual",
      hideSalary: false,
      visibility: "public",
      stealth: false,
      hiringTeam: [],
      applicationForm: {
        id: `form-${Date.now()}`,
        name: "Application Form",
        questions: [],
        includeStandardFields: {
          resume: { included: true, required: true },
          coverLetter: { included: false, required: false },
          portfolio: { included: false, required: false },
          linkedIn: { included: false, required: false },
          website: { included: false, required: false },
        },
      },
      status: "draft",
      jobBoardDistribution: ["HRM8 Job Board"],
      ...defaultValues,
    },
  });

  const isHRM8Service = serviceType !== 'self-managed';
  const totalSteps = isHRM8Service ? 1 : 6;
  const progress = (step / totalSteps) * 100;

  const onSubmit = async (data: JobFormData) => {
    if (!data.termsAccepted) {
      toast({
        title: "Terms & Conditions Required",
        description: "Please accept the Terms & Conditions to proceed",
        variant: "destructive"
      });
      return;
    }
    
    let employerData;
    
    if (data.postAsHRM8) {
      employerData = {
        employerId: "hrm8-platform",
        employerName: "HRM8",
        employerLogo: "/logo-light.png",
      };
    } else {
      const selectedEmployer = getEmployerById(data.employerId);
      employerData = {
        employerId: data.employerId,
        employerName: selectedEmployer?.name || "Unknown Employer",
        employerLogo: selectedEmployer?.logo,
      };
    }
    
    const isSelfManaged = data.serviceType === 'self-managed' || data.serviceType === 'rpo';
    const hasJobTargetPromotion = data.includeJobTargetPromotion && data.jobTargetBudgetTier !== 'none';
    
    const jobTargetBudget = !hasJobTargetPromotion
      ? 0
      : data.jobTargetBudgetTier === 'custom'
      ? data.jobTargetBudgetCustom || 0
      : JOBTARGET_BUDGET_TIERS.find(t => t.id === data.jobTargetBudgetTier)?.amount || 0;
    
    const requiresPayment = !isSelfManaged || jobTargetBudget > 0;
    
    const jobData: Job = {
      id: jobId || `job-${Date.now()}`,
      ...data,
      ...employerData,
      createdBy: "admin-user-id",
      createdByName: "HRM8 Admin",
      jobCode: generateJobCode(),
      aiGeneratedDescription: false,
      serviceType: data.serviceType,
      applicantsCount: 0,
      viewsCount: 0,
      postingDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hasJobTargetPromotion,
      jobTargetBudget,
      jobTargetBudgetRemaining: jobTargetBudget,
      requiresPayment,
      termsAccepted: data.termsAccepted,
      termsAcceptedAt: new Date(),
      termsAcceptedBy: 'current-user-id',
    };
    
    if (requiresPayment && jobTargetBudget > 0) {
      const pricing = calculateServicePricing(
        data.serviceType,
        jobTargetBudget,
        { min: data.salaryMin || 0, max: data.salaryMax || 0 }
      );
      
      let paymentResult;
      
      if (data.selectedPaymentMethod === 'account') {
        paymentResult = await processAccountPayment(
          jobData.id,
          data.employerId,
          pricing,
          data.paymentInvoiceRequested || false
        );
        
        if (paymentResult.error === 'INVOICE_REQUESTED') {
          jobData.paymentId = paymentResult.paymentId;
          jobData.paymentStatus = 'pending';
          
          saveJob(jobData);
          
          toast({
            title: "Invoice Request Submitted",
            description: "Your job has been saved as a draft. Services will begin once payment is received.",
          });
          
          if (onSuccess) {
            onSuccess(jobData);
          }
          return;
        }
      } else if (data.selectedPaymentMethod === 'credit_card') {
        const mockPaymentIntentId = `pi_mock_${Date.now()}`;
        paymentResult = await processCreditCardPayment(
          jobData.id,
          data.employerId,
          pricing,
          mockPaymentIntentId
        );
      }
      
      if (!paymentResult || !paymentResult.success) {
        toast({
          title: "Payment Failed",
          description: paymentResult?.error || "Payment processing failed",
          variant: "destructive"
        });
        return;
      }
      
      jobData.paymentId = paymentResult.paymentId;
      jobData.paymentStatus = 'paid';
    }

    saveJob(jobData);
    
    const successTitle = requiresPayment
      ? isSelfManaged
        ? "Job Posted & Payment Processed"
        : "Payment Processed & Job Created"
      : "Job Posted Successfully";
    
    const successDescription = requiresPayment
      ? isSelfManaged
        ? `Your job is now live on HRM8${hasJobTargetPromotion ? ' and will be promoted to external job boards' : ''}`
        : "Your recruitment service request has been submitted and payment processed"
      : "Your job is now live on HRM8";
    
    toast({
      title: successTitle,
      description: successDescription,
    });
    
    if (onSuccess) {
      onSuccess(jobData);
    }
  };

  const nextStep = () => {
    const scrollContainer = findScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
    }
    setStep(Math.min(step + 1, totalSteps));
  };
  
  const prevStep = () => {
    const scrollContainer = findScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
    }
    setStep(Math.max(step - 1, 1));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {step === 1 && <JobWizardStep1 form={form} />}
        {step === 2 && !isHRM8Service && <JobWizardStep2 form={form} />}
        {!isHRM8Service && step === 3 && <JobWizardStep3 form={form} />}
        {!isHRM8Service && step === 4 && <JobWizardStep4 form={form} />}
        {!isHRM8Service && step === 5 && <JobWizardStep5 form={form} />}
        {!isHRM8Service && step === 6 && <JobWizardStep6 form={form} />}

        <div className="flex justify-between pt-6 border-t">
          <div className="flex gap-2">
            {step === 1 && embedded && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex gap-2">
            {step === 2 && !isHRM8Service && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Job Board
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => {
              form.setValue("status", "draft");
              form.handleSubmit(onSubmit)();
            }}>
              Save as Draft
            </Button>
            {step < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={!form.watch('termsAccepted')}
              >
                {(() => {
                  const formData = form.watch();
                  const isSelfManagedJob = formData.serviceType === 'self-managed' || formData.serviceType === 'rpo';
                  const hasPromotion = formData.includeJobTargetPromotion && formData.jobTargetBudgetTier !== 'none';
                  const needsPayment = !isSelfManagedJob || hasPromotion;
                  
                  if (isHRM8Service) return 'Submit Request';
                  if (!needsPayment) return 'Publish Job';
                  if (formData.selectedPaymentMethod === 'account') {
                    return formData.paymentInvoiceRequested ? 'Request Invoice & Submit' : 'Approve & Publish';
                  }
                  return 'Pay & Publish';
                })()}
              </Button>
            )}
          </div>
        </div>

        <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
          <SheetContent 
            side="right" 
            className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto p-0"
          >
            <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
              <SheetHeader>
                <SheetTitle>Job Board Preview</SheetTitle>
                <SheetDescription>
                  This is how your job posting will appear to candidates on the job board
                </SheetDescription>
              </SheetHeader>
            </div>
            <div className="p-6">
              <JobBoardPublicPreview formData={form.watch()} />
            </div>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  );
}
