import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, UserPlus, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface AccountTeamMember {
    id: string;
    consultantId?: string;
    consultantName?: string;
    role: "SALES_OWNER" | "RECRUITER_OWNER" | "REGION_OWNER";
    assignedAt: Date;
    assignedBy: string;
}

interface CompanyAccountTeamTabProps {
    companyId: string;
}

const roleColors: Record<string, string> = {
    SALES_OWNER: "bg-blue-100 text-blue-800",
    RECRUITER_OWNER: "bg-green-100 text-green-800",
    REGION_OWNER: "bg-purple-100 text-purple-800",
};

const roleDescriptions: Record<string, string> = {
    SALES_OWNER: "Responsible for sales and commission tracking",
    RECRUITER_OWNER: "Handles recruitment and service delivery",
    REGION_OWNER: "Regional oversight and management",
};

export function CompanyAccountTeamTab({ companyId }: CompanyAccountTeamTabProps) {
    const [teamMembers] = useState<AccountTeamMember[]>([
        {
            id: "1",
            consultantId: "sa-1",
            consultantName: "John Sales",
            role: "SALES_OWNER",
            assignedAt: new Date("2024-12-01"),
            assignedBy: "Admin User",
        },
        {
            id: "2",
            consultantId: "rec-1",
            consultantName: "Jane Recruiter",
            role: "RECRUITER_OWNER",
            assignedAt: new Date("2024-12-01"),
            assignedBy: "Admin User",
        },
        {
            id: "3",
            role: "REGION_OWNER",
            consultantName: "HRM8 North America",
            assignedAt: new Date("2024-11-15"),
            assignedBy: "System",
        },
    ]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Account Team</CardTitle>
                            <CardDescription>
                                Manage team members responsible for this account
                            </CardDescription>
                        </div>
                        <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign Team Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {teamMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No team members assigned</h3>
                            <p className="text-muted-foreground mb-4">
                                Assign team members to manage this account
                            </p>
                            <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assign Team Member
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Team Members Table */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Assigned Date</TableHead>
                                        <TableHead>Assigned By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">
                                                {member.consultantName || "Unassigned"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <Badge variant="outline" className={roleColors[member.role]}>
                                                        {member.role.replace(/_/g, " ")}
                                                    </Badge>
                                                    <p className="text-xs text-muted-foreground">
                                                        {roleDescriptions[member.role]}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {member.assignedAt.toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{member.assignedBy}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Role Explanations */}
                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-sm mb-3">Role Definitions</h4>
                                <div className="grid gap-3">
                                    <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="p-2 bg-blue-100 rounded">
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Sales Owner</p>
                                            <p className="text-xs text-muted-foreground">
                                                Primary sales contact, commission basis, manages opportunities and subscriptions
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="p-2 bg-green-100 rounded">
                                            <Users className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Recruiter Owner</p>
                                            <p className="text-xs text-muted-foreground">
                                                Service delivery contact, manages jobs and recruitment activities
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="p-2 bg-purple-100 rounded">
                                            <Building2 className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Region Owner</p>
                                            <p className="text-xs text-muted-foreground">
                                                HRM8 or Regional Licensee admin with oversight responsibilities
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
