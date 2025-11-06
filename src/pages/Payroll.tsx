import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, Users, Calendar, Download, Plus } from "lucide-react";
import { getPayrollRuns, getPayslips, calculatePayrollStats } from "@/lib/payrollStorage";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PayrollRunDialog } from "@/components/payroll/PayrollRunDialog";

export default function Payroll() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [payrollDialogOpen, setPayrollDialogOpen] = useState(false);

  const payrollRuns = useMemo(() => getPayrollRuns(), [refreshKey]);
  const payslips = useMemo(() => getPayslips(), [refreshKey]);
  const stats = useMemo(() => calculatePayrollStats(), [refreshKey]);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <DashboardPageLayout>
      <div className="space-y-6 p-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">Process payroll, generate payslips, and manage compensation</p>
        </div>
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalPayrollBudget.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
              <Wallet className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyAverage.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.averageSalary.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payroll Runs</CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payrollRuns.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="runs" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
              <TabsTrigger value="payslips">Payslips</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => setPayrollDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Run Payroll
              </Button>
            </div>
          </div>

          <TabsContent value="runs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payrollRuns.map(run => (
                    <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{run.period}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(run.startDate), 'MMM dd')} - {format(new Date(run.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Net Pay</p>
                          <p className="font-bold">${run.totalNetPay.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Employees</p>
                          <p className="font-medium">{run.employeeCount}</p>
                        </div>
                        <Badge
                          variant={
                            run.status === 'paid' ? 'default' :
                            run.status === 'approved' ? 'secondary' :
                            run.status === 'processing' ? 'outline' : 'destructive'
                          }
                        >
                          {run.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payslips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Payslips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payslips.slice(0, 10).map(payslip => (
                    <div key={payslip.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{payslip.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{payslip.period}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Gross</p>
                          <p className="font-medium">${payslip.grossPay.toLocaleString()}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Net</p>
                          <p className="font-bold text-primary">${payslip.netPay.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline">{payslip.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Salary Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Manage allowances and deductions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Payroll analytics and tax reports</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <PayrollRunDialog 
          open={payrollDialogOpen} 
          onOpenChange={setPayrollDialogOpen}
          onSuccess={handleRefresh}
        />
      </div>
    </DashboardPageLayout>
  );
}
