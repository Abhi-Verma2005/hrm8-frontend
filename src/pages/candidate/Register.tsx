/**
 * Candidate Register Page
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { AuthLayout } from "@/components/auth/AuthLayout";

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function CandidateRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register: registerCandidate, isAuthenticated, isLoading: authLoading } = useCandidateAuth();
  const {
    isAuthenticated: isRecruiterAuthenticated,
    isLoading: recruiterAuthLoading,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/candidate/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!recruiterAuthLoading && isRecruiterAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isRecruiterAuthenticated, recruiterAuthLoading, navigate]);

  // Show loading while checking auth
  if (authLoading || recruiterAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Don't render register form if authenticated
  if (isAuthenticated || isRecruiterAuthenticated) {
    return null;
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    const result = await registerCandidate({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone?.trim() || undefined,
    });
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
    }
  };

  return (
    <AuthLayout>
      {/* Mobile logo */}
      <div className="lg:hidden mb-8 flex justify-center">
        <Link to="/" className="inline-block">
          <img
            src={logoLight}
            alt="HRM8"
            className="h-8 dark:hidden"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(2878%) hue-rotate(224deg) brightness(96%) contrast(95%)',
            }}
          />
          <img
            src={logoDark}
            alt="HRM8"
            className="h-8 hidden dark:block opacity-100"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(2878%) hue-rotate(224deg) brightness(96%) contrast(95%)',
            }}
          />
        </Link>
      </div>

      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="space-y-3 pb-6">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">Create your candidate profile</CardTitle>
            <CardDescription className="text-base mt-2">Apply to jobs and track your applications</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Check your email</h3>
              <p className="text-muted-foreground">
                We've sent a verification link to <strong>{register('email').name ? (document.getElementById('email') as HTMLInputElement)?.value : 'your email'}</strong>.
                <br />
                Please check your inbox and click the link to verify your account.
              </p>
              <div className="pt-4">
                <Button variant="outline" onClick={() => navigate('/candidate/login')}>
                  Return to Login
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    className="h-11"
                    {...register('firstName')}
                    disabled={isLoading}
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    className="h-11"
                    {...register('lastName')}
                    disabled={isLoading}
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="h-11"
                  {...register('phone')}
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
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
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
              </div>

              <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Creating...' : 'Create account'}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/candidate/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

