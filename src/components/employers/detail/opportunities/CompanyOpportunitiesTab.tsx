import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface Opportunity {
    id: string;
    name: string;
    type: "SUBSCRIPTION" | "RECRUITMENT_SERVICE" | "CUSTOM";
    stage: "NEW" | "QUALIFICATION" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";
    amount?: number;
    currency: string;
    probability: number;
    expectedCloseDate?: Date;
    salesAgentId?: string;
    salesAgentName?: string;
}

interface CompanyOpportunitiesTabProps {
    companyId: string;
}

const stageColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    QUALIFICATION: "bg-purple-100 text-purple-800",
    PROPOSAL: "bg-yellow-100 text-yellow-800",
    NEGOTIATION: "bg-orange-100 text-orange-800",
    CLOSED_WON: "bg-green-100 text-green-800",
    CLOSED_LOST: "bg-red-100 text-red-800",
};

const typeColors: Record<string, string> = {
    SUBSCRIPTION: "bg-emerald-100 text-emerald-800",
    RECRUITMENT_SERVICE: "bg-blue-100 text-blue-800",
    CUSTOM: "bg-gray-100 text-gray-800",
};

export function CompanyOpportunitiesTab({ companyId }: CompanyOpportunitiesTabProps) {
    const navigate = useNavigate();
    const [opportunities] = useState<Opportunity[]>([
        {
            id: "1",
            name: "Professional Plan Subscription",
            type: "SUBSCRIPTION",
            stage: "PROPOSAL",
            amount: 5000,
            currency: "USD",
            probability: 75,
            expectedCloseDate: new Date("2025-01-15"),
            salesAgentName: "John Sales",
        },
        {
            id: "2",
            name: "Executive Search - CTO",
            type: "RECRUITMENT_SERVICE",
            stage: "NEGOTIATION",
            amount: 25000,
            currency: "USD",
            probability: 60,
            expectedCloseDate: new Date("2025-02-01"),
            salesAgentName: "Jane Agent",
        },
    ]);

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Opportunities</CardTitle>
                            <CardDescription>
                                Track sales opportunities and pipeline progress
                            </CardDescription>
                        </div>
                        <Button onClick={() => navigate(`/sales/opportunities/create?companyId=${companyId}`)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Opportunity
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {opportunities.length === 0 ? (
                        <div className="text-center py-12">
                            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No opportunities yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first opportunity to start tracking sales
                            </p>
                            <Button onClick={() => navigate(`/sales/opportunities/create?companyId=${companyId}`)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Opportunity
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Stage</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Probability</TableHead>
                                    <TableHead>Expected Close</TableHead>
                                    <TableHead>Sales Agent</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {opportunities.map((opp) => (
                                    <TableRow
                                        key={opp.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => navigate(`/sales/opportunities/${opp.id}`)}
                                    >
                                        <TableCell className="font-medium">{opp.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={typeColors[opp.type]}>
                                                {opp.type.replace(/_/g, " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={stageColors[opp.stage]}>
                                                {opp.stage.replace(/_/g, " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {opp.amount ? (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    {formatCurrency(opp.amount, opp.currency)}
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${opp.probability}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-muted-foreground">{opp.probability}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {opp.expectedCloseDate ? (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(opp.expectedCloseDate)}
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell>{opp.salesAgentName || "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
