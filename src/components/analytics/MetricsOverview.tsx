import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, UserCheck, Clock, Target, Calendar, XCircle } from "lucide-react";
import { RecruitmentMetrics } from "@/lib/analyticsService";

interface MetricsOverviewProps {
  metrics: RecruitmentMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalCandidates}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.monthOverMonthGrowth >= 0 ? (
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{metrics.monthOverMonthGrowth.toFixed(1)}% from last month
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                {metrics.monthOverMonthGrowth.toFixed(1)}% from last month
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeCandidates}</div>
          <p className="text-xs text-muted-foreground">
            Currently in pipeline
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hired This Month</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.hiredCandidates}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.conversionRate.toFixed(1)}% conversion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageTimeToHire}</div>
          <p className="text-xs text-muted-foreground">
            days on average
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
