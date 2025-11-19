/**
 * Register Page
 * Company registration page
 */

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Eye, EyeOff } from 'lucide-react';
import { VerificationEmailCard } from '@/components/auth/VerificationEmailCard';
import { authService } from '@/lib/authService';
import countries from 'world-countries';

const LAST_VERIFICATION_KEY = 'hrm8LastVerification';

// Sort countries alphabetically by name
const sortedCountries = countries
  .map((country) => ({
    name: country.name.common,
    code: country.cca2,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const registerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().url('Invalid website URL'),
  adminFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  adminLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid business email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  countryOrRegion: z.string().min(2, 'Country or region is required'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms & Conditions and Privacy Policy' }),
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState<string>('');
  const [countrySearch, setCountrySearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { registerCompany, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const handleExternalVerification = useCallback(
    (verifiedEmail?: string) => {
      if (!verifiedEmail) {
        return;
      }

      setEmailSent(false);
      setSentToEmail(verifiedEmail);
      reset();
      navigate(
        `/login?verified=true&email=${encodeURIComponent(verifiedEmail)}`,
        { replace: true }
      );
    },
    [navigate, reset]
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const verified = searchParams.get('verified') === 'true';
    const verifiedEmail = searchParams.get('email');

    if (verified) {
      setEmailSent(false);
      if (verifiedEmail) {
        reset({
          companyName: '',
          companyWebsite: '',
          adminEmail: verifiedEmail,
          adminFirstName: '',
          adminLastName: '',
          countryOrRegion: '',
          password: '',
          acceptTerms: false,
        });
      } else {
        reset();
      }
    }
  }, [searchParams, reset]);

  useEffect(() => {
    const processLastVerification = (rawValue: string | null) => {
      if (!rawValue) {
        return;
      }

      try {
        const payload = JSON.parse(rawValue) as { email?: string };
        if (payload?.email) {
          handleExternalVerification(payload.email);
          localStorage.removeItem(LAST_VERIFICATION_KEY);
        }
      } catch {
        // Ignore malformed payloads
      }
    };

    processLastVerification(localStorage.getItem(LAST_VERIFICATION_KEY));

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LAST_VERIFICATION_KEY && event.newValue) {
        processLastVerification(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [handleExternalVerification]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    const result = await registerCompany(data);
    setIsLoading(false);
    
    if (result.success) {
      if (result.verificationRequired) {
        // Show email sent confirmation
        setEmailSent(true);
        setSentToEmail(result.email || data.adminEmail);
      } else {
        // Auto-verified, navigate to home
        navigate('/home');
      }
    }
  };

  // Show email sent confirmation
  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4 space-y-4">
        <VerificationEmailCard
          email={sentToEmail}
          backLabel="Back to registration"
          onBack={() => {
            setEmailSent(false);
            reset();
            navigate('/register', { replace: true });
          }}
          watchVerification
          onVerified={(verifiedEmail) => {
            handleExternalVerification(verifiedEmail);
          }}
          onResend={async () => {
            const response = await authService.resendVerification(sentToEmail);
            if (!response.success) {
              throw new Error(response.error || 'Failed to resend verification email.');
            }
          }}
        />
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link
            to={`/login?pendingEmail=${encodeURIComponent(sentToEmail)}`}
            className="text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Register your company</CardTitle>
          <CardDescription className="text-center">
            Create a new company account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Acme Inc."
                {...register('companyName')}
                disabled={isLoading}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                type="url"
                placeholder="https://www.example.com"
                {...register('companyWebsite')}
                disabled={isLoading}
              />
              {errors.companyWebsite && (
                <p className="text-sm text-destructive">{errors.companyWebsite.message}</p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adminFirstName">Admin First Name</Label>
                <Input
                  id="adminFirstName"
                  placeholder="John"
                  {...register('adminFirstName')}
                  disabled={isLoading}
                />
                {errors.adminFirstName && (
                  <p className="text-sm text-destructive">{errors.adminFirstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminLastName">Admin Last Name</Label>
                <Input
                  id="adminLastName"
                  placeholder="Doe"
                  {...register('adminLastName')}
                  disabled={isLoading}
                />
                {errors.adminLastName && (
                  <p className="text-sm text-destructive">{errors.adminLastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@example.com"
                {...register('adminEmail')}
                disabled={isLoading}
              />
              {errors.adminEmail && (
                <p className="text-sm text-destructive">{errors.adminEmail.message}</p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryOrRegion">Country / Region</Label>
                <Controller
                  control={control}
                  name="countryOrRegion"
                  render={({ field }) => {
                    const filteredCountries = countrySearch
                      ? sortedCountries.filter((country) =>
                          country.name.toLowerCase().includes(countrySearch.toLowerCase())
                        )
                      : sortedCountries;

                    return (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setCountrySearch('');
                        }}
                        onOpenChange={(open) => {
                          if (!open) {
                            setCountrySearch('');
                          }
                        }}
                        value={field.value || undefined}
                        disabled={isLoading}
                      >
                        <SelectTrigger id="countryOrRegion">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <div className="sticky top-0 z-10 bg-popover p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search countries..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="pl-8 h-9"
                              />
                            </div>
                          </div>
                          <div className="max-h-[250px] overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <SelectItem key={country.code} value={country.name}>
                                  {country.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="py-6 text-center text-sm text-muted-foreground">
                                No countries found
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                {errors.countryOrRegion && (
                  <p className="text-sm text-destructive">{errors.countryOrRegion.message}</p>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-md border p-4">
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field }) => (
                  <Checkbox
                    id="register-acceptTerms"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    disabled={isLoading}
                  />
                )}
              />
              <div className="space-y-1 text-sm">
                <Label htmlFor="register-acceptTerms" className="text-sm font-medium leading-none">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>
                </Label>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

