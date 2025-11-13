import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import type { SourceEffectiveness } from '@/lib/applications/analyticsService';

interface SourceEffectivenessChartProps {
  data: SourceEffectiveness;
}

export function SourceEffectivenessChart({ data }: SourceEffectivenessChartProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Applications by Source</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.sources}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="source" className="text-xs" />
            <YAxis className="text-xs" label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Applications" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Source Performance Matrix</h3>
        <div className="mb-4 text-sm text-muted-foreground">
          Comparing conversion rate vs. time to hire (bubble size = application volume)
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="conversionRate" 
              name="Conversion Rate" 
              unit="%" 
              className="text-xs"
              label={{ value: 'Conversion Rate (%)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              dataKey="avgTimeToHire" 
              name="Avg Time to Hire" 
              unit=" days" 
              className="text-xs"
              label={{ value: 'Avg Time to Hire (days)', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis dataKey="count" range={[50, 400]} name="Applications" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: string) => {
                if (name === 'Conversion Rate') return [value + '%', name];
                if (name === 'Avg Time to Hire') return [value + ' days', name];
                return [value, name];
              }}
            />
            <Legend />
            <Scatter 
              data={data.sources} 
              fill="hsl(var(--chart-3))" 
              name="Source"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
