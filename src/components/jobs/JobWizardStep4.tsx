import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { formatSalaryRange, formatEmploymentType, formatExperienceLevel } from "@/lib/jobUtils";

interface JobWizardStep4Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep4({ form }: JobWizardStep4Props) {
  const formData = form.watch();
  const jobBoards = ["HRM8 Job Board", "LinkedIn", "Indeed", "Glassdoor", "Company Career Page"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review & Publish</h2>
        <p className="text-muted-foreground mt-1">Review your job posting and choose distribution channels</p>
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

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Publishing Status</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="draft" />
                  <label htmlFor="draft" className="cursor-pointer">
                    <div className="font-medium">Save as Draft</div>
                    <div className="text-sm text-muted-foreground">Continue editing later</div>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="open" id="open" />
                  <label htmlFor="open" className="cursor-pointer">
                    <div className="font-medium">Publish Now</div>
                    <div className="text-sm text-muted-foreground">Make job visible immediately</div>
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

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
