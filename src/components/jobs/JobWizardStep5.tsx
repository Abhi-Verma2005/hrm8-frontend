import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { formatSalaryRange, formatEmploymentType, formatExperienceLevel } from "@/lib/jobUtils";
import { CheckCircle } from "lucide-react";

interface JobWizardStep5Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep5({ form }: JobWizardStep5Props) {
  const formData = form.watch();
  const jobBoards = ["HRM8 Job Board", "LinkedIn", "Indeed", "Glassdoor", "Company Career Page"];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Review & Publish
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Review your job posting and choose distribution channels</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{formData.title || "Job Title"}</h3>
            <p className="text-muted-foreground">{formData.department} • {formData.location}</p>
          </div>
          <div className="flex gap-2 text-sm">
            <span>{formatEmploymentType(formData.employmentType)}</span>
            <span>•</span>
            <span>{formatExperienceLevel(formData.experienceLevel)}</span>
            {!formData.hideSalary && (formData.salaryMin || formData.salaryMax) && (
              <>
                <span>•</span>
                <span>{formatSalaryRange(formData.salaryMin, formData.salaryMax, formData.salaryCurrency)}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>


      {formData.status === 'open' && (
        <FormField
          control={form.control}
          name="jobBoardDistribution"
          render={() => (
            <FormItem>
              <FormLabel>Job Board Distribution</FormLabel>
              <div className="space-y-2">
                {jobBoards.map((board) => (
                  <div key={board} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.jobBoardDistribution?.includes(board)}
                      onCheckedChange={(checked) => {
                        const current = formData.jobBoardDistribution || [];
                        const updated = checked
                          ? [...current, board]
                          : current.filter(b => b !== board);
                        form.setValue("jobBoardDistribution", updated);
                      }}
                    />
                    <label className="text-sm cursor-pointer">{board}</label>
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
