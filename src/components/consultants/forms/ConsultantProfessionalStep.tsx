import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormSelect, FormTextarea, FormMultiSelect } from '@/components/common/form-fields';

interface ConsultantProfessionalStepProps {
  form: UseFormReturn<any>;
}

export function ConsultantProfessionalStep({ form }: ConsultantProfessionalStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            form={form}
            name="type"
            label="Consultant Type"
            placeholder="Select type"
            required
            options={[
              { value: 'sales-rep', label: 'Sales Representative' },
              { value: 'recruiter', label: 'Recruiter' },
              { value: '360-consultant', label: '360 Consultant' },
              { value: 'industry-partner', label: 'Industry Partner' },
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
              { value: 'on-leave', label: 'On Leave' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'suspended', label: 'Suspended' },
            ]}
          />

          <FormSelect
            form={form}
            name="employmentType"
            label="Employment Type"
            placeholder="Select type"
            required
            options={[
              { value: 'full-time', label: 'Full-time' },
              { value: 'part-time', label: 'Part-time' },
              { value: 'contract', label: 'Contract' },
              { value: 'freelance', label: 'Freelance' },
            ]}
          />

          <FormInput
            form={form}
            name="yearsOfExperience"
            label="Years of Experience"
            type="number"
            placeholder="5"
            required
          />

          <FormInput
            form={form}
            name="title"
            label="Job Title"
            placeholder="Senior Recruiter"
            className="md:col-span-2"
          />

          <FormMultiSelect
            form={form}
            name="specialization"
            label="Specializations"
            placeholder="Type and press Enter to add"
            description="Press Enter to add each specialization"
            required
            className="md:col-span-2"
            suggestions={[
              'Recruitment',
              'Sales',
              'Business Development',
              'Account Management',
              'Talent Acquisition',
              'Executive Search',
              'Technical Recruiting',
              'Healthcare Recruiting',
              'Finance Recruiting',
            ]}
          />

          <FormTextarea
            form={form}
            name="bio"
            label="Bio"
            placeholder="Brief professional biography..."
            rows={4}
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
