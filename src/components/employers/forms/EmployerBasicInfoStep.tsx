import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormTextarea } from '@/components/common/form-fields';

interface EmployerBasicInfoStepProps {
  form: UseFormReturn<any>;
}

export function EmployerBasicInfoStep({ form }: EmployerBasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            form={form}
            name="name"
            label="Company Name"
            placeholder="Acme Corporation"
            className="md:col-span-2"
            required
          />

          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="contact@acme.com"
          />

          <FormInput
            form={form}
            name="website"
            label="Website"
            type="url"
            placeholder="https://acme.com"
          />

          <FormInput
            form={form}
            name="industry"
            label="Industry"
            placeholder="Technology, Healthcare, etc."
            required
          />

          <FormInput
            form={form}
            name="location"
            label="Location"
            placeholder="San Francisco, CA"
            required
          />

          <FormInput
            form={form}
            name="companySize"
            label="Company Size"
            placeholder="1-50, 51-200, 201-500, etc."
            className="md:col-span-2"
          />

          <FormTextarea
            form={form}
            name="description"
            label="Description"
            placeholder="Brief company description..."
            rows={4}
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
