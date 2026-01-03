/**
 * Candidate Login Page
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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function CandidateLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useCandidateAuth();
  const {
    isAuthenticated: isRecruiterAuthenticated,
    isLoading: recruiterAuthLoading,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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

  // Don't render login form if authenticated
  if (isAuthenticated || isRecruiterAuthenticated) {
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    await login(data.email, data.password);
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
            <CardTitle className="text-3xl font-bold tracking-tight">Candidate Sign In</CardTitle>
            <CardDescription className="text-base mt-2">Access your profile and apply for jobs</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
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
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
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
              <Link to="/candidate/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
            <div>
              <Link to="/candidate/jobs" className="text-primary hover:underline font-medium">
                Browse jobs without an account
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

