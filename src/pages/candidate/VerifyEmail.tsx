
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { candidateAuthService } from '@/lib/candidateAuthService';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

export default function CandidateVerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { refreshCandidate } = useCandidateAuth();

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your email address...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. Token is missing.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await candidateAuthService.verifyEmail(token);

                if (response.success) {
                    setStatus('success');
                    setMessage(response.data?.message || 'Email verified successfully!');
                    // Refresh auth context to update user state if the session cookie was set
                    await refreshCandidate();
                } else {
                    setStatus('error');
                    setMessage(response.error || 'Verification failed. The link may have expired or is invalid.');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(error?.message || 'An error occurred during verification.');
            }
        };

        verifyEmail();
    }, [token, refreshCandidate]);

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
                <CardHeader className="space-y-3 pb-6 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Email Verification</CardTitle>
                    <CardDescription className="text-base mt-2">
                        {status === 'verifying' && 'Please wait while we verify your email...'}
                        {status === 'success' && 'Your email has been verified successfully!'}
                        {status === 'error' && 'There was a problem verifying your email.'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center justify-center p-6 space-y-6">
                    {status === 'verifying' && (
                        <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    )}

                    {status === 'success' && (
                        <>
                            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
                                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
                            </div>
                            <p className="text-center text-muted-foreground">{message}</p>
                            <Button
                                onClick={() => navigate('/candidate/dashboard')}
                                className="w-full h-11 text-base mt-4"
                            >
                                Go to Dashboard
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
                                <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
                            </div>
                            <p className="text-center text-muted-foreground">{message}</p>
                            <div className="flex flex-col w-full gap-3 mt-4">
                                <Button
                                    onClick={() => navigate('/candidate/login')}
                                    variant="outline"
                                    className="w-full h-11 text-base"
                                >
                                    Back to Login
                                </Button>
                                <Button
                                    onClick={() => navigate('/candidate/register')}
                                    variant="ghost"
                                    className="w-full"
                                >
                                    Create new account
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
