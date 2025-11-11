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
import { ChevronLeft, ChevronRight, Eye, Briefcase, Users, Star, Crown, ArrowUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { JobBoardPublicPreview } from "./JobBoardPublicPreview";
import { ExternalPromotionDialog } from "./ExternalPromotionDialog";
import { toast } from "@/hooks/use-toast";
import { saveJob } from "@/lib/mockJobStorage";
import { generateJobCode } from "@/lib/jobUtils";
import { getEmployerById } from "@/lib/employerService";
import { calculateServicePricing, processAccountPayment, processCreditCardPayment } from "@/lib/paymentService";
import { cn } from "@/lib/utils";


interface JobWizardProps {
  serviceType?: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | 'rpo';
  defaultValues?: Partial<JobFormData>;
  jobId?: string;
  onSuccess?: (jobData: Job) => void;
  onCancel?: () => void;
  embedded?: boolean;
}

export function JobWizard({ serviceType, defaultValues, jobId, onSuccess, onCancel, embedded = false }: JobWizardProps) {
  const [step, setStep] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showExternalPromotionDialog, setShowExternalPromotionDialog] = useState(false);
  const [savedJobData, setSavedJobData] = useState<Job | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  
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
      serviceType: serviceType || 'self-managed',
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

  const currentServiceType = form.watch('serviceType');
  const isHRM8Service = currentServiceType !== 'self-managed';
  const totalSteps = isHRM8Service ? 1 : 6;
  const progress = (step / totalSteps) * 100;

  // Auto-save functionality
  const autoSaveDraft = async () => {
    const formData = form.getValues();
    
    // Only auto-save if there's meaningful content (at least a title)
    if (!formData.title || formData.title.trim().length === 0) {
      toast({
        title: "Cannot Save",
        description: "Please add a job title before saving as draft",
        variant: "destructive"
      });
      return false;
    }

    setAutoSaving(true);

    try {
      let employerData;
      
      if (formData.postAsHRM8) {
        employerData = {
          employerId: "hrm8-platform",
          employerName: "HRM8",
          employerLogo: "/logo-light.png",
        };
      } else if (formData.employerId) {
        const selectedEmployer = getEmployerById(formData.employerId);
        employerData = {
          employerId: formData.employerId,
          employerName: selectedEmployer?.name || "Unknown Employer",
          employerLogo: selectedEmployer?.logo,
        };
      } else {
        // No employer selected yet, skip auto-save
        setAutoSaving(false);
        toast({
          title: "Cannot Save",
          description: "Please select an employer before saving as draft",
          variant: "destructive"
        });
        return false;
      }

      const draftJobData: Job = {
        id: jobId || `job-${Date.now()}`,
        ...formData,
        ...employerData,
        createdBy: "admin-user-id",
        createdByName: "HRM8 Admin",
        jobCode: generateJobCode(),
        aiGeneratedDescription: false,
        serviceType: formData.serviceType,
        applicantsCount: 0,
        viewsCount: 0,
        postingDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasJobTargetPromotion: false,
        jobTargetBudget: 0,
        jobTargetBudgetRemaining: 0,
        requiresPayment: false,
        status: 'draft', // Always save as draft for auto-save
        termsAccepted: formData.termsAccepted || false,
        termsAcceptedAt: formData.termsAccepted ? new Date() : undefined,
        termsAcceptedBy: formData.termsAccepted ? 'current-user-id' : undefined,
      };

      saveJob(draftJobData);
      setLastAutoSave(new Date());
      return true;
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setAutoSaving(false);
    }
  };

  // Manual save draft handler
  const handleManualSaveDraft = async () => {
    const success = await autoSaveDraft();
    if (success) {
      toast({
        title: "Draft Saved",
        description: "Your job posting has been saved as a draft. You can publish it anytime from the Jobs page.",
      });
    }
  };

  // Set up auto-save interval (every 30 seconds)
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      autoSaveDraft();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [form]);

  // Format last save time
  const getLastSaveText = () => {
    if (!lastAutoSave) return null;
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastAutoSave.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 120) return '1 minute ago';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    return lastAutoSave.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Service type display configuration
  const serviceTypeConfig = {
    'self-managed': { 
      name: 'Self-Managed', 
      price: 'FREE', 
      icon: Briefcase,
      color: 'text-muted-foreground'
    },
    'shortlisting': { 
      name: 'Shortlisting Service', 
      price: '$1,990', 
      icon: Users,
      color: 'text-blue-600'
    },
    'full-service': { 
      name: 'Full Service', 
      price: '$5,990', 
      icon: Star,
      color: 'text-primary'
    },
    'executive-search': { 
      name: 'Executive Search', 
      price: '$9,990+', 
      icon: Crown,
      color: 'text-amber-600'
    },
    'rpo': { 
      name: 'RPO', 
      price: 'Custom', 
      icon: Briefcase,
      color: 'text-purple-600'
    }
  };

  const currentService = serviceTypeConfig[currentServiceType] || serviceTypeConfig['self-managed'];
  const ServiceIcon = currentService.icon;

  const handleChangeService = () => {
    setStep(1);
    // Scroll is handled automatically by the useEffect on line 56
  };

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
    const requiresPayment = !isSelfManaged;
    
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
      hasJobTargetPromotion: false,
      jobTargetBudget: 0,
      jobTargetBudgetRemaining: 0,
      requiresPayment,
      termsAccepted: data.termsAccepted,
      termsAcceptedAt: new Date(),
      termsAcceptedBy: 'current-user-id',
    };
    
    if (requiresPayment) {
      const pricing = calculateServicePricing(
        data.serviceType,
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
    
    // Handle draft saves separately
    if (data.status === 'draft') {
      toast({
        title: "Draft Saved",
        description: "Your job posting has been saved as a draft. You can publish it anytime from the Jobs page.",
      });
      
      if (onSuccess) {
        onSuccess(jobData);
      }
      return;
    }
    
    // Store job data for external promotion dialog
    setSavedJobData(jobData);
    
    // Show external promotion popup for self-managed jobs
    if (isSelfManaged) {
      setShowExternalPromotionDialog(true);
      return;
    }
    
    const successTitle = requiresPayment
      ? "Payment Processed & Job Posted"
      : "Job Posted Successfully";
    
    const successDescription = requiresPayment
      ? "Your recruitment service request has been submitted and payment processed"
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
        {/* Auto-save indicator */}
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
          {autoSaving ? (
            <>
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Saving draft...</span>
            </>
          ) : lastAutoSave ? (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Draft saved {getLastSaveText()}</span>
            </>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Service Type Indicator */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border transition-all duration-300">
            <div className="flex items-center gap-3">
              <div 
                key={currentServiceType}
                className={cn(
                  "p-2 rounded-md bg-background transition-all duration-300 animate-scale-in",
                  currentService.color
                )}
              >
                <ServiceIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Selected Service</span>
                <span 
                  key={`name-${currentServiceType}`}
                  className="text-sm font-semibold animate-fade-in"
                >
                  {currentService.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Service Fee</div>
                <div 
                  key={`price-${currentServiceType}`}
                  className="text-lg font-bold text-primary animate-fade-in"
                >
                  {currentService.price}
                </div>
              </div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleChangeService}
                  className="text-xs transition-all duration-200 hover:scale-105"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Change
                </Button>
              )}
            </div>
          </div>
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleManualSaveDraft}
              disabled={autoSaving}
            >
              {autoSaving ? "Saving..." : "Save Draft"}
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
                  const needsPayment = !isSelfManagedJob;
                  
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

        {savedJobData && (
          <ExternalPromotionDialog
            open={showExternalPromotionDialog}
            onOpenChange={setShowExternalPromotionDialog}
            job={savedJobData}
            onSuccess={() => {
              if (onSuccess) {
                onSuccess(savedJobData);
              }
            }}
          />
        )}
      </form>
    </Form>
  );
}
