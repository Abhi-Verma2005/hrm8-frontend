import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { FormInput, FormSelect, FormTextarea } from '@/components/common/form-fields';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';

interface ConsultantProfessionalStepProps {
  form: UseFormReturn<any>;
}

export function ConsultantProfessionalStep({ form }: ConsultantProfessionalStepProps) {
  const [specializationInput, setSpecializationInput] = useState('');
  const specializations = form.watch('specialization') || [];

  const addSpecialization = (spec: string) => {
    if (spec && !specializations.includes(spec)) {
      form.setValue('specialization', [...specializations, spec]);
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (spec: string) => {
    form.setValue('specialization', specializations.filter((s: string) => s !== spec));
  };

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

          {/* Specializations field - custom implementation needed for tags */}
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  Specializations
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      placeholder="Add specialization and press Enter"
                      value={specializationInput}
                      onChange={(e) => setSpecializationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSpecialization(specializationInput);
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((spec: string) => (
                        <Badge key={spec} variant="secondary">
                          {spec}
                          <button
                            type="button"
                            onClick={() => removeSpecialization(spec)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Press Enter to add each specialization</FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
