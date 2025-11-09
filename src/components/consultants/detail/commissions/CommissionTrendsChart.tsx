import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Commission } from "@/types/commission";
import { format, startOfMonth, subMonths, isAfter, isBefore } from "date-fns";

interface CommissionTrendsChartProps {
  commissions: Commission[];
  months?: number;
}

export function CommissionTrendsChart({ commissions, months = 6 }: CommissionTrendsChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const monthsData: Record<string, { earned: number; paid: number; pending: number }> = {};

    // Initialize last N months
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthKey = format(startOfMonth(monthDate), 'yyyy-MM');
      monthsData[monthKey] = { earned: 0, paid: 0, pending: 0 };
    }

    // Aggregate commission data
    commissions.forEach(commission => {
      const earnedDate = new Date(commission.earnedDate);
      const monthKey = format(startOfMonth(earnedDate), 'yyyy-MM');

      if (monthsData[monthKey]) {
        monthsData[monthKey].earned += commission.commissionAmount;
        
        if (commission.status === 'paid') {
          monthsData[monthKey].paid += commission.commissionAmount;
        } else if (commission.status === 'pending' || commission.status === 'approved') {
          monthsData[monthKey].pending += commission.commissionAmount;
        }
      }
    });

    // Convert to array format for recharts
    return Object.entries(monthsData)
      .map(([month, data]) => ({
        month: format(new Date(month), 'MMM'),
        fullMonth: format(new Date(month), 'MMM yyyy'),
        earned: Math.round(data.earned),
        paid: Math.round(data.paid),
        pending: Math.round(data.pending),
      }))
      .sort((a, b) => a.fullMonth.localeCompare(b.fullMonth));
  }, [commissions, months]);

  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.length < 2) return { value: 0, isPositive: true };
    
    const lastMonth = chartData[chartData.length - 1].earned;
    const previousMonth = chartData[chartData.length - 2].earned;
    
    if (previousMonth === 0) return { value: 0, isPositive: true };
    
    const percentChange = ((lastMonth - previousMonth) / previousMonth) * 100;
    return {
      value: Math.abs(percentChange),
      isPositive: percentChange >= 0,
    };
  }, [chartData]);

  const totalEarned = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.earned, 0),
    [chartData]
  );

  const totalPaid = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.paid, 0),
    [chartData]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Commission Trends</CardTitle>
          <div className="flex items-center gap-2">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={trend.isPositive ? "default" : "destructive"}>
              {trend.isPositive ? '+' : '-'}{trend.value.toFixed(1)}%
            </Badge>
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold">${(totalEarned / 1000).toFixed(1)}K</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="text-2xl font-bold">${(totalPaid / 1000).toFixed(1)}K</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="earnedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-background border rounded-lg shadow-lg p-3">
                    <p className="font-medium mb-2">{payload[0].payload.fullMonth}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm text-muted-foreground">Earned:</span>
                        <span className="font-medium">${payload[0].payload.earned.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm text-muted-foreground">Paid:</span>
                        <span className="font-medium">${payload[0].payload.paid.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm text-muted-foreground">Pending:</span>
                        <span className="font-medium">${payload[0].payload.pending.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="earned"
              stroke="hsl(var(--chart-1))"
              fill="url(#earnedGradient)"
              strokeWidth={2}
              name="Earned"
            />
            <Area
              type="monotone"
              dataKey="paid"
              stroke="hsl(var(--chart-2))"
              fill="url(#paidGradient)"
              strokeWidth={2}
              name="Paid"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-1))]" />
            <span className="text-sm text-muted-foreground">Earned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]" />
            <span className="text-sm text-muted-foreground">Paid</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
