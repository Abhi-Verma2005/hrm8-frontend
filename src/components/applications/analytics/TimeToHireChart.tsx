import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TimeToHireMetrics } from '@/lib/applications/analyticsService';

interface TimeToHireChartProps {
  data: TimeToHireMetrics;
}

export function TimeToHireChart({ data }: TimeToHireChartProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Time to Hire Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="averageDays" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Avg Days to Hire"
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Average Time to Hire by Final Stage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.byStage}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="stage" className="text-xs" angle={-45} textAnchor="end" height={100} />
            <YAxis className="text-xs" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="averageDays" fill="hsl(var(--chart-1))" name="Avg Days" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
