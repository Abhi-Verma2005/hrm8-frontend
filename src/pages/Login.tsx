/**
 * Login Page
 * User authentication page
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { VerificationEmailCard } from '@/components/auth/VerificationEmailCard';
import { authService } from '@/lib/authService';

const LAST_VERIFICATION_KEY = 'hrm8LastVerification';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const pendingEmailParam = searchParams.get('pendingEmail');
  const verificationSuccess = searchParams.get('verified') === 'true';
  const verificationEmail = searchParams.get('email') || defaultEmail;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (defaultEmail) {
      setValue('email', defaultEmail);
    }
  }, [defaultEmail, setValue]);

  useEffect(() => {
    if (pendingEmailParam && !verificationSuccess) {
      setPendingVerificationEmail(pendingEmailParam);
      reset({ email: pendingEmailParam, password: '' });
    }
  }, [pendingEmailParam, reset, verificationSuccess]);

  useEffect(() => {
    if (verificationSuccess) {
      setPendingVerificationEmail(null);
    }
  }, [verificationSuccess]);

  const clearPendingVerification = useCallback(() => {
    setPendingVerificationEmail(null);
    const currentEmail = pendingVerificationEmail || defaultEmail || '';
    reset({ email: currentEmail, password: '' });

    if (pendingEmailParam) {
      const params = new URLSearchParams(searchParams);
      params.delete('pendingEmail');
      const nextSearch = params.toString();
      navigate(nextSearch ? `/login?${nextSearch}` : '/login', { replace: true });
    }
  }, [defaultEmail, navigate, pendingEmailParam, pendingVerificationEmail, reset, searchParams]);

  useEffect(() => {
    const processVerificationSignal = (rawValue: string | null) => {
      if (!rawValue) {
        return;
      }

      try {
        const payload = JSON.parse(rawValue) as { email?: string };
        if (!payload?.email) {
          return;
        }

        localStorage.removeItem(LAST_VERIFICATION_KEY);
        if (pendingVerificationEmail) {
          clearPendingVerification();
        } else {
          reset({ email: payload.email, password: '' });
        }

        const params = new URLSearchParams(searchParams);
        params.set('verified', 'true');
        params.set('email', payload.email);
        params.delete('pendingEmail');
        navigate(`/login?${params.toString()}`, { replace: true });
      } catch {
        // Ignore malformed payloads
      }
    };

    processVerificationSignal(localStorage.getItem(LAST_VERIFICATION_KEY));

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LAST_VERIFICATION_KEY && event.newValue) {
        processVerificationSignal(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [clearPendingVerification, navigate, pendingVerificationEmail, reset, searchParams]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const result = await login(data.email, data.password);
    if (!result.success && result.pendingVerification) {
      setPendingVerificationEmail(result.pendingVerification.email);
    }
    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    if (!pendingVerificationEmail) return;
    const response = await authService.resendVerification(pendingVerificationEmail);
    if (!response.success) {
      throw new Error(response.error || 'Failed to resend verification email.');
    }
  };

  if (pendingVerificationEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <VerificationEmailCard
          email={pendingVerificationEmail}
          backLabel="Back to login"
          onBack={clearPendingVerification}
          onResend={handleResendVerification}
          autoResend
          watchVerification
          onVerified={(verifiedEmail) => {
            if (verifiedEmail) {
              reset({ email: verifiedEmail, password: '' });
            }
            clearPendingVerification();
            const params = new URLSearchParams(searchParams);
            params.set('verified', 'true');
            if (verifiedEmail) {
              params.set('email', verifiedEmail);
            } else {
              params.delete('email');
            }
            params.delete('pendingEmail');
            navigate(`/login?${params.toString()}`, { replace: true });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
          {verificationSuccess && (
            <Alert className="mt-4 bg-emerald-50 border-emerald-200 text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <AlertTitle>Company verified</AlertTitle>
              <AlertDescription>
                {verificationEmail
                  ? `Great! You can now sign in as ${verificationEmail}.`
                  : 'Great! You can now sign in with your company credentials.'}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground space-y-2">
            <div>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register your company
              </Link>
            </div>
            <div>
              Employee?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Request access
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}



