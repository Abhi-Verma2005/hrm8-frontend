/**
 * Register Page
 * Company registration page
 */

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { VerificationEmailCard } from '@/components/auth/VerificationEmailCard';
import { authService } from '@/lib/authService';

const LAST_VERIFICATION_KEY = 'hrm8LastVerification';

const registerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().url('Invalid website URL'),
  adminEmail: z.string().email('Invalid email address'),
  adminName: z.string().min(1, 'Admin name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState<string>('');
  const { registerCompany, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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
          adminName: '',
          password: '',
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
            <div className="space-y-2">
              <Label htmlFor="adminName">Admin Name</Label>
              <Input
                id="adminName"
                placeholder="John Doe"
                {...register('adminName')}
                disabled={isLoading}
              />
              {errors.adminName && (
                <p className="text-sm text-destructive">{errors.adminName.message}</p>
              )}
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
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

