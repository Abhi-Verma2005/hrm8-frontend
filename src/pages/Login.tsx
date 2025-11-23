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
import { Loader2, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { VerificationEmailCard } from '@/components/auth/VerificationEmailCard';
import { authService } from '@/lib/authService';
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <div className="w-full max-w-md">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link to="/" className="inline-block mb-12">
              <img 
                src={logoLight} 
                alt="HRM8" 
                className="h-10 dark:hidden" 
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <img 
                src={logoDark} 
                alt="HRM8" 
                className="h-10 hidden dark:block" 
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Welcome back to HRM8</h1>
                <p className="text-lg text-white/90">
                  The complete HR and talent management platform
                </p>
              </div>
              <div className="space-y-4 pt-8">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Enterprise Security</p>
                    <p className="text-sm text-white/80">Bank-level encryption and compliance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">AI-Powered Insights</p>
                    <p className="text-sm text-white/80">Smart recommendations and analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-white/80">
            <p>© {new Date().getFullYear()} HRM8. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/" className="inline-block">
              <img 
                src={logoLight} 
                alt="HRM8" 
                className="h-8 dark:hidden"
                style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(2878%) hue-rotate(224deg) brightness(96%) contrast(95%)' }}
              />
              <img 
                src={logoDark} 
                alt="HRM8" 
                className="h-8 hidden dark:block opacity-100"
                style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(2878%) hue-rotate(224deg) brightness(96%) contrast(95%)' }}
              />
            </Link>
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-3 pb-6">
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription className="text-base mt-2">
                  Enter your credentials to access your account
                </CardDescription>
              </div>
              {verificationSuccess && (
                <Alert className="mt-4 bg-success/10 border-success/20 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle className="text-sm font-semibold">Company verified</AlertTitle>
                  <AlertDescription className="text-sm">
                    {verificationEmail
                      ? `Great! You can now sign in as ${verificationEmail}.`
                      : 'Great! You can now sign in with your company credentials.'}
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="h-11"
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className="text-sm text-center text-muted-foreground space-y-2">
                <div>
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Register your company
                  </Link>
                </div>
                <div>
                  Employee?{' '}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Request access
                  </Link>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}



