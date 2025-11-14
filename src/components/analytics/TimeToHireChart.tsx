import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TimeToHireMetrics } from '@/lib/analytics/recruitmentMetrics';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TimeToHireChartProps {
  data: TimeToHireMetrics;
}

export function TimeToHireChart({ data }: TimeToHireChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Time to Hire Analysis
        </CardTitle>
        <CardDescription>
          Track how long it takes to hire candidates across stages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Average Time to Hire</p>
            <p className="text-3xl font-bold">{data.averageDays}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Median Time to Hire</p>
            <p className="text-3xl font-bold">{data.medianDays}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </div>
        </div>

        {/* Trend over time */}
        <div>
          <h4 className="font-medium mb-4">6-Month Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-sm">{payload[0].payload.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Average: <span className="font-semibold text-foreground">{payload[0].value} days</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="averageDays" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Time by stage */}
        <div>
          <h4 className="font-medium mb-4">Average Time by Stage</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byStage} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-sm">{payload[0].payload.stage}</p>
                        <p className="text-sm text-muted-foreground">
                          Average: <span className="font-semibold text-foreground">{payload[0].value} days</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="averageDays" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium mb-2">Insights</h4>
          <div className="space-y-2">
            {data.averageDays < 30 && (
              <Badge variant="default">Excellent: Faster than industry average (30 days)</Badge>
            )}
            {data.averageDays >= 30 && data.averageDays < 45 && (
              <Badge variant="secondary">Good: Within industry average range</Badge>
            )}
            {data.averageDays >= 45 && (
              <Badge variant="destructive">Needs Improvement: Slower than industry average</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
