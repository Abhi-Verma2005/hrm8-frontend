/**
 * Consultant Profile Page
 * Self-service profile management for consultants
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService, ConsultantProfile } from '@/lib/consultant/consultantService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsultantPageLayout } from '@/components/layouts/ConsultantPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2, UploadCloud } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function ConsultantProfilePage() {
  const { consultant } = useConsultantAuth();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [languages, setLanguages] = useState<Array<{ language: string; proficiency: string }>>([]);
  const [industryExpertise, setIndustryExpertise] = useState<string[]>([]);
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);

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

        const langs = consultantData.languages && consultantData.languages.length
          ? consultantData.languages
          : [{ language: '', proficiency: '' }];
        setLanguages(langs);
        setValue('languages', langs);

        const expertise = consultantData.industryExpertise || [];
        setIndustryExpertise(expertise);
        setValue('industryExpertise', expertise);

        if (consultantData.resumeUrl) {
          setResumeLabel(consultantData.resumeUrl);
        }
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
      const payload = {
        ...data,
        languages,
        industryExpertise,
      };

      const response = await consultantService.updateProfile(payload);
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

  const isOnboarding = searchParams.get('onboarding') === '1';

  const handleAddLanguage = () => {
    const updated = [...languages, { language: '', proficiency: '' }];
    setLanguages(updated);
    setValue('languages', updated);
  };

  const handleRemoveLanguage = (index: number) => {
    const updated = languages.filter((_, i) => i !== index);
    setLanguages(updated.length ? updated : [{ language: '', proficiency: '' }]);
    setValue('languages', updated.length ? updated : [{ language: '', proficiency: '' }]);
  };

  const handleLanguageChange = (index: number, field: 'language' | 'proficiency', value: string) => {
    const updated = languages.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setLanguages(updated);
    setValue('languages', updated);
  };

  const INDUSTRY_NICHES: string[] = [
    'Technology',
    'Finance',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Hospitality',
    'Logistics',
    'Marketing',
    'Sales',
    'Customer Support',
  ];

  const toggleIndustry = (niche: string) => {
    const exists = industryExpertise.includes(niche);
    let updated: string[];
    if (exists) {
      updated = industryExpertise.filter((n) => n !== niche);
    } else {
      if (industryExpertise.length >= 5) {
        toast.error('You can select up to 5 industry niches only');
        return;
      }
      updated = [...industryExpertise, niche];
    }
    setIndustryExpertise(updated);
    setValue('industryExpertise', updated);
  };

  const handleMockResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Mock upload: just store the file name as resumeUrl
    setResumeLabel(file.name);
    setValue('resumeUrl', file.name);
  };

  return (
    <ConsultantPageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader
          title="Profile"
          subtitle="Manage your profile information"
        />

        {isOnboarding && (
          <Alert className="border-primary/40 bg-primary/5">
            <AlertTitle>Complete your consultant profile</AlertTitle>
            <AlertDescription>
              Please fill in the required information so we can match you with the right jobs and handle payments correctly.
            </AlertDescription>
          </Alert>
        )}

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

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm">LinkedIn (optional)</Label>
                <Input id="linkedin" placeholder="https://www.linkedin.com/in/your-profile" {...register('linkedinUrl')} />
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
              <CardTitle className="text-base font-semibold">Languages</CardTitle>
              <CardDescription className="text-sm">
                Add the languages you work with and your proficiency level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {languages.map((lang, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-6 space-y-2">
                    <Label className="text-xs">Language</Label>
                    <Input
                      placeholder="e.g. English"
                      value={lang.language}
                      onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                    />
                  </div>
                  <div className="col-span-5 space-y-2">
                    <Label className="text-xs">Proficiency</Label>
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) => handleLanguageChange(index, 'proficiency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">Basic</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="FLUENT">Fluent</SelectItem>
                        <SelectItem value="NATIVE">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex items-end">
                    {languages.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLanguage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLanguage}
                className="mt-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Language
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Industry Expertise</CardTitle>
              <CardDescription className="text-sm">
                Select up to 5 industry niches where you are strongest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_NICHES.map((niche) => {
                  const selected = industryExpertise.includes(niche);
                  return (
                    <Badge
                      key={niche}
                      variant={selected ? 'default' : 'outline'}
                      className="cursor-pointer px-3 py-1 text-xs"
                      onClick={() => toggleIndustry(niche)}
                    >
                      {niche}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Payment Details</CardTitle>
              <CardDescription className="text-sm">
                Provide information so we can process your commissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Preferred Method</Label>
                  <Select
                    defaultValue="bank"
                    onValueChange={(value) => setValue('paymentMethod.type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Account / Details</Label>
                  <Input
                    placeholder="IBAN / Account number / PayPal email"
                    {...register('paymentMethod.details')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tax Information</CardTitle>
              <CardDescription className="text-sm">
                Basic tax details (for now kept simple and region-agnostic)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Tax ID / Number</Label>
                  <Input placeholder="e.g. VAT, GST, SSN (as applicable)" {...register('taxInformation.taxId')} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Tax Region</Label>
                  <Input placeholder="Country / State for tax purposes" {...register('taxInformation.region')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Notes (optional)</Label>
                <Textarea
                  rows={3}
                  placeholder="Any additional tax notes or context"
                  {...register('taxInformation.notes')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Resume / CV (Mock Upload)</CardTitle>
              <CardDescription className="text-sm">
                Optional – for internal reference only. This is a mocked upload, we only store the file name.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('consultant-resume-input')?.click()}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Choose File (Mock)
                </Button>
                {resumeLabel && (
                  <span className="text-xs text-muted-foreground truncate max-w-xs">
                    Selected: {resumeLabel}
                  </span>
                )}
              </div>
              <input
                id="consultant-resume-input"
                type="file"
                className="hidden"
                onChange={handleMockResumeUpload}
              />
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
