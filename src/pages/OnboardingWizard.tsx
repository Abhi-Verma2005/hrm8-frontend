import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  COMPANY_PROFILE_SECTION_ENUM,
  CompanyProfileBasicDetails,
  CompanyProfileData,
  CompanyProfileLocation,
  CompanyProfileSectionKey,
} from '@/types/companyProfile';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MapPin, ShieldCheck } from 'lucide-react';
import { FormMultiSelect } from '@/components/common/form-fields';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const companySizeOptions = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1,000',
  '1,001-5,000',
  '5,001-10,000',
  '10,001+',
];

const industrySuggestions = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Hospitality',
];

const defaultLocation = (): CompanyProfileLocation => ({
  id: crypto.randomUUID(),
  name: '',
  streetAddress: '',
  city: '',
  stateOrRegion: '',
  postalCode: '',
  country: '',
  isPrimary: false,
});

const onboardingSections: Array<{
  key: CompanyProfileSectionKey;
  title: string;
  description: string;
  required: boolean;
}> = [
  {
    key: 'basicDetails',
    title: 'Basic Company Details',
    description: 'Tell us about your company, size, and industry focus.',
    required: true,
  },
  {
    key: 'primaryLocation',
    title: 'Primary Location',
    description: 'Where is your headquarters? You can add multiple locations.',
    required: true,
  },
  {
    key: 'personalProfile',
    title: 'Personal Profile',
    description: 'Let candidates know who is welcoming them.',
    required: false,
  },
  {
    key: 'teamMembers',
    title: 'Add Team Members',
    description: 'Invite colleagues to collaborate and approve hiring steps.',
    required: false,
  },
  {
    key: 'billing',
    title: 'Billing Setup',
    description: 'Choose PAYG or subscription and provide billing details.',
    required: false,
  },
  {
    key: 'branding',
    title: 'Branding & Careers Page',
    description: 'Create a branded experience for candidates.',
    required: false,
  },
];

const enumToKeyMap = Object.entries(COMPANY_PROFILE_SECTION_ENUM).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value]: key as CompanyProfileSectionKey,
  }),
  {} as Record<string, CompanyProfileSectionKey>
);

