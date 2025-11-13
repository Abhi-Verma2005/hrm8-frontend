import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import type { ConversionRateMetrics } from '@/lib/applications/analyticsService';

interface ConversionRateChartProps {
  data: ConversionRateMetrics;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function ConversionRateChart({ data }: ConversionRateChartProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Conversion Funnel</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.funnel} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis type="category" dataKey="stage" className="text-xs" width={150} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: any, name: string) => {
                if (name === 'count') return [value, 'Candidates'];
                return [value + '%', 'Conversion Rate'];
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Candidates">
              {data.funnel.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Conversion Rate by Stage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.byStage}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="stage" className="text-xs" angle={-45} textAnchor="end" height={100} />
            <YAxis className="text-xs" label={{ value: 'Conversion %', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: any) => [value + '%', 'Conversion Rate']}
            />
            <Bar dataKey="rate" fill="hsl(var(--chart-2))" name="Conversion %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
