/**
 * Validate Attribution Modal
 * Confirmation modal for admin to validate lead attribution
 */

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Lead, leadService } from '@/lib/hrm8/leadService';
import { toast } from 'sonner';

interface ValidateAttributionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead;
    onSuccess: () => void;
}

export function ValidateAttributionModal({
    open,
    onOpenChange,
    lead,
    onSuccess,
}: ValidateAttributionModalProps) {
    const [loading, setLoading] = useState(false);

    const handleValidate = async () => {
        try {
            setLoading(true);
            const response = await leadService.validate(lead.id, lead.regionId || '');

            if (response.success) {
                toast.success('Attribution validated successfully');
                onSuccess();
            } else {
                toast.error(response.error || 'Failed to validate attribution');
            }
        } catch (error) {
            toast.error('Failed to validate attribution');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Validate Attribution
                    </DialogTitle>
                    <DialogDescription>
                        Review the attribution details before validating
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Current Attribution Summary */}
                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="font-medium text-sm">Current Attribution</div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div className="text-muted-foreground">Created By</div>
                                <div className="font-medium">
                                    {lead.createdBy ? `Sales Agent #${lead.createdBy.substring(0, 8)}` : 'Not assigned'}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Referred By</div>
                                <div className="font-medium">
                                    {lead.referredBy ? `Sales Agent #${lead.referredBy.substring(0, 8)}` : 'No referral'}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Region</div>
                                <div className="font-medium">{lead.region?.name || 'Not assigned'}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Lead Source</div>
                                <div className="font-medium">{lead.leadSource}</div>
                            </div>
                        </div>
                    </div>

                    {/* Warning Alert */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            <strong>Important:</strong> Validating attribution will lock the referring sales agent for commission purposes.
                            This attribution will be automatically locked when the lead converts to a company.
                        </AlertDescription>
                    </Alert>
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
                        onClick={handleValidate}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Validating...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Confirm Validation
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