export default function OnboardingWizard() {
  const { data, isLoading, savingSection, isCompleting, saveSection, completeProfile } =
    useCompanyProfile();
  const { profileSummary, snoozeOnboardingReminder } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const profile = data?.profile;
  const [activeSection, setActiveSection] = useState<CompanyProfileSectionKey>('basicDetails');

  useEffect(() => {
    if (profile?.status === 'COMPLETED') {
      setActiveSection('branding');
    }
  }, [profile?.status]);

  const completedSectionKeys = useMemo(() => {
    if (!profile) {
      return new Set<CompanyProfileSectionKey>();
    }
    return new Set(
      profile.completedSections
        .map((section) => enumToKeyMap[section])
        .filter(Boolean) as CompanyProfileSectionKey[]
    );
  }, [profile]);

  const requiredSectionKeys = onboardingSections.filter((section) => section.required).map((section) => section.key);
  const hasAllRequired = requiredSectionKeys.every((key) => completedSectionKeys.has(key));
  const canCompleteProfile = profileSummary?.status !== 'COMPLETED' && hasAllRequired;

  const handleSkip = () => {
    snoozeOnboardingReminder(6);
    toast({
      title: 'Onboarding paused',
      description: 'We will remind you to finish your company profile later today.',
    });
    navigate('/home');
  };

  if (isLoading && !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const profileData = profile?.profileData || ({} as CompanyProfileData);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Step 3</p>
          <h1 className="text-3xl font-semibold text-foreground">
            Let’s set up your company profile
          </h1>
          <p className="text-muted-foreground">
            Capture company details, invite your team, and configure billing so you’re ready to post
            your first job.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button
            disabled={!canCompleteProfile}
            onClick={completeProfile}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
          >
            {isCompleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finishing...
              </>
            ) : (
              'Mark profile complete'
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding progress</CardTitle>
          <CardDescription>
            Complete the required sections to unlock job posting and billing features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={profile?.completionPercentage || 0} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {onboardingSections.map((section) => {
              const isComplete =
                completedSectionKeys.has(section.key) ||
                (profile?.status === 'COMPLETED' && !section.required);
              return (
                <div
                  key={section.key}
                  className={cn(
                    'rounded-lg border p-4 transition',
                    isComplete ? 'border-emerald-500/40 bg-emerald-500/5' : 'bg-muted/40'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{section.title}</p>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <Badge variant={isComplete ? 'outline' : 'secondary'}>
                      {isComplete ? 'Done' : section.required ? 'Required' : 'Optional'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as CompanyProfileSectionKey)}>
        <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
          {onboardingSections.map((section) => (
            <TabsTrigger
              key={section.key}
              value={section.key}
              className={cn(
                'flex flex-1 min-w-[150px] flex-col rounded-xl border px-4 py-3 text-left',
                completedSectionKeys.has(section.key)
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'bg-muted/60'
              )}
            >
              <span className="text-sm font-medium">{section.title}</span>
              <span className="text-xs text-muted-foreground">
                {section.required ? 'Required' : 'Optional'}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="basicDetails">
          <BasicDetailsSection
            initialData={profileData.basicDetails}
            onSave={(values) => saveSection('basicDetails', values, { successMessage: 'Basic company details updated.' })}
            isSaving={savingSection === 'basicDetails'}
          />
        </TabsContent>

        <TabsContent value="primaryLocation">
          <PrimaryLocationSection
            initialData={{
              primary: profileData.primaryLocation,
              additional: profileData.additionalLocations || [],
            }}
            onSave={(values) =>
              saveSection('primaryLocation', values, { successMessage: 'Location details saved.' })
            }
            isSaving={savingSection === 'primaryLocation'}
          />
        </TabsContent>

        <TabsContent value="personalProfile">
          <PersonalProfileSection
            initialData={profileData.personalProfile}
            onSave={(values) =>
              saveSection('personalProfile', values, { successMessage: 'Personal profile updated.' })
            }
            isSaving={savingSection === 'personalProfile'}
          />
        </TabsContent>

        <TabsContent value="teamMembers">
          <TeamMembersSection
            initialData={profileData.teamMembers}
            onSave={(values) =>
              saveSection('teamMembers', values, { successMessage: 'Team members updated.' })
            }
            isSaving={savingSection === 'teamMembers'}
          />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSection
            initialData={profileData.billing}
            onSave={(values) =>
              saveSection('billing', values, { successMessage: 'Billing preferences saved.' })
            }
            isSaving={savingSection === 'billing'}
          />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingSection
            initialData={profileData.branding}
            onSave={(values) =>
              saveSection('branding', values, { successMessage: 'Branding preferences saved.' })
            }
            isSaving={savingSection === 'branding'}
          />
        </TabsContent>
      </Tabs>

      {profile?.status === 'COMPLETED' && (
        <Alert className="bg-emerald-600/10 text-emerald-800 dark:text-emerald-100">
          <ShieldCheck className="h-5 w-5" />
          <AlertTitle>Congratulations, you’re ready to post your first job!</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              Your company profile is complete. Configure settings or jump straight into the
              dashboard to start hiring.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/settings')}>
                Configure company settings
              </Button>
              <Button onClick={() => navigate('/home')}>Go to dashboard</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface SectionProps<T> {
  initialData?: T;
  onSave: (payload: any) => Promise<void>;
  isSaving: boolean;
}

function BasicDetailsSection({
  initialData,
  onSave,
  isSaving,
}: SectionProps<CompanyProfileBasicDetails>) {
  const schema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    companySize: z.string().min(1, 'Company size is required'),
    industries: z.array(z.string().min(1)).min(1, 'Select at least one industry').max(3),
    phoneCountryCode: z.string().min(1, 'Country code is required'),
    phoneNumber: z.string().min(5, 'Phone number is required'),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    yearFounded: z
      .string()
      .optional()
      .refine((value) => !value || /^\d{4}$/.test(value), {
        message: 'Enter a valid year',
      }),
    overview: z.string().optional(),
    logoUrl: z.string().url().optional().or(z.literal('')),
    iconUrl: z.string().url().optional().or(z.literal('')),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: initialData?.companyName || '',
      companySize: initialData?.companySize || '',
      industries: initialData?.industries || [],
      phoneCountryCode: initialData?.phone?.countryCode || '+1',
      phoneNumber: initialData?.phone?.number || '',
      websiteUrl: initialData?.websiteUrl || '',
      yearFounded: initialData?.yearFounded ? String(initialData.yearFounded) : '',
      overview: initialData?.overview || '',
      logoUrl: initialData?.logoUrl || '',
      iconUrl: initialData?.iconUrl || '',
    },
  });

  useEffect(() => {
    form.reset({
      companyName: initialData?.companyName || '',
      companySize: initialData?.companySize || '',
      industries: initialData?.industries || [],
      phoneCountryCode: initialData?.phone?.countryCode || '+1',
      phoneNumber: initialData?.phone?.number || '',
      websiteUrl: initialData?.websiteUrl || '',
      yearFounded: initialData?.yearFounded ? String(initialData.yearFounded) : '',
      overview: initialData?.overview || '',
      logoUrl: initialData?.logoUrl || '',
      iconUrl: initialData?.iconUrl || '',
    });
  }, [form, initialData]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave({
      companyName: values.companyName,
      companySize: values.companySize,
      industries: values.industries,
      phone: {
        countryCode: values.phoneCountryCode,
        number: values.phoneNumber,
        type: 'work',
      },
      websiteUrl: values.websiteUrl || undefined,
      yearFounded: values.yearFounded ? Number(values.yearFounded) : undefined,
      overview: values.overview,
      logoUrl: values.logoUrl || undefined,
      iconUrl: values.iconUrl || undefined,
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Company Details</CardTitle>
        <CardDescription>
          Share the essentials so candidates understand who you are at a glance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input placeholder="HRM8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company size</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option} employees
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormMultiSelect
              form={form}
              name="industries"
              label="Industries (select up to 3)"
              suggestions={industrySuggestions}
              required
              maxItems={3}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="phoneCountryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country code</FormLabel>
                    <FormControl>
                      <Input placeholder="+1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Company phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearFounded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year founded</FormLabel>
                    <FormControl>
                      <Input placeholder="2019" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company overview</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Share your mission, values, and culture." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Upload or paste an image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Upload or paste an icon URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save basic details'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PrimaryLocationSection({
  initialData,
  onSave,
  isSaving,
}: SectionProps<{ primary?: CompanyProfileLocation; additional: CompanyProfileLocation[] }>) {
  const locationSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Location name is required'),
    streetAddress: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    stateOrRegion: z.string().min(1, 'State/Region is required'),
    postalCode: z.string().min(1, 'Zip/Postcode is required'),
    country: z.string().min(1, 'Country is required'),
  });

  const schema = z.object({
    primary: locationSchema,
    additional: z.array(locationSchema).optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      primary: initialData?.primary || { ...defaultLocation(), isPrimary: true },
      additional: initialData?.additional || [],
    },
  });

  useEffect(() => {
    form.reset({
      primary: initialData?.primary || { ...defaultLocation(), isPrimary: true },
      additional: initialData?.additional || [],
    });
  }, [form, initialData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'additional',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave(values);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Locations</CardTitle>
        <CardDescription>
          Identify your primary location and any additional offices that require access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" /> Primary location (required)
              </div>
              <LocationFields control={form.control} prefix="primary" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Additional locations</p>
                  <p className="text-sm text-muted-foreground">
                    Add satellite offices or remote hubs (optional).
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append(defaultLocation())}
                >
                  Add location
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">No additional locations added.</p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="rounded-xl border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium">Location #{index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <LocationFields control={form.control} prefix={`additional.${index}`} />
                </div>
              ))}
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save location details'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function LocationFields({ control, prefix }: { control: any; prefix: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name={`${prefix}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location name</FormLabel>
            <FormControl>
              <Input placeholder="Melbourne HQ" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.streetAddress`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street address</FormLabel>
            <FormControl>
              <Input placeholder="123 Collins Street" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.city`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.stateOrRegion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>State / Region</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.postalCode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zip / Postcode</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.country`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function PersonalProfileSection({ initialData, onSave, isSaving }: SectionProps<any>) {
  const schema = z.object({
    positionTitle: z.string().optional(),
    phoneType: z.enum(['mobile', 'work', 'office']).default('work'),
    phoneCountryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    location: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      positionTitle: initialData?.positionTitle || '',
      phoneType: initialData?.phone?.type || 'work',
      phoneCountryCode: initialData?.phone?.countryCode || '+1',
      phoneNumber: initialData?.phone?.number || '',
      location: initialData?.location || '',
    },
  });

  useEffect(() => {
    form.reset({
      positionTitle: initialData?.positionTitle || '',
      phoneType: initialData?.phone?.type || 'work',
      phoneCountryCode: initialData?.phone?.countryCode || '+1',
      phoneNumber: initialData?.phone?.number || '',
      location: initialData?.location || '',
    });
  }, [form, initialData]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave({
      positionTitle: values.positionTitle,
      phone:
        values.phoneNumber && values.phoneCountryCode
          ? {
              type: values.phoneType,
              countryCode: values.phoneCountryCode,
              number: values.phoneNumber,
            }
          : undefined,
      location: values.location,
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal profile</CardTitle>
        <CardDescription>
          Add a friendly face to your hiring experience (optional but recommended).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="positionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your position title</FormLabel>
                  <FormControl>
                    <Input placeholder="Head of Talent Acquisition" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="phoneType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneCountryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country code</FormLabel>
                    <FormControl>
                      <Input placeholder="+61" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="(03) 5555 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred location</FormLabel>
                  <FormControl>
                    <Input placeholder="Melbourne, Australia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save personal profile'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function TeamMembersSection({ initialData, onSave, isSaving }: SectionProps<any>) {
  const schema = z.object({
    invites: z
      .array(
        z.object({
          email: z.string().email('Valid email is required'),
          role: z.string().min(1, 'Role is required'),
          authorizationLevel: z.string().optional(),
          approvalLevel: z.string().optional(),
        })
      )
      .default([]),
    defaultAdminId: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      invites: initialData?.invites || [],
      defaultAdminId: initialData?.defaultAdminId || '',
    },
  });

  useEffect(() => {
    form.reset({
      invites: initialData?.invites || [],
      defaultAdminId: initialData?.defaultAdminId || '',
    });
  }, [form, initialData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'invites',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave(values);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite team members</CardTitle>
        <CardDescription>
          Add future admins, approvers, or collaborators. Invitations go out once you launch hiring.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No teammates added yet. Start with your finance or recruiting partners.
                </p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="rounded-xl border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Invite #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        First invite becomes Account Admin by default.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`invites.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work email</FormLabel>
                          <FormControl>
                            <Input placeholder="teammate@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`invites.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Account Admin, Recruiter, Finance..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`invites.${index}.authorizationLevel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authorization level</FormLabel>
                          <FormControl>
                            <Input placeholder="Can approve offers, manage billing, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`invites.${index}.approvalLevel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approval level</FormLabel>
                          <FormControl>
                            <Input placeholder="Hiring approvals, expenses, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  email: '',
                  role: 'Account Admin',
                  authorizationLevel: '',
                  approvalLevel: '',
                })
              }
            >
              Add teammate
            </Button>

            <FormField
              control={form.control}
              name="defaultAdminId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default account admin</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teammate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fields.length === 0 && (
                        <SelectItem value="">No teammates added yet</SelectItem>
                      )}
                      {fields.map((field, index) => (
                        <SelectItem key={field.id} value={form.watch(`invites.${index}.email`)}>
                          {form.watch(`invites.${index}.email`) || `Invite #${index + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save team members'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function BillingSection({ initialData, onSave, isSaving }: SectionProps<any>) {
  const schema = z.object({
    paymentPreference: z.enum(['payg', 'subscription']).default('payg'),
    subscriptionPlan: z.string().optional(),
    registeredBusinessName: z.string().optional(),
    taxId: z.string().optional(),
    registeredCountry: z.string().optional(),
    isCharity: z.boolean().optional(),
    accountsEmail: z.string().email('Enter a valid email').optional(),
    billingStreet: z.string().optional(),
    billingCity: z.string().optional(),
    billingState: z.string().optional(),
    billingPostalCode: z.string().optional(),
    billingCountry: z.string().optional(),
    paymentMethod: z.enum(['card', 'invoice', 'bank']).optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentPreference: initialData?.paymentPreference || 'payg',
      subscriptionPlan: initialData?.subscriptionPlan || '',
      registeredBusinessName: initialData?.registeredBusinessName || '',
      taxId: initialData?.taxId || '',
      registeredCountry: initialData?.registeredCountry || '',
      isCharity: initialData?.isCharity || false,
      accountsEmail: initialData?.accountsEmail || '',
      billingStreet: initialData?.billingAddress?.street || '',
      billingCity: initialData?.billingAddress?.city || '',
      billingState: initialData?.billingAddress?.stateOrRegion || '',
      billingPostalCode: initialData?.billingAddress?.postalCode || '',
      billingCountry: initialData?.billingAddress?.country || '',
      paymentMethod: initialData?.paymentMethod?.type || 'invoice',
    },
  });

  useEffect(() => {
    form.reset({
      paymentPreference: initialData?.paymentPreference || 'payg',
      subscriptionPlan: initialData?.subscriptionPlan || '',
      registeredBusinessName: initialData?.registeredBusinessName || '',
      taxId: initialData?.taxId || '',
      registeredCountry: initialData?.registeredCountry || '',
      isCharity: initialData?.isCharity || false,
      accountsEmail: initialData?.accountsEmail || '',
      billingStreet: initialData?.billingAddress?.street || '',
      billingCity: initialData?.billingAddress?.city || '',
      billingState: initialData?.billingAddress?.stateOrRegion || '',
      billingPostalCode: initialData?.billingAddress?.postalCode || '',
      billingCountry: initialData?.billingAddress?.country || '',
      paymentMethod: initialData?.paymentMethod?.type || 'invoice',
    });
  }, [form, initialData]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave({
      paymentPreference: values.paymentPreference,
      subscriptionPlan: values.subscriptionPlan || undefined,
      registeredBusinessName: values.registeredBusinessName,
      taxId: values.taxId,
      registeredCountry: values.registeredCountry,
      isCharity: values.isCharity,
      accountsEmail: values.accountsEmail,
      billingAddress:
        values.billingStreet ||
        values.billingCity ||
        values.billingState ||
        values.billingPostalCode ||
        values.billingCountry
          ? {
              street: values.billingStreet,
              city: values.billingCity,
              stateOrRegion: values.billingState,
              postalCode: values.billingPostalCode,
              country: values.billingCountry,
            }
          : undefined,
      paymentMethod:
        values.paymentMethod !== undefined
          ? {
              type: values.paymentMethod,
            }
          : undefined,
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing setup</CardTitle>
        <CardDescription>
          Choose how you’d like to pay (PAYG or subscription) and provide billing info.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="paymentPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing preference</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="payg">PAYG</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscriptionPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan (if subscription)</FormLabel>
                    <FormControl>
                      <Input placeholder="Growth, Enterprise, PAYG..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="registeredBusinessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered business name</FormLabel>
                    <FormControl>
                      <Input placeholder="HRM8 Pty Ltd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ABN / GST / VAT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="registeredCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered country</FormLabel>
                    <FormControl>
                      <Input placeholder="Australia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountsEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accounts email</FormLabel>
                    <FormControl>
                      <Input placeholder="accounts@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <FormField
                control={form.control}
                name="isCharity"
                render={({ field }) => (
                  <>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <div>
                      <p className="font-medium">Registered Charity / NFP</p>
                      <p className="text-sm text-muted-foreground">
                        Provide supporting documentation for HRM8 admin approval.
                      </p>
                    </div>
                  </>
                )}
              />
            </div>

            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="billingStreet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing street</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Region</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingPostalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment method</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="card">Credit / Debit Card</SelectItem>
                      <SelectItem value="invoice">Invoice / PO</SelectItem>
                      <SelectItem value="bank">Bank transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save billing details'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function BrandingSection({ initialData, onSave, isSaving }: SectionProps<any>) {
  const schema = z.object({
    careersPageEnabled: z.boolean().optional(),
    brandColor: z.string().optional(),
    subdomain: z.string().optional(),
    companyIntroduction: z.string().optional(),
    logoUrl: z.string().optional(),
    iconUrl: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      careersPageEnabled: initialData?.careersPageEnabled || false,
      brandColor: initialData?.brandColor || '#7c3aed',
      subdomain: initialData?.subdomain || '',
      companyIntroduction: initialData?.companyIntroduction || '',
      logoUrl: initialData?.logoUrl || '',
      iconUrl: initialData?.iconUrl || '',
    },
  });

  useEffect(() => {
    form.reset({
      careersPageEnabled: initialData?.careersPageEnabled || false,
      brandColor: initialData?.brandColor || '#7c3aed',
      subdomain: initialData?.subdomain || '',
      companyIntroduction: initialData?.companyIntroduction || '',
      logoUrl: initialData?.logoUrl || '',
      iconUrl: initialData?.iconUrl || '',
    });
  }, [form, initialData]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave(values);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding & careers page</CardTitle>
        <CardDescription>
          Shine on the HRM8 Employers page and your own branded careers experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <FormField
                control={form.control}
                name="careersPageEnabled"
                render={({ field }) => (
                  <>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <div>
                      <p className="font-medium">Build corporate careers page</p>
                      <p className="text-sm text-muted-foreground">
                        Showcase roles on a branded subdomain with curated content.
                      </p>
                    </div>
                  </>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="brandColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input type="color" className="h-12 w-16 p-1" value={field.value} onChange={field.onChange} />
                        <Input value={field.value} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Careers page subdomain</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input placeholder="careers" {...field} />
                        <span className="text-sm text-muted-foreground">.hrm8.com</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://cdn.hrm8.com/logo.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://cdn.hrm8.com/icon.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyIntroduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company introduction</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Share your story, EVP, and why top talent should join."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save branding'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

