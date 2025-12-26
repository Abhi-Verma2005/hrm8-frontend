/**
 * Override Attribution Modal
 * Modal for HRM8 Admin to override lead attribution with reason
 */

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { Lead, leadService } from '@/lib/hrm8/leadService';
import { toast } from 'sonner';

interface OverrideAttributionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead;
    onSuccess: () => void;
}

export function OverrideAttributionModal({
    open,
    onOpenChange,
    lead,
    onSuccess,
}: OverrideAttributionModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        newCreatedBy: lead.createdBy || '',
        newReferredBy: lead.referredBy || '',
        reason: '',
    });

    useEffect(() => {
        if (open) {
            setFormData({
                newCreatedBy: lead.createdBy || '',
                newReferredBy: lead.referredBy || '',
                reason: '',
            });
        }
    }, [open, lead]);

    const handleOverride = async () => {
        if (!formData.reason.trim()) {
            toast.error('Please provide a reason for this override');
            return;
        }

        try {
            setLoading(true);
            const response = await leadService.overrideAttribution(lead.id, {
                newCreatedBy: formData.newCreatedBy || null,
                newReferredBy: formData.newReferredBy || null,
                reason: formData.reason,
            });

            if (response.success) {
                toast.success('Attribution overridden successfully. Requires re-validation.');
                onSuccess();
            } else {
                toast.error(response.error || 'Failed to override attribution');
            }
        } catch (error) {
            toast.error('Failed to override attribution');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-orange-600" />
                        Override Attribution
                    </DialogTitle>
                    <DialogDescription>
                        HRM8 Admin override - This action will reset validation status
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Warning Alert */}
                    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-sm text-orange-800 dark:text-orange-200">
                            <strong>Warning:</strong> Overriding attribution will reset the validation status.
                            The attribution must be re-validated before commission can be credited.
                        </AlertDescription>
                    </Alert>

                    {/* Current Attribution */}
                    <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
                        <div className="font-medium text-sm">Current Attribution</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Created By:</span>{' '}
                                <span className="font-medium">
                                    {lead.createdBy || 'None'}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Referred By:</span>{' '}
                                <span className="font-medium">
                                    {lead.referredBy || 'None'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* New Attribution Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newCreatedBy">New Created By (Sales Agent ID)</Label>
                            <Input
                                id="newCreatedBy"
                                placeholder="Enter sales agent ID or leave empty for none"
                                value={formData.newCreatedBy}
                                onChange={(e) => setFormData({ ...formData, newCreatedBy: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newReferredBy">New Referred By (Sales Agent ID)</Label>
                            <Input
                                id="newReferredBy"
                                placeholder="Enter sales agent ID or leave empty for none"
                                value={formData.newReferredBy}
                                onChange={(e) => setFormData({ ...formData, newReferredBy: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                Reason for Override <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="Explain why attribution is being overridden..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                This reason will be logged in the audit trail
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleOverride}
                        disabled={loading || !formData.reason.trim()}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Shield className="mr-2 h-4 w-4" />
                                Save Override
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
