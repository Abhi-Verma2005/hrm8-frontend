import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendDataPoint } from '@/lib/backgroundChecks/analyticsService';

interface TrendsChartProps {
  data: TrendDataPoint[];
}

export function TrendsChart({ data }: TrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trends Over Time</CardTitle>
        <CardDescription>Check volume, completion rates, and average processing time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="totalChecks" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Total Checks"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              name="Completed"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="inProgress" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2}
              name="In Progress"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="avgCompletionTime" 
              stroke="hsl(var(--info))" 
              strokeWidth={2}
              name="Avg. Days to Complete"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
