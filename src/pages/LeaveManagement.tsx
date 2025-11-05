import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { LeaveBalanceCard } from "@/components/leave/LeaveBalanceCard";
import { LeaveRequestCard } from "@/components/leave/LeaveRequestCard";
import { LeaveRequestDialog } from "@/components/leave/LeaveRequestDialog";
import { getLeaveBalances, getLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from "@/lib/leaveStorage";
import { toast } from "sonner";

export default function LeaveManagement() {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock current user (in real app, this would come from auth context)
  const currentEmployeeId = "1";
  const currentEmployeeName = "Sarah Johnson";

  const balances = useMemo(() => getLeaveBalances(currentEmployeeId, 2025), [currentEmployeeId, refreshKey]);
  const myRequests = useMemo(() => getLeaveRequests({ employeeId: currentEmployeeId }), [currentEmployeeId, refreshKey]);
  const pendingApprovals = useMemo(() => {
    // In real app, filter by requests where current user is the approver
    return getLeaveRequests({ status: 'pending' });
  }, [refreshKey]);

  const handleApprove = (id: string) => {
    approveLeaveRequest(id, currentEmployeeId, "Approved");
    toast.success("Leave request approved");
    setRefreshKey(prev => prev + 1);
  };

  const handleReject = (id: string) => {
    rejectLeaveRequest(id, currentEmployeeId, "Rejected");
    toast.success("Leave request rejected");
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">
              Manage your leave requests and track balances
            </p>
          </div>
          <Button onClick={() => setRequestDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Request Leave
          </Button>
        </div>

        <Tabs defaultValue="my-leave" className="w-full">
          <TabsList>
            <TabsTrigger value="my-leave">My Leave</TabsTrigger>
            <TabsTrigger value="approvals">
              Pending Approvals
              {pendingApprovals.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {pendingApprovals.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Team Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-leave" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Leave Balances</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {balances.map((balance) => (
                  <LeaveBalanceCard key={balance.id} balance={balance} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">My Requests</h3>
              {myRequests.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Leave Requests</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't submitted any leave requests yet
                  </p>
                  <Button onClick={() => setRequestDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Request Leave
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {myRequests.map((request) => (
                    <LeaveRequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Requests Awaiting Your Approval</h3>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
                  <p className="text-sm text-muted-foreground">
                    There are no leave requests waiting for your approval
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {pendingApprovals.map((request) => (
                    <LeaveRequestCard 
                      key={request.id} 
                      request={request}
                      showActions
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="text-center py-12 border border-dashed rounded-lg">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Calendar</h3>
              <p className="text-sm text-muted-foreground">
                Visual calendar view coming soon
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <LeaveRequestDialog
          open={requestDialogOpen}
          onOpenChange={setRequestDialogOpen}
          employeeId={currentEmployeeId}
          employeeName={currentEmployeeName}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </DashboardPageLayout>
  );
}
