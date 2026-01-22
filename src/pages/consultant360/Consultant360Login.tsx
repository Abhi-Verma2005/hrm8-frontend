/**
 * Consultant 360 Login Page
 * Login page for Consultant 360 users with unified access
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase, Target, Wallet } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Consultant360Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated, isLoading: authLoading } = useConsultantAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Redirect if already authenticated
    if (!authLoading && isAuthenticated) {
        navigate('/consultant360/dashboard', { replace: true });
        return null;
    }

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        await login(data.email, data.password);
        setIsLoading(false);
    };

    return (
        <AuthLayout>
            <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="space-y-3 pb-6">
                    <div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Consultant 360</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Sign in to access your unified dashboard
                        </CardDescription>
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
                                placeholder="consultant@hrm8.com"
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
                    {/* Feature highlights */}
                    <div className="w-full grid grid-cols-3 gap-3 text-center">
                        <div className="flex flex-col items-center gap-1 p-3 bg-blue-50 rounded-lg">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                            <span className="text-xs text-blue-700 font-medium">Job Placement</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 bg-green-50 rounded-lg">
                            <Target className="h-5 w-5 text-green-600" />
                            <span className="text-xs text-green-700 font-medium">Lead Sales</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 bg-amber-50 rounded-lg">
                            <Wallet className="h-5 w-5 text-amber-600" />
                            <span className="text-xs text-amber-700 font-medium">Unified Earnings</span>
                        </div>
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                        <p>Consultant 360 Access Only</p>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
