import { UseFormReturn } from 'react-hook-form';
import { FormInput } from '@/components/common/form-fields';

interface ConsultantBasicInfoStepProps {
  form: UseFormReturn<any>;
}

export function ConsultantBasicInfoStep({ form }: ConsultantBasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            form={form}
            name="firstName"
            label="First Name"
            placeholder="John"
            required
          />

          <FormInput
            form={form}
            name="lastName"
            label="Last Name"
            placeholder="Doe"
            required
          />

          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            required
          />

          <FormInput
            form={form}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            required
          />

          <FormInput
            form={form}
            name="location"
            label="Location"
            placeholder="San Francisco, CA"
            description="City, State format"
            required
          />

          <FormInput
            form={form}
            name="country"
            label="Country"
            placeholder="United States"
            required
          />

          <FormInput
            form={form}
            name="linkedInUrl"
            label="LinkedIn URL"
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
