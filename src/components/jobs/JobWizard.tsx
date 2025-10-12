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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { saveJob } from "@/lib/mockJobStorage";
import { generateJobCode } from "@/lib/jobUtils";

interface JobWizardProps {
  defaultValues?: Partial<JobFormData>;
  jobId?: string;
}

export function JobWizard({ defaultValues, jobId }: JobWizardProps) {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      employmentType: "full-time",
      experienceLevel: "mid",
      remoteOption: false,
      priority: "standard",
      description: "",
      requirements: [],
      responsibilities: [],
      salaryCurrency: "USD",
      hideSalary: false,
      visibility: "public",
      status: "draft",
      jobBoardDistribution: ["HRM8 Job Board"],
      ...defaultValues,
    },
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const onSubmit = (data: JobFormData) => {
    const jobData = {
      id: jobId || `job-${Date.now()}`,
      ...data,
      employerId: "emp-1",
      employerName: "Current Employer",
      createdBy: "current-user",
      createdByName: "Current User",
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
        ? "Your job has been saved as a draft." 
        : "Your job posting is now live.",
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

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
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
      </form>
    </Form>
  );
}
