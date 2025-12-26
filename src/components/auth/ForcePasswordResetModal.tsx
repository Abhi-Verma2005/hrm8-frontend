import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';

const resetSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

interface ForcePasswordResetModalProps {
    open: boolean;
    onSuccess: () => void;
}

export function ForcePasswordResetModal({ open, onSuccess }: ForcePasswordResetModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { refreshHrm8User } = useHrm8Auth(); // To update context after reset

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = async (data: ResetFormData) => {
        try {
            setIsLoading(true);
            await apiClient.post('/api/hrm8/auth/reset-password', {
                newPassword: data.password,
            });

            toast({
                title: 'Password updated',
                description: 'Your password has been changed successfully.',
            });

            try {
                await refreshHrm8User(); // Update context to clear mustChangePassword flag
            } catch (e) {
                console.error("Failed to refresh user context", e);
            }

            onSuccess(); // Close modal / Proceed
            navigate('/hrm8/dashboard'); // Force navigation
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to reset password',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Change Password Required</DialogTitle>
                    <DialogDescription>
                        For security reasons, you must change your temporary password before continuing.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
