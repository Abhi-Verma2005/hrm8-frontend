/**
 * Licensee Form Component
 * Form for creating/editing regional licensees
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { licenseeService, RegionalLicensee } from '@/lib/hrm8/licenseeService';
import { toast } from 'sonner';
import { Loader2, Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const licenseeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  legalEntityName: z.string().min(1, 'Legal entity name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
  agreementStartDate: z.string().min(1, 'Agreement start date is required'),
  agreementEndDate: z.string().optional(),
  revenueSharePercent: z.number().min(0).max(100),
  exclusivity: z.boolean().optional(),
  managerContact: z.string().min(1, 'Manager contact is required'),
  financeContact: z.string().optional(),
  complianceContact: z.string().optional(),
});

type LicenseeFormData = z.infer<typeof licenseeSchema>;

interface LicenseeFormProps {
  licenseeId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export function LicenseeForm({ licenseeId, onSave, onCancel }: LicenseeFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingLicensee, setLoadingLicensee] = useState(!!licenseeId);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string, password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LicenseeFormData>({
    resolver: zodResolver(licenseeSchema),
    defaultValues: {
      revenueSharePercent: 50,
      exclusivity: false,
    },
  });

  useEffect(() => {
    if (licenseeId) {
      loadLicensee();
    }
  }, [licenseeId]);

  const loadLicensee = async () => {
    if (!licenseeId) return;

    try {
      setLoadingLicensee(true);
      const response = await licenseeService.getById(licenseeId);
      if (response.success && response.data?.licensee) {
        const licensee = response.data.licensee;
        setValue('name', licensee.name);
        setValue('legalEntityName', licensee.legalEntityName);
        setValue('email', licensee.email);
        setValue('phone', licensee.phone || '');
        setValue('address', licensee.address || '');
        setValue('city', licensee.city || '');
        setValue('state', licensee.state || '');
        setValue('country', licensee.country || '');
        setValue('taxId', licensee.taxId || '');
        setValue('agreementStartDate', licensee.agreementStartDate.split('T')[0]);
        setValue('agreementEndDate', licensee.agreementEndDate?.split('T')[0] || '');
        setValue('revenueSharePercent', licensee.revenueSharePercent);
        setValue('exclusivity', licensee.exclusivity);
        setValue('managerContact', licensee.managerContact);
        setValue('financeContact', licensee.financeContact || '');
        setValue('complianceContact', licensee.complianceContact || '');
      }
    } catch (error) {
      toast.error('Failed to load licensee');
    } finally {
      setLoadingLicensee(false);
    }
  };

  const onSubmit = async (data: LicenseeFormData) => {
    try {
      setLoading(true);

      const formData = {
        ...data,
        agreementStartDate: new Date(data.agreementStartDate).toISOString(),
        agreementEndDate: data.agreementEndDate ? new Date(data.agreementEndDate).toISOString() : undefined,
      };

      if (licenseeId) {
        const response = await licenseeService.update(licenseeId, formData);
        if (response.success) {
          toast.success('Licensee updated successfully');
          onSave();
        } else {
          toast.error(response.error || 'Failed to update licensee');
        }
      } else {
        const response = await licenseeService.create(formData);
        if (response.success && response.data?.licensee) {
          if (response.data.licensee.tempPassword) {
            setCreatedCredentials({
              email: response.data.licensee.email,
              password: response.data.licensee.tempPassword
            });
            toast.success('Licensee created. Please copy the credentials.');
          } else {
            toast.success('Licensee created successfully');
            onSave();
          }
        } else {
          toast.error(response.error || 'Failed to create licensee');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loadingLicensee) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalEntityName">Legal Entity Name *</Label>
          <Input id="legalEntityName" {...register('legalEntityName')} />
          {errors.legalEntityName && <p className="text-sm text-destructive">{errors.legalEntityName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          {!licenseeId && (
            <p className="text-xs text-muted-foreground bg-blue-50 text-blue-800 p-2 rounded-md border border-blue-200">
              <strong>Note:</strong> A Regional Admin account will be automatically created for this email.
              A temporary password will be sent to this address.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenueSharePercent">Revenue Share % *</Label>
          <Input
            id="revenueSharePercent"
            type="number"
            min="0"
            max="100"
            {...register('revenueSharePercent', { valueAsNumber: true })}
          />
          {errors.revenueSharePercent && <p className="text-sm text-destructive">{errors.revenueSharePercent.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="agreementStartDate">Agreement Start Date *</Label>
          <Input id="agreementStartDate" type="date" {...register('agreementStartDate')} />
          {errors.agreementStartDate && <p className="text-sm text-destructive">{errors.agreementStartDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="managerContact">Manager Contact *</Label>
          <Input id="managerContact" {...register('managerContact')} />
          {errors.managerContact && <p className="text-sm text-destructive">{errors.managerContact.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {licenseeId ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>

      <Dialog open={!!createdCredentials} onOpenChange={(open) => !open && onSave()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Regional Admin Created</DialogTitle>
            <DialogDescription>
              A new Global Admin account has been created. Please copy these temporary credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Alert>
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This password will not be shown again. The user will be required to change it upon first login.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-2 bg-muted rounded-md text-sm font-mono">
                {createdCredentials?.email}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Temporary Password</Label>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-md text-sm font-mono flex-1">
                  {createdCredentials?.password}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    if (createdCredentials?.password) {
                      navigator.clipboard.writeText(createdCredentials.password);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                      toast.success('Password copied to clipboard');
                    }
                  }}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => onSave()} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}



