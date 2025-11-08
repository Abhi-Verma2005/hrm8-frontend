import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormSelect } from '@/components/common/form-fields';

interface EmployerAccountStepProps {
  form: UseFormReturn<any>;
}

export function EmployerAccountStep({ form }: EmployerAccountStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            form={form}
            name="accountType"
            label="Account Type"
            placeholder="Select type"
            description="Approved accounts have credit terms"
            required
            options={[
              { value: 'approved', label: 'Approved' },
              { value: 'payg', label: 'Pay-as-you-go' },
            ]}
          />

          <FormSelect
            form={form}
            name="status"
            label="Status"
            placeholder="Select status"
            required
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'trial', label: 'Trial' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'expired', label: 'Expired' },
            ]}
          />

          <FormInput
            form={form}
            name="creditLimit"
            label="Credit Limit"
            type="number"
            placeholder="10000"
            description="For approved accounts"
          />

          <FormInput
            form={form}
            name="paymentTerms"
            label="Payment Terms"
            placeholder="Net 30, Net 60, etc."
          />
        </div>
      </div>
    </div>
  );
}
