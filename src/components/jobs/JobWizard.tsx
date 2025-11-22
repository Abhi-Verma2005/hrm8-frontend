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
import { jobService } from "@/lib/api/jobService";
import { generateJobCode } from "@/lib/jobUtils";
import { calculateServicePricing, processAccountPayment, processCreditCardPayment } from "@/lib/paymentService";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";


interface JobWizardProps {
  serviceType?: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | 'rpo';
  defaultValues?: Partial<JobFormData>;
  jobId?: string;
  onSuccess?: (jobData: Job) => void;
  onCancel?: () => void;
  embedded?: boolean;
}

export function JobWizard({ serviceType, defaultValues, jobId: initialJobId, onSuccess, onCancel, embedded = false }: JobWizardProps) {
  const { user, profileSummary } = useAuth();
  const [step, setStep] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showExternalPromotionDialog, setShowExternalPromotionDialog] = useState(false);
  const [savedJobData, setSavedJobData] = useState<Job | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(initialJobId || null);
  
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
      serviceType: serviceType || defaultValues?.serviceType || 'self-managed',
      title: defaultValues?.title || "",
      numberOfVacancies: defaultValues?.numberOfVacancies || 1,
      department: defaultValues?.department || "",
      location: defaultValues?.location || "",
      employmentType: defaultValues?.employmentType || "full-time",
      experienceLevel: defaultValues?.experienceLevel || "mid",
      workArrangement: defaultValues?.workArrangement || "on-site",
      tags: defaultValues?.tags || [],
      description: defaultValues?.description || "",
      requirements: defaultValues?.requirements || [],
      responsibilities: defaultValues?.responsibilities || [],
      salaryCurrency: defaultValues?.salaryCurrency || "USD",
      salaryPeriod: defaultValues?.salaryPeriod || "annual",
      hideSalary: defaultValues?.hideSalary || false,
      visibility: defaultValues?.visibility || "public",
      stealth: defaultValues?.stealth || false,
      hiringTeam: defaultValues?.hiringTeam || [],
      applicationForm: defaultValues?.applicationForm || {
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
      status: defaultValues?.status || "draft",
      jobBoardDistribution: defaultValues?.jobBoardDistribution || ["HRM8 Job Board"],
      termsAccepted: defaultValues?.termsAccepted || false,
      selectedPaymentMethod: defaultValues?.selectedPaymentMethod,
      paymentInvoiceRequested: defaultValues?.paymentInvoiceRequested || false,
    },
  });

  // Reset form when defaultValues change (e.g., when loading a draft)
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...form.getValues(),
        ...defaultValues,
      });
      // If we have a jobId, set it for auto-save
      if (initialJobId) {
        setCurrentJobId(initialJobId);
      }
    }
  }, [defaultValues, initialJobId, form]);

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
      // Transform requirements and responsibilities from objects to strings
      const requirements = (formData.requirements || []).map((req: any) => {
        if (typeof req === 'string') return req;
        return req.text || '';
      }).filter((req: string) => req.trim().length > 0);
      
      const responsibilities = (formData.responsibilities || []).map((resp: any) => {
        if (typeof resp === 'string') return resp;
        return resp.text || '';
      }).filter((resp: string) => resp.trim().length > 0);

      // Convert form data to API format
      const jobRequest = {
        title: formData.title,
        description: formData.description,
        jobSummary: formData.description.substring(0, 150),
        hiringMode: formData.serviceType === 'self-managed' ? 'SELF_MANAGED' as const :
                   formData.serviceType === 'shortlisting' ? 'SHORTLISTING' as const :
                   formData.serviceType === 'full-service' ? 'FULL_SERVICE' as const :
                   'EXECUTIVE_SEARCH' as const,
        location: formData.location,
        department: formData.department,
        workArrangement: formData.workArrangement.toUpperCase().replace('-', '_') as 'ON_SITE' | 'REMOTE' | 'HYBRID',
        employmentType: formData.employmentType.toUpperCase().replace('-', '_') as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'CASUAL',
        numberOfVacancies: formData.numberOfVacancies || 1,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        salaryCurrency: formData.salaryCurrency,
        salaryDescription: formData.salaryDescription,
        promotionalTags: formData.tags || [],
        stealth: formData.stealth,
        visibility: formData.visibility,
        requirements,
        responsibilities,
        termsAccepted: formData.termsAccepted || false,
        termsAcceptedAt: formData.termsAccepted ? new Date() : undefined,
        termsAcceptedBy: formData.termsAccepted ? user?.id : undefined,
      };

      if (currentJobId) {
        // Update existing job
        const response = await jobService.updateJob(currentJobId, {
          ...jobRequest,
          status: 'DRAFT',
        });
        if (response.success) {
          setLastAutoSave(new Date());
          return true;
        }
      } else {
        // Create new job
        const response = await jobService.createJob(jobRequest);
        if (response.success && response.data) {
          // Store the job ID for future auto-saves
          setCurrentJobId(response.data.id);
          setLastAutoSave(new Date());
          return true;
        }
      }
      
      return false;
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
    console.log('📋 Form submitted!', { step, totalSteps, data: { ...data, description: data.description?.substring(0, 50) + '...' } });
    
    // Transform requirements and responsibilities from objects to strings for validation
    // The form stores them as { id, text, order } but validation might expect strings
    const transformedData = {
      ...data,
      requirements: (data.requirements || []).map((req: any) => {
        if (typeof req === 'string') return req;
        return req.text || req;
      }).filter((req: any) => req && req.trim && req.trim().length > 0),
      responsibilities: (data.responsibilities || []).map((resp: any) => {
        if (typeof resp === 'string') return resp;
        return resp.text || resp;
      }).filter((resp: any) => resp && resp.trim && resp.trim().length > 0),
    };
    
    // Manual validation for requirements and responsibilities
    if (!transformedData.requirements || transformedData.requirements.length === 0) {
      toast({
        title: "Please Fix Form Errors",
        description: "At least one requirement is needed",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    if (!transformedData.responsibilities || transformedData.responsibilities.length === 0) {
      toast({
        title: "Please Fix Form Errors",
        description: "At least one responsibility is needed",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    // Check form validation errors first
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      console.log('❌ Form validation errors:', errors);
      
      // Build user-friendly error messages
      const errorMessages: string[] = [];
      
      if (errors.description) {
        errorMessages.push(errors.description.message || 'Job description is required (at least 50 characters)');
      }
      if (errors.title) {
        errorMessages.push(errors.title.message || 'Job title is required (at least 5 characters)');
      }
      if (errors.location) {
        errorMessages.push(errors.location.message || 'Location is required');
      }
      if (errors.department) {
        errorMessages.push(errors.department.message || 'Department is required');
      }
      if (errors.termsAccepted) {
        errorMessages.push('You must accept the Terms & Conditions');
      }
      
      // Add any other validation errors (excluding requirements/responsibilities as we handle them above)
      Object.keys(errors).forEach((key) => {
        if (!['requirements', 'responsibilities', 'description', 'title', 'location', 'department', 'termsAccepted'].includes(key)) {
          const error = errors[key as keyof typeof errors];
          if (error && 'message' in error) {
            errorMessages.push(error.message as string);
          }
        }
      });
      
      if (errorMessages.length > 0) {
        toast({
          title: "Please Fix Form Errors",
          description: errorMessages.join('. '),
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
    }
    
    if (!data.termsAccepted) {
      console.log('❌ Terms not accepted');
      toast({
        title: "Terms & Conditions Required",
        description: "Please accept the Terms & Conditions to proceed",
        variant: "destructive"
      });
      return;
    }
    
    console.log('✅ Terms accepted, proceeding with publish...');
    
    const isSelfManaged = data.serviceType === 'self-managed' || data.serviceType === 'rpo';
    const requiresPayment = !isSelfManaged;
    
    // Get company name from auth context
    const companyName = user?.companyName || profileSummary?.name || "Your Company";
    
    const jobData: Job = {
      id: currentJobId || `job-${Date.now()}`,
      ...data,
      employerId: user?.companyId || "",
      employerName: companyName,
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
          user?.companyId || "",
          pricing,
          data.paymentInvoiceRequested || false
        );
        
        if (paymentResult.error === 'INVOICE_REQUESTED') {
          jobData.paymentId = paymentResult.paymentId;
          jobData.paymentStatus = 'pending';
          
          // Save as draft via API
          const jobRequest = {
            title: data.title,
            description: data.description,
            jobSummary: data.description.substring(0, 150),
            hiringMode: data.serviceType === 'self-managed' ? 'SELF_MANAGED' as const :
                       data.serviceType === 'shortlisting' ? 'SHORTLISTING' as const :
                       data.serviceType === 'full-service' ? 'FULL_SERVICE' as const :
                       'EXECUTIVE_SEARCH' as const,
            location: data.location,
            department: data.department,
            workArrangement: data.workArrangement.toUpperCase().replace('-', '_') as 'ON_SITE' | 'REMOTE' | 'HYBRID',
            employmentType: data.employmentType.toUpperCase().replace('-', '_') as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'CASUAL',
            numberOfVacancies: data.numberOfVacancies || 1,
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            salaryCurrency: data.salaryCurrency,
            salaryDescription: data.salaryDescription,
            promotionalTags: data.tags || [],
            stealth: data.stealth,
            visibility: data.visibility,
            status: 'DRAFT' as const,
          };
          
          if (currentJobId) {
            await jobService.updateJob(currentJobId, { ...jobRequest, status: 'DRAFT' });
          } else {
            const createResponse = await jobService.createJob(jobRequest);
            if (createResponse.success && createResponse.data) {
              jobData.id = createResponse.data.id;
              setCurrentJobId(createResponse.data.id);
            }
          }
          
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
          user?.companyId || "",
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

    // Transform requirements and responsibilities from objects to strings
    const requirements = transformedData.requirements;
    const responsibilities = transformedData.responsibilities;

    // Convert to API format and save
    const jobRequest = {
      title: data.title,
      description: data.description,
      jobSummary: data.description.substring(0, 150),
      hiringMode: data.serviceType === 'self-managed' ? 'SELF_MANAGED' as const :
                 data.serviceType === 'shortlisting' ? 'SHORTLISTING' as const :
                 data.serviceType === 'full-service' ? 'FULL_SERVICE' as const :
                 'EXECUTIVE_SEARCH' as const,
      location: data.location,
      department: data.department,
      workArrangement: data.workArrangement.toUpperCase().replace('-', '_') as 'ON_SITE' | 'REMOTE' | 'HYBRID',
      employmentType: data.employmentType.toUpperCase().replace('-', '_') as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'CASUAL',
      numberOfVacancies: data.numberOfVacancies || 1,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      salaryCurrency: data.salaryCurrency,
      salaryDescription: data.salaryDescription,
      promotionalTags: data.tags || [],
      stealth: data.stealth,
      visibility: data.visibility,
      requirements,
      responsibilities,
      termsAccepted: data.termsAccepted || false,
      termsAcceptedAt: data.termsAccepted ? new Date() : undefined,
      termsAcceptedBy: data.termsAccepted ? user?.id : undefined,
      status: 'DRAFT' as const, // Will be published below
    };
    
    // Publish job - create or update first, then publish
    console.log('🚀 Publishing job...', { currentJobId, jobRequest });
    try {
      if (currentJobId) {
        console.log('📝 Updating existing job:', currentJobId);
        // Update existing job first
        const updateResponse = await jobService.updateJob(currentJobId, jobRequest);
        console.log('✅ Update response:', updateResponse);
        if (updateResponse.success && updateResponse.data) {
          jobData.id = updateResponse.data.id;
          // Now publish it
          console.log('📢 Publishing job:', currentJobId);
          const publishResponse = await jobService.publishJob(currentJobId);
          console.log('✅ Publish response:', publishResponse);
          if (publishResponse.success && publishResponse.data) {
            jobData.id = publishResponse.data.id;
            jobData.status = 'open';
            console.log('✅ Job published successfully!');
          } else {
            console.error('❌ Publish failed:', publishResponse);
            throw new Error(publishResponse.error || 'Failed to publish job');
          }
        } else {
          console.error('❌ Update failed:', updateResponse);
          throw new Error(updateResponse.error || 'Failed to update job');
        }
      } else {
        console.log('🆕 Creating new job...');
        // Create new job first
        const createResponse = await jobService.createJob(jobRequest);
        console.log('✅ Create response:', createResponse);
        if (createResponse.success && createResponse.data) {
          jobData.id = createResponse.data.id;
          setCurrentJobId(createResponse.data.id);
          // Now publish it
          console.log('📢 Publishing newly created job:', createResponse.data.id);
          const publishResponse = await jobService.publishJob(createResponse.data.id);
          console.log('✅ Publish response:', publishResponse);
          if (publishResponse.success && publishResponse.data) {
            jobData.status = 'open';
            console.log('✅ Job created and published successfully!');
          } else {
            console.error('❌ Publish failed:', publishResponse);
            throw new Error(publishResponse.error || 'Failed to publish job');
          }
        } else {
          console.error('❌ Create failed:', createResponse);
          throw new Error(createResponse.error || 'Failed to create job');
        }
      }
    } catch (error: any) {
      console.error('❌ Error publishing job:', error);
      toast({
        title: "Publish Failed",
        description: error?.message || "Failed to publish job. Please try again.",
        variant: "destructive"
      });
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
                onClick={async (e) => {
                  console.log('🔘 Publish button clicked!');
                  
                  // Check requirements and responsibilities manually (they're stored as objects)
                  const formData = form.getValues();
                  const requirements = formData.requirements || [];
                  const responsibilities = formData.responsibilities || [];
                  
                  // Extract text from objects or use strings directly
                  const validRequirements = requirements.filter((req: any) => {
                    if (typeof req === 'string') return req.trim().length > 0;
                    return req.text && req.text.trim().length > 0;
                  });
                  
                  const validResponsibilities = responsibilities.filter((resp: any) => {
                    if (typeof resp === 'string') return resp.trim().length > 0;
                    return resp.text && resp.text.trim().length > 0;
                  });
                  
                  console.log('Requirements check:', { 
                    total: requirements.length, 
                    valid: validRequirements.length,
                    items: requirements 
                  });
                  console.log('Responsibilities check:', { 
                    total: responsibilities.length, 
                    valid: validResponsibilities.length,
                    items: responsibilities 
                  });
                  
                  const errorMessages: string[] = [];
                  
                  if (validRequirements.length === 0) {
                    errorMessages.push('At least one requirement is needed');
                  }
                  
                  if (validResponsibilities.length === 0) {
                    errorMessages.push('At least one responsibility is needed');
                  }
                  
                  // Trigger validation on all fields
                  const isValid = await form.trigger();
                  console.log('Form validation result:', isValid);
                  
                  if (!isValid || errorMessages.length > 0) {
                    const errors = form.formState.errors;
                    console.log('Form validation errors:', errors);
                    
                    if (errors.description) {
                      errorMessages.push(errors.description.message || 'Job description is required (at least 50 characters)');
                    }
                    if (errors.title) {
                      errorMessages.push(errors.title.message || 'Job title is required (at least 5 characters)');
                    }
                    if (errors.location) {
                      errorMessages.push(errors.location.message || 'Location is required');
                    }
                    if (errors.department) {
                      errorMessages.push(errors.department.message || 'Department is required');
                    }
                    if (errors.termsAccepted) {
                      errorMessages.push('You must accept the Terms & Conditions');
                    }
                    
                    // Add any other validation errors
                    Object.keys(errors).forEach((key) => {
                      if (!['requirements', 'responsibilities', 'description', 'title', 'location', 'department', 'termsAccepted'].includes(key)) {
                        const error = errors[key as keyof typeof errors];
                        if (error && 'message' in error) {
                          errorMessages.push(error.message as string);
                        }
                      }
                    });
                    
                    if (errorMessages.length > 0) {
                      toast({
                        title: "Please Fix Form Errors",
                        description: errorMessages.join('. '),
                        variant: "destructive",
                        duration: 5000,
                      });
                    }
                  }
                }}
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
