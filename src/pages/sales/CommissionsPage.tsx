import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { getSalesAgentStats } from "@/lib/salesAgentStorage";

export default function CommissionsPage() {
  const stats = getSalesAgentStats();

  return (
    <DashboardPageLayout
      title="Commission Management"
      subtitle="Track and manage sales commissions"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold mt-2">
                  ${(stats.totalRevenue * 0.1 / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-2">
                  ${(stats.totalRevenue * 0.05 / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid This Month</p>
                <p className="text-2xl font-bold mt-2">
                  ${(stats.totalRevenue * 0.03 / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Commission Details</h3>
          <p className="text-muted-foreground">Commission tracking and management interface coming soon.</p>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
