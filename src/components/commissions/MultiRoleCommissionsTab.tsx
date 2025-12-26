import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { Consultant } from "@/types/consultant";
import { getTransactionCommissionsByConsultant, getConsultantCommissionStats } from "@/lib/multiRoleCommissionStorage";
import { format } from "date-fns";
import { CommissionStatusBadge } from "../consultants/detail/CommissionStatusBadge";

interface MultiRoleCommissionsTabProps {
  consultantId: string;
  consultant: Consultant;
}

const transactionTypeLabels = {
  'ats-subscription': 'ATS Subscription',
  'hrms-addon': 'HRMS Add-on',
  'recruitment-service': 'Recruitment Service',
  'rpo-service': 'RPO Service',
  'additional-service': 'Additional Service',
};

export function MultiRoleCommissionsTab({ consultantId, consultant }: MultiRoleCommissionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("all");

  const commissions = getTransactionCommissionsByConsultant(consultantId);
  const stats = getConsultantCommissionStats(consultantId);

  // Filter commissions
  const filteredCommissions = commissions.filter((commission) => {
    const matchesSearch = !searchTerm || 
      commission.transactionDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.employerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || commission.status === statusFilter;
    const matchesType = transactionTypeFilter === "all" || commission.transactionType === transactionTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Group commissions by different criteria
  const byRole = stats.byRole;
  const byStatus = stats.byStatus;
  const byTransactionType = stats.byTransactionType;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">{stats.totalTransactions} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Commissions</TabsTrigger>
          <TabsTrigger value="by-role">By Role</TabsTrigger>
          <TabsTrigger value="by-type">By Type</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
              <CardDescription>All transactions with your commission assignments</CardDescription>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(transactionTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCommissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || transactionTypeFilter !== "all" 
                    ? "No commissions match your filters"
                    : "No commission records found"}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCommissions.map((commission) => {
                    // Find consultant's role assignments in this transaction
                    const myAssignments = commission.roleAssignments.filter(ra => ra.consultantId === consultantId);
                    
                    return (
                      <Card key={commission.id} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">{commission.transactionDescription}</CardTitle>
                                <CommissionStatusBadge status={commission.status as any} />
                              </div>
                              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                <span>{format(new Date(commission.transactionDate), "MMM dd, yyyy")}</span>
                                <span>•</span>
                                <Badge variant="outline">{transactionTypeLabels[commission.transactionType]}</Badge>
                                {commission.employerName && (
                                  <>
                                    <span>•</span>
                                    <span>{commission.employerName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Base Amount</div>
                              <div className="text-lg font-semibold">${commission.baseAmount.toLocaleString()}</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium mb-2">Your Commission Roles:</div>
                              <div className="space-y-2">
                                {myAssignments.map((assignment, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <Badge variant="secondary">{assignment.roleName}</Badge>
                                      <span className="text-sm text-muted-foreground">{assignment.percentage}%</span>
                                    </div>
                                    <div className="text-lg font-bold text-primary">
                                      ${assignment.commissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {commission.notes && (
                              <div className="pt-2 border-t">
                                <div className="text-sm text-muted-foreground">{commission.notes}</div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-role" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commissions by Role</CardTitle>
              <CardDescription>Your earnings grouped by commission role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(byRole).map(([roleType, data]) => {
                  const roleData = data as { roleName: string; count: number; total: number };
                  return (
                    <Card key={roleType} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{roleData.roleName}</CardTitle>
                            <CardDescription>{roleData.count} transactions</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              ${roleData.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
                {Object.keys(byRole).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No role data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-type" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commissions by Transaction Type</CardTitle>
              <CardDescription>Your earnings grouped by transaction type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(byTransactionType).map(([transactionType, data]) => {
                  const typeData = data as { count: number; total: number };
                  return (
                    <Card key={transactionType} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {transactionTypeLabels[transactionType as keyof typeof transactionTypeLabels]}
                            </CardTitle>
                            <CardDescription>{typeData.count} transactions</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              ${typeData.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
                {Object.keys(byTransactionType).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No transaction data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
