import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmployerSubscriptionStepProps {
  form: UseFormReturn<any>;
}

export function EmployerSubscriptionStep({ form }: EmployerSubscriptionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Subscription Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subscriptionTier"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Subscription Tier *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free (3 jobs, 1 user)</SelectItem>
                    <SelectItem value="small">Small (10 jobs, 5 users)</SelectItem>
                    <SelectItem value="medium">Medium (25 jobs, 15 users)</SelectItem>
                    <SelectItem value="large">Large (100 jobs, 50 users)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (Unlimited)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxOpenJobs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Open Jobs *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="10"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>Maximum concurrent job postings</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxUsers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Users *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="5"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>Maximum user accounts</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlySubscriptionFee"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Monthly Subscription Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Monthly recurring revenue</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
