import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { JobFormData } from "@/types/job";
import { jobFormSchema } from "@/lib/validations/jobValidation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { JobWizardStep1 } from "./JobWizardStep1";
import { JobWizardStep2 } from "./JobWizardStep2";
import { JobWizardStep3 } from "./JobWizardStep3";
import { JobWizardStep4 } from "./JobWizardStep4";
import { JobWizardStep5 } from "./JobWizardStep5";
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

interface JobWizardProps {
  defaultValues?: Partial<JobFormData>;
  jobId?: string;
}

export function JobWizard({ defaultValues, jobId }: JobWizardProps) {
  const [step, setStep] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      postAsHRM8: false,
      employerId: "",
      title: "",
      department: "",
      location: "",
      employmentType: "full-time",
      experienceLevel: "mid",
      workArrangement: "on-site",
      priority: "standard",
      description: "",
      requirements: [],
      responsibilities: [],
      salaryCurrency: "USD",
      salaryPeriod: "annual",
      hideSalary: false,
      visibility: "public",
      hiringTeam: [],
      applicationForm: {
        id: `form-${Date.now()}`,
        name: "Application Form",
        questions: [],
        includeStandardFields: {
          resume: true,
          coverLetter: false,
          portfolio: false,
          linkedIn: false,
          website: false,
        },
      },
      status: "draft",
      jobBoardDistribution: ["HRM8 Job Board"],
      ...defaultValues,
    },
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const onSubmit = (data: JobFormData) => {
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
    
    const jobData = {
      id: jobId || `job-${Date.now()}`,
      ...data,
      ...employerData,
      createdBy: "admin-user-id", // TODO: Replace with actual auth user ID
      createdByName: "HRM8 Admin", // TODO: Replace with actual auth user name
      jobCode: generateJobCode(),
      aiGeneratedDescription: false,
      serviceType: "self-managed" as const,
      applicantsCount: 0,
      viewsCount: 0,
      postingDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveJob(jobData);
    toast({
      title: data.status === 'draft' ? "Draft Saved" : "Job Published!",
      description: data.status === 'draft' 
        ? `Job saved as draft for ${employerData.employerName}` 
        : `Job published successfully for ${employerData.employerName}`,
    });
    navigate("/jobs");
  };

  const nextStep = () => setStep(Math.min(step + 1, totalSteps));
  const prevStep = () => setStep(Math.max(step - 1, 1));

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
        {step === 2 && <JobWizardStep2 form={form} />}
        {step === 3 && <JobWizardStep3 form={form} />}
        {step === 4 && <JobWizardStep4 form={form} />}
        {step === 5 && <JobWizardStep5 form={form} />}

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            {step === 2 && (
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
              <Button type="submit">
                {form.watch("status") === 'draft' ? 'Save Draft' : 'Publish Job'}
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
