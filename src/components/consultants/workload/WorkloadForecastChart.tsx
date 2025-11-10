import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp, AlertTriangle, Info, Calendar } from 'lucide-react';
import type { MonthlyForecast } from '@/lib/workloadForecastUtils';
import { getCapacityColor } from '@/lib/consultantWorkloadUtils';

interface WorkloadForecastChartProps {
  forecasts: MonthlyForecast[];
}

export function WorkloadForecastChart({ forecasts }: WorkloadForecastChartProps) {
  const chartData = forecasts.map(f => ({
    month: f.monthLabel.split(' ')[0], // Just month name
    utilization: f.teamAverageUtilization,
    overloaded: f.overloadedConsultants,
    atCapacity: f.atCapacityConsultants,
    hoursAssigned: f.teamTotalHoursAssigned,
    hoursAvailable: f.teamTotalHoursAvailable,
  }));

  const getSeverityColor = (utilization: number) => {
    if (utilization > 100) return 'hsl(var(--destructive))';
    if (utilization >= 90) return 'hsl(var(--warning))';
    if (utilization >= 70) return 'hsl(var(--chart-2))';
    return 'hsl(var(--chart-1))';
  };

  // Identify highest risk month
  const highestRiskMonth = forecasts.reduce((max, f) =>
    f.overloadedConsultants > max.overloadedConsultants ? f : max
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Capacity Forecast
            </CardTitle>
            <CardDescription>
              Projected team utilization for the next {forecasts.length} months
            </CardDescription>
          </div>
          {highestRiskMonth.overloadedConsultants > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {highestRiskMonth.overloadedConsultants} at risk in {highestRiskMonth.monthLabel}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Utilization Trend */}
        <div>
          <h4 className="text-sm font-medium mb-4">Team Utilization Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" />
              <YAxis
                label={{ value: 'Utilization %', angle: -90, position: 'insideLeft' }}
                domain={[0, 120]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold mb-2">{data.month}</p>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Utilization:</span>
                            <span
                              className="font-medium"
                              style={{ color: getSeverityColor(data.utilization) }}
                            >
                              {data.utilization}%
                            </span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Hours Assigned:</span>
                            <span className="font-medium">{data.hoursAssigned}h</span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Hours Available:</span>
                            <span className="font-medium">{data.hoursAvailable}h</span>
                          </p>
                          {data.overloaded > 0 && (
                            <p className="flex justify-between gap-4 pt-2 border-t text-destructive">
                              <span>Overloaded:</span>
                              <span className="font-medium">{data.overloaded} consultants</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <defs>
                <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="utilization"
                stroke="hsl(var(--chart-3))"
                fill="url(#utilizationGradient)"
                strokeWidth={2}
              />
              {/* Reference line at 100% */}
              <Line
                type="monotone"
                dataKey={() => 100}
                stroke="hsl(var(--destructive))"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Max Capacity"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Capacity Risks */}
        <div>
          <h4 className="text-sm font-medium mb-4">Capacity Risk by Month</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Consultants', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold mb-2">{data.month}</p>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Overloaded:</span>
                            <span className="font-medium text-destructive">
                              {data.overloaded} consultants
                            </span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-muted-foreground">At Capacity:</span>
                            <span className="font-medium text-warning">
                              {data.atCapacity} consultants
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="overloaded" fill="hsl(var(--destructive))" name="Overloaded" />
              <Bar dataKey="atCapacity" fill="hsl(var(--warning))" name="At Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Forecast includes active services and pipeline opportunities (on-hold status) with 60%
            probability. Scheduled time off is factored into available capacity. Historical
            completion rates are used to estimate service durations.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
