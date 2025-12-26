import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Briefcase, TrendingUp, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ConsultantRole = "RECRUITER" | "SALES_AGENT" | "CONSULTANT_360";

interface ChangeRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    consultantId: string;
    consultantName: string;
    currentRole: ConsultantRole;
    currentJobs?: number;
    currentLeads?: number;
    onRoleChanged: () => void;
}

const roleLabels: Record<ConsultantRole, string> = {
    RECRUITER: "Recruiter",
    SALES_AGENT: "Sales Agent",
    CONSULTANT_360: "360 Consultant",
};

const roleColors: Record<ConsultantRole, string> = {
    RECRUITER: "bg-green-100 text-green-800",
    SALES_AGENT: "bg-blue-100 text-blue-800",
    CONSULTANT_360: "bg-purple-100 text-purple-800",
};

const roleDescriptions: Record<ConsultantRole, string> = {
    RECRUITER: "Handles job assignments and recruitment activities",
    SALES_AGENT: "Manages leads, opportunities, and sales activities",
    CONSULTANT_360: "Full-service consultant handling both sales and recruitment",
};

export function ChangeRoleDialog({
    open,
    onOpenChange,
    consultantId,
    consultantName,
    currentRole,
    currentJobs = 0,
    currentLeads = 0,
    onRoleChanged,
}: ChangeRoleDialogProps) {
    const [newRole, setNewRole] = useState<ConsultantRole | "">("");
    const [reason, setReason] = useState("");
    const [understood, setUnderstood] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getImpactPreview = () => {
        if (!newRole || newRole === currentRole) return [];

        const impacts: { type: "warning" | "info" | "success"; message: string }[] = [];

        // Leaving RECRUITER
        if (currentRole === "RECRUITER" && currentJobs > 0) {
            impacts.push({
                type: "warning",
                message: `Will unassign ${currentJobs} current job${currentJobs > 1 ? "s" : ""}`,
            });
        }

        // Leaving SALES_AGENT
        if (currentRole === "SALES_AGENT" && currentLeads > 0) {
            impacts.push({
                type: "warning",
                message: `Will unassign ${currentLeads} current lead${currentLeads > 1 ? "s" : ""}`,
            });
        }

        // Leaving CONSULTANT_360
        if (currentRole === "CONSULTANT_360") {
            if (newRole === "RECRUITER" && currentLeads > 0) {
                impacts.push({
                    type: "warning",
                    message: `Will unassign ${currentLeads} current lead${currentLeads > 1 ? "s" : ""}`,
                });
            }
            if (newRole === "SALES_AGENT" && currentJobs > 0) {
                impacts.push({
                    type: "warning",
                    message: `Will unassign ${currentJobs} current job${currentJobs > 1 ? "s" : ""}`,
                });
            }
        }

        // Becoming SALES_AGENT or 360
        if (newRole === "SALES_AGENT" || newRole === "CONSULTANT_360") {
            impacts.push({
                type: "success",
                message: "Will enable lead assignments",
            });
            impacts.push({
                type: "success",
                message: "Will enable opportunity management",
            });
        }

        // Becoming RECRUITER or 360
        if (newRole === "RECRUITER" || newRole === "CONSULTANT_360") {
            impacts.push({
                type: "success",
                message: "Will enable job assignments",
            });
        }

        // Becoming 360
        if (newRole === "CONSULTANT_360") {
            impacts.push({
                type: "info",
                message: "Will have access to both sales and recruitment features",
            });
        }

        return impacts;
    };

    const handleSubmit = async () => {
        if (!newRole || newRole === currentRole) {
            toast({
                title: "No change",
                description: "Please select a different role",
                variant: "destructive",
            });
            return;
        }

        if (!understood) {
            toast({
                title: "Confirmation required",
                description: "Please confirm you understand the impact",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/hrm8/consultants/${consultantId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: newRole,
                    roleChangeReason: reason || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update consultant role");
            }

            toast({
                title: "Role changed successfully",
                description: `${consultantName} is now a ${roleLabels[newRole]}`,
            });

            onRoleChanged();
            onOpenChange(false);

            // Reset form
            setNewRole("");
            setReason("");
            setUnderstood(false);
        } catch (error) {
            console.error("Error changing role:", error);
            toast({
                title: "Failed to change role",
                description: error instanceof Error ? error.message : "Unknown error",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const impacts = getImpactPreview();
    const hasWarnings = impacts.some((i) => i.type === "warning");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Change Consultant Role</DialogTitle>
                    <DialogDescription>
                        Update the role for {consultantName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Role */}
                    <div>
                        <Label className="text-sm text-muted-foreground">Current Role</Label>
                        <div className="mt-2">
                            <Badge variant="outline" className={roleColors[currentRole]}>
                                {roleLabels[currentRole]}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                                {roleDescriptions[currentRole]}
                            </p>
                        </div>
                    </div>

                    {/* New Role Selector */}
                    <div>
                        <Label htmlFor="newRole">
                            New Role <span className="text-red-500">*</span>
                        </Label>
                        <Select value={newRole} onValueChange={(value) => setNewRole(value as ConsultantRole)}>
                            <SelectTrigger id="newRole" className="mt-2">
                                <SelectValue placeholder="Select new role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RECRUITER">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        Recruiter
                                    </div>
                                </SelectItem>
                                <SelectItem value="SALES_AGENT">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Sales Agent
                                    </div>
                                </SelectItem>
                                <SelectItem value="CONSULTANT_360">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        360 Consultant
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Impact Preview */}
                    {impacts.length > 0 && (
                        <div className="border rounded-lg p-4 bg-muted/50">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                <h4 className="font-semibold">Impact Preview</h4>
                            </div>
                            <ul className="space-y-2">
                                {impacts.map((impact, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <span className="mt-0.5">
                                            {impact.type === "warning" && "⚠️"}
                                            {impact.type === "success" && "✓"}
                                            {impact.type === "info" && "ℹ️"}
                                        </span>
                                        <span
                                            className={
                                                impact.type === "warning"
                                                    ? "text-orange-700"
                                                    : impact.type === "success"
                                                        ? "text-green-700"
                                                        : "text-blue-700"
                                            }
                                        >
                                            {impact.message}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Confirmation Checkbox */}
                    {hasWarnings && (
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="understood"
                                checked={understood}
                                onCheckedChange={(checked) => setUnderstood(checked as boolean)}
                            />
                            <Label
                                htmlFor="understood"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                I understand the impact of this role change
                            </Label>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <Label htmlFor="reason">Reason for Change (Optional)</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this role change is needed..."
                            rows={3}
                            className="mt-2"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!newRole || newRole === currentRole || (hasWarnings && !understood) || isSubmitting}
                    >
                        {isSubmitting ? "Changing Role..." : "Change Role"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
