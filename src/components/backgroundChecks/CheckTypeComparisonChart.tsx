import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CheckTypeMetrics } from '@/lib/backgroundChecks/analyticsService';

interface CheckTypeComparisonChartProps {
  data: CheckTypeMetrics[];
}

export function CheckTypeComparisonChart({ data }: CheckTypeComparisonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Type Comparison</CardTitle>
        <CardDescription>Volume, completion time, and success rate by check type</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="type" className="text-xs" angle={-45} textAnchor="end" height={100} />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            />
            <Legend />
            <Bar dataKey="total" fill="hsl(var(--primary))" name="Total Checks" />
            <Bar dataKey="completed" fill="hsl(var(--success))" name="Completed" />
            <Bar dataKey="avgTime" fill="hsl(var(--warning))" name="Avg. Days" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
