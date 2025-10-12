import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface JobWizardStep3Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep3({ form }: JobWizardStep3Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Additional Details</h2>
        <p className="text-muted-foreground mt-1">
          Set application deadline and visibility options
        </p>
      </div>

      <FormField
        control={form.control}
        name="closeDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Application Deadline (Optional)</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Leave blank if the position is open until filled
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Job Visibility</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <label htmlFor="public" className="flex-1 cursor-pointer">
                    <div className="font-medium">Public</div>
                    <div className="text-sm text-muted-foreground">
                      Visible on job boards and search results
                    </div>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <label htmlFor="private" className="flex-1 cursor-pointer">
                    <div className="font-medium">Private</div>
                    <div className="text-sm text-muted-foreground">
                      Only accessible via direct link
                    </div>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stealth" id="stealth" />
                  <label htmlFor="stealth" className="flex-1 cursor-pointer">
                    <div className="font-medium">Stealth</div>
                    <div className="text-sm text-muted-foreground">
                      Company name hidden, for executive searches
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
