/**
 * Consultant Form Component
 * Form for creating/editing consultants (HRM8 Admin)
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { consultantManagementService, Consultant } from '@/lib/hrm8/consultantManagementService';
import { regionService } from '@/lib/hrm8/regionService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const consultantSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  role: z.enum(['RECRUITER', 'SALES_AGENT', 'CONSULTANT_360']),
  regionId: z.string().optional(),
});

type ConsultantFormData = z.infer<typeof consultantSchema>;

interface ConsultantFormProps {
  consultantId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export function ConsultantForm({ consultantId, onSave, onCancel }: ConsultantFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingConsultant, setLoadingConsultant] = useState(!!consultantId);
  const [regions, setRegions] = useState<Array<{ id: string; name: string }>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantSchema),
    defaultValues: {
      role: 'RECRUITER',
    },
  });

  useEffect(() => {
    if (consultantId) {
      loadConsultant();
    }
    loadRegions();
  }, [consultantId]);

  const loadConsultant = async () => {
    if (!consultantId) return;

    try {
      setLoadingConsultant(true);
      const response = await consultantManagementService.getById(consultantId);
      if (response.success && response.data?.consultant) {
        const consultant = response.data.consultant;
        setValue('email', consultant.email);
        setValue('firstName', consultant.firstName);
        setValue('lastName', consultant.lastName);
        setValue('phone', consultant.phone || '');
        setValue('role', consultant.role);
        setValue('regionId', consultant.regionId || '');
      }
    } catch (error) {
      toast.error('Failed to load consultant');
    } finally {
      setLoadingConsultant(false);
    }
  };

  const loadRegions = async () => {
    try {
      const response = await regionService.getAll({ isActive: true });
      if (response.success && response.data?.regions) {
        setRegions(response.data.regions.map(r => ({ id: r.id, name: r.name })));
      }
    } catch (error) {
      console.error('Failed to load regions:', error);
    }
  };

  const onSubmit = async (data: ConsultantFormData) => {
    try {
      setLoading(true);

      if (consultantId) {
        // Update - don't send password
        const { password, ...updateData } = data;
        const response = await consultantManagementService.update(consultantId, updateData);
        if (response.success) {
          toast.success('Consultant updated successfully');
          onSave();
        } else {
          toast.error(response.error || 'Failed to update consultant');
        }
      } else {
        // Create - password required
        if (!data.password) {
          toast.error('Password is required for new consultants');
          setLoading(false);
          return;
        }
        const response = await consultantManagementService.create(data);
        if (response.success) {
          toast.success('Consultant created successfully');
          onSave();
        } else {
          toast.error(response.error || 'Failed to create consultant');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loadingConsultant) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {!consultantId && (
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input id="firstName" {...register('firstName')} />
        {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input id="lastName" {...register('lastName')} />
        {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select
          value={watch('role')}
          onValueChange={(value) => setValue('role', value as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RECRUITER">Recruiter</SelectItem>
            <SelectItem value="SALES_AGENT">Sales Agent</SelectItem>
            <SelectItem value="CONSULTANT_360">360 Consultant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="regionId">Region</Label>
        <Select
          onValueChange={(value) => setValue('regionId', value)}
          defaultValue={watch('regionId') || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {consultantId ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}



