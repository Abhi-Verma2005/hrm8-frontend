import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormSelect } from '@/components/common/form-fields';

interface ConsultantCapacityStepProps {
  form: UseFormReturn<any>;
}

export function ConsultantCapacityStep({ form }: ConsultantCapacityStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Capacity & Commission</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            form={form}
            name="maxEmployers"
            label="Max Employers"
            type="number"
            placeholder="10"
            description="Maximum number of employers to manage"
            required
          />

          <FormInput
            form={form}
            name="maxJobs"
            label="Max Jobs"
            type="number"
            placeholder="15"
            description="Maximum number of concurrent jobs"
            required
          />

          <FormSelect
            form={form}
            name="commissionStructure"
            label="Commission Structure"
            placeholder="Select structure"
            required
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat Rate' },
              { value: 'tiered', label: 'Tiered' },
              { value: 'custom', label: 'Custom' },
            ]}
          />

          <FormInput
            form={form}
            name="defaultCommissionRate"
            label="Default Commission Rate (%)"
            type="number"
            placeholder="10"
            description="If using percentage structure"
          />

          <FormInput
            form={form}
            name="portfolioUrl"
            label="Portfolio URL"
            type="url"
            placeholder="https://portfolio.example.com"
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
