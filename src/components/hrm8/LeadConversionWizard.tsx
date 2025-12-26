/**
 * Lead Conversion Wizard
 * 4-step wizard to convert qualified leads into companies
 * 
 * Flow:
 * 1. Review Lead Details - Confirm lead information
 * 2. Validate Attribution - Admin confirms sales agent attribution
 * 3. Create Company - Set up company and first contact
 * 4. Confirmation - Lock attribution and create initial opportunity
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Lead, leadService } from '@/lib/hrm8/leadService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface LeadConversionWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead;
    onSuccess: () => void;
}

const STEPS = [
    { title: 'Review Lead', description: 'Confirm lead information' },
    { title: 'Validate Attribution', description: 'Confirm sales agent' },
    { title: 'Create Company', description: 'Set up company record' },
    { title: 'Confirmation', description: 'Finalize conversion' },
];

export function LeadConversionWizard({
    open,
    onOpenChange,
    lead,
    onSuccess,
}: LeadConversionWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isConverting, setIsConverting] = useState(false);

    const progress = ((currentStep + 1) / STEPS.length) * 100;
    const isLastStep = currentStep === STEPS.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            handleConvert();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleConvert = async () => {
        try {
            setIsConverting(true);

            // Call backend API to convert lead
            // Call backend API to convert lead
            const result = await leadService.convert(lead.id);



            if (result.success) {
                toast.success('Lead converted successfully!');
                onSuccess();
                onOpenChange(false);
                setCurrentStep(0); // Reset for next time
            } else {
                toast.error(result.error || 'Failed to convert lead');
            }
        } catch (error) {
            console.error('Conversion error:', error);
            toast.error('Failed to convert lead');
        } finally {
            setIsConverting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <Step1ReviewLead lead={lead} />;
            case 1:
                return <Step2ValidateAttribution lead={lead} />;
            case 2:
                return <Step3CreateCompany lead={lead} />;
            case 3:
                return <Step4Confirmation lead={lead} />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Convert Lead to Company</DialogTitle>
                </DialogHeader>

                {/* Progress Header */}
                <Card className="p-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                                {Math.round(progress)}% Complete
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {STEPS[currentStep].description}
                        </p>
                    </div>
                </Card>

                {/* Step Content */}
                <div className="py-4">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={currentStep === 0 ? () => onOpenChange(false) : handleBack}
                        disabled={isConverting}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {currentStep === 0 ? 'Cancel' : 'Back'}
                    </Button>

                    <Button
                        type="button"
                        onClick={handleNext}
                        disabled={isConverting}
                    >
                        {isConverting ? (
                            'Converting...'
                        ) : isLastStep ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Convert Lead
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Step 1: Review Lead Details
function Step1ReviewLead({ lead }: { lead: Lead }) {
    return (
        <div className="space-y-4">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Review the lead information below. This will be used to create the company record.
                </AlertDescription>
            </Alert>

            <Card className="p-4">
                <h4 className="font-semibold mb-3">Lead Information</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                        <div className="font-semibold">{lead.companyName}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Status</div>
                        <Badge>{lead.status}</Badge>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <div>{lead.email}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Phone</div>
                        <div>{lead.phone || '-'}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Website</div>
                        <div>{lead.website || '-'}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Country</div>
                        <div>{lead.country}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">City</div>
                        <div>{lead.city || '-'}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Region</div>
                        <div>{lead.region?.name || '-'}</div>
                    </div>
                </div>
            </Card>

            {lead.notes && (
                <Card className="p-4">
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                </Card>
            )}
        </div>
    );
}

// Step 2: Validate Attribution
function Step2ValidateAttribution({ lead }: { lead: Lead }) {
    return (
        <div className="space-y-4">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Confirm the sales attribution. This determines who receives commission for this customer.
                </AlertDescription>
            </Alert>

            <Card className="p-4">
                <h4 className="font-semibold mb-3">Attribution Details</h4>
                <div className="space-y-4">
                    {lead.assignedConsultant ? (
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                                Assigned Sales Agent
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="font-semibold">
                                    {lead.assignedConsultant.firstName} {lead.assignedConsultant.lastName}
                                </div>
                                <Badge variant="outline">{lead.assignedConsultant.role}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {lead.assignedConsultant.email}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            No sales agent assigned - will default to HRM8
                        </div>
                    )}

                    <Separator />

                    <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                            Lead Source
                        </div>
                        <Badge>{lead.leadSource}</Badge>
                    </div>

                    {lead.referredBy && (
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                                Referred By
                            </div>
                            <div>{lead.referredBy}</div>
                        </div>
                    )}

                    <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                            <strong>Important:</strong> Attribution will be locked after conversion and can only be changed by an admin.
                        </AlertDescription>
                    </Alert>
                </div>
            </Card>
        </div>
    );
}

// Step 3: Create Company
function Step3CreateCompany({ lead }: { lead: Lead }) {
    const derivedDomain = lead.website
        ? new URL(lead.website).hostname.replace('www.', '')
        : lead.email.split('@')[1];

    return (
        <div className="space-y-4">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    The following company record will be created along with the first contact.
                </AlertDescription>
            </Alert>

            <Card className="p-4">
                <h4 className="font-semibold mb-3">Company Record</h4>
                <div className="space-y-3">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                        <div className="font-semibold">{lead.companyName}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Domain</div>
                        <div className="font-mono text-sm">{derivedDomain}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Website</div>
                        <div>{lead.website || `https://${derivedDomain}`}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Location</div>
                        <div>{lead.city ? `${lead.city}, ${lead.country}` : lead.country}</div>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <h4 className="font-semibold mb-3">Primary Contact</h4>
                <div className="space-y-3">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Name</div>
                        <div>{lead.companyName} Contact</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <div>{lead.email}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Phone</div>
                        <div>{lead.phone || '-'}</div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// Step 4: Confirmation
function Step4Confirmation({ lead }: { lead: Lead }) {
    return (
        <div className="space-y-4">
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                    Ready to convert! Click "Convert Lead" to complete the process.
                </AlertDescription>
            </Alert>

            <Card className="p-4">
                <h4 className="font-semibold mb-3">What will happen:</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                            <strong>Company created:</strong> {lead.companyName}
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                            <strong>Primary contact created:</strong> {lead.email}
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                            <strong>Initial opportunity created:</strong> {lead.companyName} - Subscription
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                            <strong>Attribution locked:</strong> Cannot be changed without admin approval
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                            <strong>Lead status updated:</strong> Marked as CONVERTED
                        </div>
                    </div>
                </div>
            </Card>

            {lead.assignedConsultant && (
                <Card className="p-4 bg-purple-50 dark:bg-purple-950 border-purple-200">
                    <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
                        Commission Tracking
                    </h4>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                        {lead.assignedConsultant.firstName} {lead.assignedConsultant.lastName} will be credited for this customer and eligible for commission on subscriptions and services.
                    </p>
                </Card>
            )}
        </div>
    );
}
