import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConsultantCapacityStepProps {
  form: UseFormReturn<any>;
}

export function ConsultantCapacityStep({ form }: ConsultantCapacityStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Capacity & Commission</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxEmployers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Employers *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="10"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>Maximum number of employers to manage</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxJobs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Jobs *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="15"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>Maximum number of concurrent jobs</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commissionStructure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Structure *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="flat">Flat Rate</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultCommissionRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Commission Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="10"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>If using percentage structure</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolioUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Portfolio URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://portfolio.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
