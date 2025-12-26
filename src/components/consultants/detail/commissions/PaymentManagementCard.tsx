import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentProcessingDialog } from "./PaymentProcessingDialog";
import { PaymentScheduleDialog } from "./PaymentScheduleDialog";
import { DollarSign, Calendar, Clock, CheckCircle2, Settings } from "lucide-react";
import { getConsultantCommissions } from "@/lib/commissionStorage";
import { format } from "date-fns";

interface PaymentManagementCardProps {
  consultantId: string;
}

export function PaymentManagementCard({ consultantId }: PaymentManagementCardProps) {
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const allCommissions = getConsultantCommissions(consultantId);
  const pendingCommissions = allCommissions.filter(
    (c) => c.status === "pending" || c.status === "approved"
  );
  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);

  const recentPayments = allCommissions
    .filter((c) => c.status === "paid" && c.paymentDate)
    .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
    .slice(0, 3);

  // Mock payment schedule data
  const nextPaymentDate = new Date();
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 15);
  const nextPaymentAmount = 8700;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pending Payments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Pending Payments</h4>
              <Badge variant="secondary">{pendingCommissions.length}</Badge>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Pending</span>
                <span className="text-2xl font-bold">
                  ${totalPending.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingCommissions.length} commission{pendingCommissions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Payment Schedule
              </h4>
              <Button variant="ghost" size="sm" onClick={() => setScheduleDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Next Payment</span>
                <Badge variant="outline" className="bg-background">
                  {format(nextPaymentDate, "MMM d, yyyy")}
                </Badge>
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                ${nextPaymentAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Payment Method</h4>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Bank Transfer</span>
                <Badge variant="outline" className="text-xs">Default</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>Account: **** **** 1234</p>
                <p>Routing: 021000021</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={() => setProcessDialogOpen(true)} className="flex-1">
              <DollarSign className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>

          {/* Recent Payments */}
          {recentPayments.length > 0 && (
            <div className="pt-4 border-t space-y-3">
              <h4 className="text-sm font-semibold">Recent Payments</h4>
              <div className="space-y-2">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <div>
                        <p className="font-medium">
                          {payment.paymentDate && format(new Date(payment.paymentDate), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.paymentReference || "No reference"}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      ${payment.commissionAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View All Payments
              </Button>
            </div>
          )}

          {/* Payment Stats */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Paid (YTD)</div>
                <div className="text-lg font-bold">
                  $
                  {allCommissions
                    .filter((c) => c.status === "paid")
                    .reduce((sum, c) => sum + c.commissionAmount, 0)
                    .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                <div className="text-lg font-bold">94%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentProcessingDialog
        open={processDialogOpen}
        onOpenChange={setProcessDialogOpen}
        consultantId={consultantId}
        pendingCommissions={pendingCommissions}
        onSuccess={() => {
          setProcessDialogOpen(false);
          window.location.reload();
        }}
      />

      <PaymentScheduleDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        consultantId={consultantId}
        onSuccess={() => {
          setScheduleDialogOpen(false);
        }}
      />
    </>
  );
}
