import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Wand2 } from "lucide-react";
import { AIJobGenerator } from "./AIJobGenerator";

interface JobWizardStep2Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep2({ form }: JobWizardStep2Props) {
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const current = form.getValues("requirements") || [];
      form.setValue("requirements", [...current, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    const current = form.getValues("requirements") || [];
    form.setValue("requirements", current.filter((_, i) => i !== index));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      const current = form.getValues("responsibilities") || [];
      form.setValue("responsibilities", [...current, newResponsibility.trim()]);
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    const current = form.getValues("responsibilities") || [];
    form.setValue("responsibilities", current.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Description</h2>
          <p className="text-muted-foreground mt-1">
            Describe the role, requirements, and responsibilities
          </p>
        </div>
        <AIJobGenerator form={form} />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide a detailed description of the job, including the role, team, and company culture..."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This will be the main description candidates see
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="requirements"
        render={() => (
          <FormItem>
            <FormLabel>Requirements *</FormLabel>
            <div className="space-y-3">
              {(form.watch("requirements") || []).map((req, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 p-3 bg-secondary/10 rounded-md text-sm">
                    {req}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a requirement (e.g., 5+ years of experience)"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRequirement();
                    }
                  }}
                />
                <Button type="button" onClick={addRequirement} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <FormDescription>
              List the key qualifications and skills needed for this role
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="responsibilities"
        render={() => (
          <FormItem>
            <FormLabel>Responsibilities *</FormLabel>
            <div className="space-y-3">
              {(form.watch("responsibilities") || []).map((resp, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 p-3 bg-secondary/10 rounded-md text-sm">
                    {resp}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeResponsibility(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a responsibility (e.g., Design and develop scalable applications)"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addResponsibility();
                    }
                  }}
                />
                <Button type="button" onClick={addResponsibility} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <FormDescription>
              Outline the key duties and day-to-day tasks
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
