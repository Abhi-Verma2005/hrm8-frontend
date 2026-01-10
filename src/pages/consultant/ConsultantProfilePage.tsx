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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Save, Plus, X, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';
import { DeveloperTools } from '@/components/dev/DeveloperTools';

const COMMON_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian', 'Polish',
  'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek', 'Turkish', 'Hebrew'
];

const PROFICIENCY_LEVELS = [
  { value: 'NATIVE', label: 'Native' },
  { value: 'FLUENT', label: 'Fluent' },
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'CONVERSATIONAL', label: 'Conversational' },
  { value: 'BASIC', label: 'Basic' },
];

const COMMON_INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
  'Education', 'Real Estate', 'Hospitality', 'Transportation', 'Energy',
  'Media & Entertainment', 'Telecommunications', 'Aerospace', 'Automotive',
  'Construction', 'Food & Beverage', 'Pharmaceuticals', 'Biotechnology',
  'Legal Services', 'Consulting', 'Marketing & Advertising', 'Non-profit'
];

export default function ConsultantProfilePage() {
  const { consultant } = useConsultantAuth();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === '1';
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [languages, setLanguages] = useState<Array<{ language: string; proficiency: string }>>([]);
  const [industryExpertise, setIndustryExpertise] = useState<string[]>([]);

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
        
        // Set languages
        if (Array.isArray(consultantData.languages)) {
          setLanguages(consultantData.languages);
        }
        
        // Set industry expertise
        if (Array.isArray(consultantData.industryExpertise)) {
          setIndustryExpertise(consultantData.industryExpertise);
        }
        
        // Set payment method
        if (consultantData.paymentMethod) {
          const payment = consultantData.paymentMethod as any;
          setValue('paymentMethodType', payment.type || '');
          setValue('paymentAccountName', payment.accountName || '');
          setValue('paymentAccountNumber', payment.accountNumber || '');
          setValue('paymentRoutingNumber', payment.routingNumber || '');
          setValue('paymentBankName', payment.bankName || '');
          setValue('paymentPayPalEmail', payment.paypalEmail || '');
          setValue('paymentOtherDetails', payment.otherDetails || '');
        }
        
        // Set tax information
        if (consultantData.taxInformation) {
          const tax = consultantData.taxInformation as any;
          setValue('taxId', tax.taxId || '');
          setValue('taxIdType', tax.taxIdType || '');
          setValue('taxCountry', tax.country || '');
          setValue('taxStateProvince', tax.stateProvince || '');
        }
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: '', proficiency: '' }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: 'language' | 'proficiency', value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  const addIndustry = (industry: string) => {
    if (industryExpertise.length >= 5) {
      toast.error('You can add up to 5 industries');
      return;
    }
    if (!industryExpertise.includes(industry)) {
      setIndustryExpertise([...industryExpertise, industry]);
    }
  };

  const removeIndustry = (industry: string) => {
    setIndustryExpertise(industryExpertise.filter(i => i !== industry));
  };

  const onSubmit = async (data: any) => {
    try {
      setSaving(true);
      
      // Prepare payment method
      let paymentMethodData: Record<string, unknown> = {};
      if (data.paymentMethodType) {
        paymentMethodData = {
          type: data.paymentMethodType,
        };
        
        // Add payment-specific fields based on type
        if (data.paymentMethodType === 'bank_transfer') {
          if (data.paymentAccountName) paymentMethodData.accountName = data.paymentAccountName;
          if (data.paymentAccountNumber) paymentMethodData.accountNumber = data.paymentAccountNumber;
          if (data.paymentRoutingNumber) paymentMethodData.routingNumber = data.paymentRoutingNumber;
          if (data.paymentBankName) paymentMethodData.bankName = data.paymentBankName;
        } else if (data.paymentMethodType === 'paypal') {
          if (data.paymentPayPalEmail) paymentMethodData.paypalEmail = data.paymentPayPalEmail;
        } else if (data.paymentMethodType === 'other') {
          if (data.paymentOtherDetails) paymentMethodData.otherDetails = data.paymentOtherDetails;
        }
      }
      
      // Prepare tax information
      const taxInformationData: Record<string, unknown> = {};
      if (data.taxId || data.taxIdType || data.taxCountry) {
        if (data.taxId) taxInformationData.taxId = data.taxId;
        if (data.taxIdType) taxInformationData.taxIdType = data.taxIdType;
        if (data.taxCountry) taxInformationData.country = data.taxCountry;
        if (data.taxStateProvince) taxInformationData.stateProvince = data.taxStateProvince;
      }
      
      const updateData = {
        ...data,
        languages: languages.filter(l => l.language && l.proficiency),
        industryExpertise,
        paymentMethod: Object.keys(paymentMethodData).length > 0 ? paymentMethodData : undefined,
        taxInformation: Object.keys(taxInformationData).length > 0 ? taxInformationData : undefined,
      };
      
      // Remove form-only fields from updateData
      delete updateData.paymentMethodType;
      delete updateData.paymentAccountName;
      delete updateData.paymentAccountNumber;
      delete updateData.paymentRoutingNumber;
      delete updateData.paymentBankName;
      delete updateData.paymentPayPalEmail;
      delete updateData.paymentOtherDetails;
      delete updateData.paymentMethodDetails;
      delete updateData.taxId;
      delete updateData.taxIdType;
      delete updateData.taxCountry;
      delete updateData.taxStateProvince;
      delete updateData.taxInformationDetails;
      
      const response = await consultantService.updateProfile(updateData);
      if (response.success) {
        toast.success('Profile updated successfully');
        await loadProfile();
        // If onboarding, check if profile is now complete
        if (isOnboarding) {
          const profileResponse = await consultantService.getProfile();
          if (profileResponse.success && profileResponse.data?.consultant) {
            const hasBasicInfo =
              !!profileResponse.data.consultant.firstName &&
              !!profileResponse.data.consultant.lastName &&
              !!profileResponse.data.consultant.phone &&
              !!profileResponse.data.consultant.address &&
              !!profileResponse.data.consultant.city &&
              !!profileResponse.data.consultant.stateProvince &&
              !!profileResponse.data.consultant.country;
            const hasLanguages =
              Array.isArray(profileResponse.data.consultant.languages) &&
              profileResponse.data.consultant.languages.length > 0;
            const hasIndustries =
              Array.isArray(profileResponse.data.consultant.industryExpertise) &&
              profileResponse.data.consultant.industryExpertise.length > 0;
            const hasPayment =
              !!profileResponse.data.consultant.paymentMethod &&
              Object.keys(profileResponse.data.consultant.paymentMethod).length > 0;
            const hasTax =
              !!profileResponse.data.consultant.taxInformation &&
              Object.keys(profileResponse.data.consultant.taxInformation).length > 0;
            
            if (hasBasicInfo && hasLanguages && hasIndustries && hasPayment && hasTax) {
              toast.success('Profile completed! You can now receive job assignments.');
            }
          }
        }
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

        {isOnboarding && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Complete Your Profile</AlertTitle>
            <AlertDescription>
              To receive managed recruitment assignments and commissions, please complete all required sections below.
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
                Add languages you speak and your proficiency level
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.map((lang, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 space-y-2">
                  <Label className="text-sm">Language</Label>
                  <Select
                    value={lang.language}
                    onValueChange={(value) => updateLanguage(index, 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_LANGUAGES.map(l => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-5 space-y-2">
                  <Label className="text-sm">Proficiency</Label>
                  <Select
                    value={lang.proficiency}
                    onValueChange={(value) => updateLanguage(index, 'proficiency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeLanguage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addLanguage}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Language
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle className="text-base font-semibold">Industry Expertise</CardTitle>
              <CardDescription className="text-sm">
                Select up to 5 industries you specialize in
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {industryExpertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {industryExpertise.map((industry) => (
                  <div
                    key={industry}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
                  >
                    {industry}
                    <button
                      type="button"
                      onClick={() => removeIndustry(industry)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm">Add Industry</Label>
              <Select
                value=""
                onValueChange={addIndustry}
                disabled={industryExpertise.length >= 5}
              >
                <SelectTrigger>
                  <SelectValue placeholder={industryExpertise.length >= 5 ? "Maximum 5 industries" : "Select an industry"} />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_INDUSTRIES.filter(i => !industryExpertise.includes(i)).map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {industryExpertise.length >= 5 && (
                <p className="text-xs text-muted-foreground">You have reached the maximum of 5 industries</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
              <CardDescription className="text-sm">
                Configure how you want to receive payments
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethodType" className="text-sm">Payment Method Type</Label>
              <Select
                value={watch('paymentMethodType') || ''}
                onValueChange={(value) => setValue('paymentMethodType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="wise">Wise</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {watch('paymentMethodType') === 'bank_transfer' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentAccountName" className="text-sm">Account Name</Label>
                    <Input id="paymentAccountName" {...register('paymentAccountName')} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentBankName" className="text-sm">Bank Name</Label>
                    <Input id="paymentBankName" {...register('paymentBankName')} placeholder="Bank of America" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentAccountNumber" className="text-sm">Account Number</Label>
                    <Input id="paymentAccountNumber" {...register('paymentAccountNumber')} placeholder="123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentRoutingNumber" className="text-sm">Routing Number</Label>
                    <Input id="paymentRoutingNumber" {...register('paymentRoutingNumber')} placeholder="021000021" />
                  </div>
                </div>
              </>
            )}
            
            {watch('paymentMethodType') === 'paypal' && (
              <div className="space-y-2">
                <Label htmlFor="paymentPayPalEmail" className="text-sm">PayPal Email</Label>
                <Input id="paymentPayPalEmail" type="email" {...register('paymentPayPalEmail')} placeholder="your.email@example.com" />
              </div>
            )}
            
            {watch('paymentMethodType') === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="paymentOtherDetails" className="text-sm">Payment Details</Label>
                <Input id="paymentOtherDetails" {...register('paymentOtherDetails')} placeholder="Enter payment details" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle className="text-base font-semibold">Tax Information</CardTitle>
              <CardDescription className="text-sm">
                Provide tax information for your region
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taxIdType" className="text-sm">Tax ID Type</Label>
              <Select
                value={watch('taxIdType') || ''}
                onValueChange={(value) => setValue('taxIdType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SSN">SSN (Social Security Number - US)</SelectItem>
                  <SelectItem value="EIN">EIN (Employer Identification Number - US)</SelectItem>
                  <SelectItem value="ABN">ABN (Australian Business Number - Australia)</SelectItem>
                  <SelectItem value="GST">GST (Goods and Services Tax - India/Canada)</SelectItem>
                  <SelectItem value="VAT">VAT (Value Added Tax - EU/UK)</SelectItem>
                  <SelectItem value="NIN">NIN (National Insurance Number - UK)</SelectItem>
                  <SelectItem value="SIN">SIN (Social Insurance Number - Canada)</SelectItem>
                  <SelectItem value="TFN">TFN (Tax File Number - Australia)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId" className="text-sm">Tax ID Number</Label>
              <Input id="taxId" {...register('taxId')} placeholder="Enter your tax ID number" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxCountry" className="text-sm">Country</Label>
                <Input id="taxCountry" {...register('taxCountry')} placeholder="United States" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxStateProvince" className="text-sm">State/Province (if applicable)</Label>
                <Input id="taxStateProvince" {...register('taxStateProvince')} placeholder="California" />
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

        {/* Developer Tools - Only visible in development mode */}
        <DeveloperTools />
      </div>
    </ConsultantPageLayout>
  );
}
