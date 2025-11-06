import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Receipt, DollarSign, Clock, CheckCircle, XCircle, Plus, Download } from "lucide-react";
import { getExpenses, calculateExpenseStats } from "@/lib/expenseStorage";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Expenses() {
  const [refreshKey, setRefreshKey] = useState(0);

  const expenses = useMemo(() => getExpenses(), [refreshKey]);
  const stats = useMemo(() => calculateExpenseStats(), [refreshKey]);

  const myExpenses = expenses.filter(e => e.employeeId === 'current-user');
  const pendingApprovals = expenses.filter(e => e.status === 'submitted');

  return (
    <DashboardPageLayout
      title="Expense Management"
      description="Submit and manage expense claims and reimbursements"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pendingAmount.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.approvedAmount.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reimbursed</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.reimbursedAmount.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.rejectedAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="my-expenses" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="my-expenses">My Expenses</TabsTrigger>
              <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
              <TabsTrigger value="all">All Expenses</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Submit Expense
              </Button>
            </div>
          </div>

          <TabsContent value="my-expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.slice(0, 10).map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{expense.merchant}</p>
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="capitalize">
                          {expense.category}
                        </Badge>
                        <div className="text-right">
                          <p className="font-bold">${expense.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{expense.currency}</p>
                        </div>
                        <Badge
                          variant={
                            expense.status === 'approved' ? 'default' :
                            expense.status === 'rejected' ? 'destructive' :
                            expense.status === 'reimbursed' ? 'secondary' : 'outline'
                          }
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingApprovals.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{expense.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{expense.merchant} - {expense.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="capitalize">
                          {expense.category}
                        </Badge>
                        <div className="text-right">
                          <p className="font-bold">${expense.amount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">Approve</Button>
                          <Button size="sm" variant="destructive">Reject</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Complete expense history and reports</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Expense policies and approval rules</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
