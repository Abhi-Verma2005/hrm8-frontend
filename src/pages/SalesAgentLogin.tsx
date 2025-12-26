/**
 * Sales Agent Login Page
 * Dedicated login portal for Sales Agents
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
import { Loader2, Target } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SalesAgentLogin() {
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
        navigate('/sales/dashboard', { replace: true });
        return null;
    }

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        const result = await login(data.email, data.password);

        if (result.success) {
            // Force redirect to Sales Dashboard for this portal
            navigate('/sales/dashboard');
        }

        setIsLoading(false);
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <AuthLayout>
            <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Sales Agent Portal</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Sign in to manage your leads, pipeline, and commissions
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
                                placeholder="agent@hrm8.com"
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
                    <div className="text-sm text-center text-muted-foreground">
                        <p>Access authorized for Regional Sales Agents only</p>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
