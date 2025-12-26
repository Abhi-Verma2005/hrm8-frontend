import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommissionTrendsChart } from "./CommissionTrendsChart";
import { TopEarnersCard } from "./TopEarnersCard";
import { PipelineValueForecast } from "./PipelineValueForecast";
import { PaymentHistoryExport } from "./PaymentHistoryExport";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";
import { getConsultantCommissions, getAllCommissions, getConsultantPayments } from "@/lib/commissionStorage";
import type { Commission } from "@/types/commission";

interface CommissionAnalyticsTabProps {
  consultantId?: string;
  consultantName?: string;
}

export function CommissionAnalyticsTab({ consultantId, consultantName }: CommissionAnalyticsTabProps) {
  // Get commissions data
  const consultantCommissions = useMemo(() => {
    if (consultantId) {
      return getConsultantCommissions(consultantId);
    }
    return [];
  }, [consultantId]);

  const allCommissions = useMemo(() => getAllCommissions(), []);
  
  const payments = useMemo(() => {
    if (consultantId) {
      return getConsultantPayments(consultantId);
    }
    return [];
  }, [consultantId]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const commissions = consultantId ? consultantCommissions : allCommissions;
    
    const totalEarned = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalPaid = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalPending = commissions
      .filter(c => c.status === 'pending' || c.status === 'approved')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    
    const avgCommission = commissions.length > 0 ? totalEarned / commissions.length : 0;
    const paymentRate = totalEarned > 0 ? (totalPaid / totalEarned) * 100 : 0;

    return {
      totalEarned,
      totalPaid,
      totalPending,
      avgCommission,
      paymentRate,
      commissionCount: commissions.length,
    };
  }, [consultantId, consultantCommissions, allCommissions]);

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Commission Analytics</h3>
          <p className="text-muted-foreground">
            {consultantId 
              ? `Detailed analytics for ${consultantName || 'consultant'}`
              : 'Overview of all commission data'}
          </p>
        </div>
        <PaymentHistoryExport 
          commissions={consultantId ? consultantCommissions : allCommissions}
          payments={payments}
          consultantName={consultantName}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.commissionCount} commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.paymentRate.toFixed(0)}% payment rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalPending.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Commission</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.avgCommission.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">
              Per commission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <Target className="h-4 w-4 mr-2" />
            Forecast
          </TabsTrigger>
          {!consultantId && (
            <TabsTrigger value="top-earners">
              <Users className="h-4 w-4 mr-2" />
              Top Earners
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <CommissionTrendsChart 
            commissions={consultantId ? consultantCommissions : allCommissions}
            months={12}
          />
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <PipelineValueForecast 
            commissions={consultantId ? consultantCommissions : allCommissions}
            forecastMonths={3}
          />
        </TabsContent>

        {!consultantId && (
          <TabsContent value="top-earners" className="space-y-4">
            <TopEarnersCard 
              allCommissions={allCommissions}
              limit={10}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
