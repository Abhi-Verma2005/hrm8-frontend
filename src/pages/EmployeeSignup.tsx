/**
 * Employee Signup Page
 * Direct employee signup (creates signup request for admin approval)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/lib/authService';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, Mail, UserCheck, Briefcase, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  businessEmail: z.string().email('Invalid business email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyDomain: z.string().optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms & Conditions and Privacy Policy' }),
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function EmployeeSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/home');
    return null;
  }

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.employeeSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        businessEmail: data.businessEmail,
        password: data.password,
        acceptTerms: data.acceptTerms,
        companyDomain: data.companyDomain?.trim() || undefined,
      });

      if (response.success && response.data) {
        setRequestSubmitted(true);
        setSubmittedEmail(data.businessEmail);
        toast({
          title: 'Signup request submitted!',
          description: response.data.message || 'Your request has been sent to your company admin for approval.',
        });
      } else {
        toast({
          title: 'Signup failed',
          description: response.error || 'Failed to submit signup request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after submission
  if (requestSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-3">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-success/10 p-4 border-2 border-success/20">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center">Request Submitted</CardTitle>
              <CardDescription className="text-center text-base">
                Your signup request has been sent for approval
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                We've sent your signup request to:
              </p>
              <p className="font-medium">{submittedEmail}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">What happens next?</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Your company admin will review your request</li>
                    <li>You'll receive an email when your request is approved or rejected</li>
                    <li>Once approved, you can log in with your credentials</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setRequestSubmitted(false);
                reset();
              }}
            >
              Submit Another Request
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
          </Card>
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
                <h1 className="text-4xl font-bold tracking-tight">Join your team</h1>
                <p className="text-lg text-white/90">
                  Request access to your company's HRM8 workspace
                </p>
              </div>
              <div className="space-y-4 pt-8">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Fast Approval</p>
                    <p className="text-sm text-white/80">Your admin will review your request quickly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Seamless Onboarding</p>
                    <p className="text-sm text-white/80">Get started with your team right away</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Secure Access</p>
                    <p className="text-sm text-white/80">Enterprise-grade security and privacy</p>
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

      {/* Right Side - Signup Form */}
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
                <CardTitle className="text-3xl font-bold tracking-tight">Join Your Company</CardTitle>
                <CardDescription className="text-base mt-2">
                  Request access to your company's HRM8 workspace
                </CardDescription>
              </div>
            </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="h-11"
                  {...register('firstName')}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="h-11"
                  {...register('lastName')}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessEmail" className="text-sm font-medium">Business Email</Label>
              <Input
                id="businessEmail"
                type="email"
                placeholder="john@company.com"
                className="h-11"
                {...register('businessEmail')}
                disabled={isLoading}
              />
              {errors.businessEmail && (
                <p className="text-sm text-destructive">{errors.businessEmail.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Your email domain will be used to find your company
              </p>
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
            <div className="space-y-2">
              <Label htmlFor="companyDomain" className="text-sm font-medium">Company Domain (Optional)</Label>
              <Input
                id="companyDomain"
                placeholder="company.com"
                className="h-11"
                {...register('companyDomain')}
                disabled={isLoading}
              />
              {errors.companyDomain && (
                <p className="text-sm text-destructive">{errors.companyDomain.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                If your company domain is different from your email domain
              </p>
            </div>
            <div className="flex items-start space-x-3 rounded-md border p-4">
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field }) => (
                  <Checkbox
                    id="acceptTerms"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    disabled={isLoading}
                  />
                )}
              />
              <div className="space-y-1 text-sm">
                <Label htmlFor="acceptTerms" className="text-sm font-medium leading-none">
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
            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

