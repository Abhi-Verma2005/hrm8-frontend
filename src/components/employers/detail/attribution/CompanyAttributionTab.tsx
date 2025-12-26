import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, User, UserCheck, Building2, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyAttributionTabProps {
    companyId: string;
}

export function CompanyAttributionTab({ companyId }: CompanyAttributionTabProps) {
    // Mock data - replace with actual API call
    const attribution = {
        salesAgent: {
            id: "sa-1",
            name: "John Sales",
            email: "john.sales@hrm8.com",
        },
        referralSource: "Partner Referral - TechCorp",
        createdBy: "John Sales",
        createdAt: new Date("2024-11-15"),
        convertedFrom: {
            leadId: "lead-123",
            leadName: "Acme Corporation",
            convertedAt: new Date("2024-12-01"),
        },
        attributionLocked: true,
        validatedBy: "Admin User",
        validatedAt: new Date("2024-12-01"),
        commissionStatus: "PENDING",
        commissionAmount: 5000,
    };

    return (
        <div className="space-y-6">
            {/* Attribution Status Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                Attribution Details
                                {attribution.attributionLocked && (
                                    <Lock className="h-4 w-4 text-yellow-600" />
                                )}
                            </CardTitle>
                            <CardDescription>
                                Sales attribution and commission tracking
                            </CardDescription>
                        </div>
                        {attribution.attributionLocked && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Lock className="h-3 w-3 mr-1" />
                                Locked
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Sales Agent */}
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">Sales Agent</h4>
                                <Badge variant="default" className="bg-blue-600">Primary Attribution</Badge>
                            </div>
                            <p className="text-sm font-medium">{attribution.salesAgent.name}</p>
                            <p className="text-sm text-muted-foreground">{attribution.salesAgent.email}</p>
                        </div>
                    </div>

                    {/* Referral Source */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">Referral Source</h4>
                            <p className="text-sm">{attribution.referralSource}</p>
                        </div>
                    </div>

                    {/* Lead Conversion */}
                    {attribution.convertedFrom && (
                        <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <UserCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">Converted from Lead</h4>
                                <p className="text-sm font-medium">{attribution.convertedFrom.leadName}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="h-3 w-3" />
                                    Converted on {attribution.convertedFrom.convertedAt.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Validation Status */}
                    {attribution.validatedBy && (
                        <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">Attribution Validated</h4>
                                <p className="text-sm">Validated by {attribution.validatedBy}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="h-3 w-3" />
                                    {attribution.validatedAt.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Commission Status */}
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-3">Commission Status</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Status</p>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                    {attribution.commissionStatus}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                <p className="text-sm font-semibold">
                                    ${attribution.commissionAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="border-t pt-4">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={attribution.attributionLocked}>
                                <Lock className="h-3 w-3 mr-2" />
                                Lock Attribution
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                                Override Attribution
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Admin actions are logged and require authorization
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Attribution History */}
            <Card>
                <CardHeader>
                    <CardTitle>Attribution History</CardTitle>
                    <CardDescription>Audit log of attribution changes</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                            <div className="flex-1">
                                <p className="font-medium">Attribution Locked</p>
                                <p className="text-xs text-muted-foreground">
                                    By Admin User • {attribution.validatedAt.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                            <div className="flex-1">
                                <p className="font-medium">Lead Converted to Company</p>
                                <p className="text-xs text-muted-foreground">
                                    By {attribution.createdBy} • {attribution.convertedFrom.convertedAt.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                            <div className="flex-1">
                                <p className="font-medium">Lead Created</p>
                                <p className="text-xs text-muted-foreground">
                                    By {attribution.createdBy} • {attribution.createdAt.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
