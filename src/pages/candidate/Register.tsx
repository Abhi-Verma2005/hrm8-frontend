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
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function CandidateRegister() {
  const [isLoading, setIsLoading] = useState(false);
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
    await registerCandidate({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });
    setIsLoading(false);
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

