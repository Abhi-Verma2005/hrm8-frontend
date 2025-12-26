import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, DollarSign, Calendar, AlertTriangle } from "lucide-react";
import type { Commission } from "@/types/commission";
import { addMonths, format, isAfter } from "date-fns";

interface PipelineValueForecastProps {
  commissions: Commission[];
  forecastMonths?: number;
}

export function PipelineValueForecast({ commissions, forecastMonths = 3 }: PipelineValueForecastProps) {
  const forecast = useMemo(() => {
    const now = new Date();
    const forecastEndDate = addMonths(now, forecastMonths);

    // Calculate historical average
    const paidCommissions = commissions.filter(c => c.status === 'paid');
    const monthlyAverage = paidCommissions.length > 0
      ? paidCommissions.reduce((sum, c) => sum + c.commissionAmount, 0) / 6 // Last 6 months average
      : 0;

    // Pending/Approved commissions
    const pendingValue = commissions
      .filter(c => (c.status === 'pending' || c.status === 'approved'))
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    // Commissions due in forecast period
    const dueInPeriod = commissions
      .filter(c => {
        if (!c.dueDate) return false;
        const dueDate = new Date(c.dueDate);
        return isAfter(dueDate, now) && !isAfter(dueDate, forecastEndDate);
      })
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    // Projected based on historical average
    const projectedFromHistory = monthlyAverage * forecastMonths;

    // Total forecast
    const totalForecast = pendingValue + dueInPeriod + projectedFromHistory;

    // Risk assessment
    const pendingPercentage = totalForecast > 0 ? (pendingValue / totalForecast) * 100 : 0;
    const risk = pendingPercentage > 60 ? 'high' : pendingPercentage > 30 ? 'medium' : 'low';

    return {
      totalForecast,
      pendingValue,
      dueInPeriod,
      projectedFromHistory,
      monthlyAverage,
      pendingPercentage,
      risk,
      forecastEndDate,
    };
  }, [commissions, forecastMonths]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getRiskBadgeVariant = (risk: string): "default" | "destructive" | "secondary" => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pipeline Value Forecast
          </CardTitle>
          <Badge variant={getRiskBadgeVariant(forecast.risk)}>
            {forecast.risk.toUpperCase()} RISK
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Forecast */}
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold">
              ${forecast.totalForecast.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-sm text-muted-foreground">
              projected by {format(forecast.forecastEndDate, 'MMM yyyy')}
            </span>
          </div>
          <Progress 
            value={(forecast.pendingValue / forecast.totalForecast) * 100} 
            className="h-2"
          />
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          {/* Pending Value */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="font-medium">Pending Approval</p>
                <p className="text-sm text-muted-foreground">
                  Awaiting approval or payment
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">
                ${forecast.pendingValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground">
                {forecast.pendingPercentage.toFixed(0)}% of forecast
              </p>
            </div>
          </div>

          {/* Due in Period */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Due in Period</p>
                <p className="text-sm text-muted-foreground">
                  Expected commissions with due dates
                </p>
              </div>
            </div>
            <p className="text-xl font-bold">
              ${forecast.dueInPeriod.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          {/* Projected from History */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Historical Projection</p>
                <p className="text-sm text-muted-foreground">
                  Based on average of ${forecast.monthlyAverage.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/month
                </p>
              </div>
            </div>
            <p className="text-xl font-bold">
              ${forecast.projectedFromHistory.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className={`h-4 w-4 ${getRiskColor(forecast.risk)}`} />
              <span className="text-sm font-medium">Forecast Confidence</span>
            </div>
            <span className={`text-sm font-semibold ${getRiskColor(forecast.risk)}`}>
              {forecast.risk === 'high' ? 'Moderate' : forecast.risk === 'medium' ? 'Good' : 'High'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {forecast.risk === 'high' 
              ? 'High dependency on pending approvals. Consider following up.'
              : forecast.risk === 'medium'
              ? 'Balanced mix of pending and projected earnings.'
              : 'Strong pipeline with confirmed earnings.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
