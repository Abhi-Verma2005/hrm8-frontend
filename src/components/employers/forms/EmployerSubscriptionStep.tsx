import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormSelect } from '@/components/common/form-fields';

interface EmployerSubscriptionStepProps {
  form: UseFormReturn<any>;
}

export function EmployerSubscriptionStep({ form }: EmployerSubscriptionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Subscription Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            form={form}
            name="subscriptionTier"
            label="Subscription Tier"
            placeholder="Select tier"
            className="md:col-span-2"
            required
            options={[
              { value: 'ats-lite', label: 'ATS Lite (3 jobs, 1 user)' },
              { value: 'payg', label: 'Pay-as-you-go' },
              { value: 'small', label: 'Small (10 jobs, 5 users)' },
              { value: 'medium', label: 'Medium (25 jobs, 15 users)' },
              { value: 'large', label: 'Large (100 jobs, 50 users)' },
              { value: 'enterprise', label: 'Enterprise (Unlimited)' },
            ]}
          />

          <FormInput
            form={form}
            name="maxOpenJobs"
            label="Max Open Jobs"
            type="number"
            placeholder="10"
            description="Maximum concurrent job postings"
            required
          />

          <FormInput
            form={form}
            name="maxUsers"
            label="Max Users"
            type="number"
            placeholder="5"
            description="Maximum user accounts"
            required
          />

          <FormInput
            form={form}
            name="monthlySubscriptionFee"
            label="Monthly Subscription Fee"
            type="number"
            placeholder="0"
            description="Monthly recurring revenue"
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
