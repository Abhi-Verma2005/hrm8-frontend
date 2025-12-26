/**
 * Lead Attribution Card Component
 * Displays lead attribution details with validation status and admin actions
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { Lead } from '@/lib/hrm8/leadService';
import { ValidateAttributionModal } from './ValidateAttributionModal';
import { OverrideAttributionModal } from './OverrideAttributionModal';
import { useCrmAuth } from '@/hooks/useCrmAuth';

interface LeadAttributionCardProps {
    lead: Lead;
    onUpdate: () => void;
}

export function LeadAttributionCard({ lead, onUpdate }: LeadAttributionCardProps) {
    const { roleContext, isHrm8Admin, canValidateLeads } = useCrmAuth();
    const [validateModalOpen, setValidateModalOpen] = useState(false);
    const [overrideModalOpen, setOverrideModalOpen] = useState(false);

    const isValidated = !!lead.validatedBy && !!lead.validatedAt;
    const canValidate = canValidateLeads() && !isValidated;
    const canOverride = isHrm8Admin();

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Attribution Details
                        </CardTitle>
                        {isValidated ? (
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Validated
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-orange-600">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Pending Validation
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Attribution Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Created By</div>
                            <div className="mt-1">
                                {lead.createdBy ? (
                                    <div className="text-base font-medium">
                                        {/* TODO: Fetch consultant name from createdBy ID */}
                                        Sales Agent #{lead.createdBy.substring(0, 8)}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">Not assigned</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Referred By</div>
                            <div className="mt-1">
                                {lead.referredBy ? (
                                    <div className="text-base font-medium">
                                        {/* TODO: Fetch consultant name from referredBy ID */}
                                        Sales Agent #{lead.referredBy.substring(0, 8)}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">No referral</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Region</div>
                            <div className="mt-1 text-base">
                                {lead.region?.name || 'Not assigned'}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Lead Source</div>
                            <div className="mt-1">
                                <Badge variant="outline">{lead.leadSource}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Validation Details */}
                    {isValidated && (
                        <div className="pt-4 border-t space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Validation Details</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Validated By:</span>{' '}
                                    <span className="font-medium">Admin #{lead.validatedBy?.substring(0, 8)}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Validated At:</span>{' '}
                                    <span className="font-medium">
                                        {lead.validatedAt ? new Date(lead.validatedAt).toLocaleString() : '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                ✓ Attribution is locked. Commission will be credited to the validated sales agent when this lead converts.
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t flex gap-2">
                        {canValidate && (
                            <Button
                                onClick={() => setValidateModalOpen(true)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Validate Attribution
                            </Button>
                        )}

                        {canOverride && (
                            <Button
                                variant="outline"
                                onClick={() => setOverrideModalOpen(true)}
                                className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                            >
                                <Shield className="mr-2 h-4 w-4" />
                                Override Attribution
                            </Button>
                        )}

                        {!canValidate && !canOverride && (
                            <div className="text-sm text-muted-foreground italic">
                                You don't have permission to validate or modify attribution
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modals */}
            <ValidateAttributionModal
                open={validateModalOpen}
                onOpenChange={setValidateModalOpen}
                lead={lead}
                onSuccess={() => {
                    setValidateModalOpen(false);
                    onUpdate();
                }}
            />

            <OverrideAttributionModal
                open={overrideModalOpen}
                onOpenChange={setOverrideModalOpen}
                lead={lead}
                onSuccess={() => {
                    setOverrideModalOpen(false);
                    onUpdate();
                }}
            />
        </>
    );
}
