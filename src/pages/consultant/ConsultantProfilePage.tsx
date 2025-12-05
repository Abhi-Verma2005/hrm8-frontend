/**
 * Consultant Profile Page
 * Self-service profile management for consultants
 */

import { useState, useEffect } from 'react';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService, ConsultantProfile } from '@/lib/consultant/consultantService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsultantPageLayout } from '@/components/layouts/ConsultantPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function ConsultantProfilePage() {
  const { consultant } = useConsultantAuth();
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<any>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await consultantService.getProfile();
      if (response.success && response.data?.consultant) {
        const consultantData = response.data.consultant;
        setProfile(consultantData);
        
        // Set form values
        setValue('firstName', consultantData.firstName);
        setValue('lastName', consultantData.lastName);
        setValue('phone', consultantData.phone || '');
        setValue('address', consultantData.address || '');
        setValue('city', consultantData.city || '');
        setValue('stateProvince', consultantData.stateProvince || '');
        setValue('country', consultantData.country || '');
        setValue('availability', consultantData.availability);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setSaving(true);
      const response = await consultantService.updateProfile(data);
      if (response.success) {
        toast.success('Profile updated successfully');
        await loadProfile();
      } else {
        toast.error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ConsultantPageLayout>
        <div className="p-6 space-y-6">
          <AtsPageHeader
        title="Profile"
            subtitle="Manage your profile information"
          />
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </ConsultantPageLayout>
    );
  }

  return (
    <ConsultantPageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader
          title="Profile"
          subtitle="Manage your profile information"
        />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
              <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
              <CardDescription className="text-sm">
                Update your personal details
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">First Name *</Label>
                <Input id="firstName" {...register('firstName', { required: true })} />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">Last Name *</Label>
                <Input id="lastName" {...register('lastName', { required: true })} />
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" value={profile?.email || ''} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle className="text-base font-semibold">Address</CardTitle>
              <CardDescription className="text-sm">
                Your contact address information
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="address" className="text-sm">Address</Label>
              <Input id="address" {...register('address')} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm">City</Label>
                <Input id="city" {...register('city')} />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="stateProvince" className="text-sm">State/Province</Label>
                <Input id="stateProvince" {...register('stateProvince')} />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm">Country</Label>
                <Input id="country" {...register('country')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle className="text-base font-semibold">Availability</CardTitle>
              <CardDescription className="text-sm">
                Set your current availability status
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="availability" className="text-sm">Availability Status</Label>
              <Select
                value={watch('availability') || profile?.availability || 'AVAILABLE'}
                onValueChange={(value) => setValue('availability', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="AT_CAPACITY">At Capacity</SelectItem>
                  <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button type="submit" size="sm" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
      </div>
    </ConsultantPageLayout>
  );
}
