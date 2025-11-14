import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FunnelMetrics } from '@/lib/analytics/recruitmentMetrics';
import { TrendingDown } from 'lucide-react';

interface RecruitmentFunnelChartProps {
  data: FunnelMetrics[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
];

export function RecruitmentFunnelChart({ data }: RecruitmentFunnelChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary" />
          Recruitment Funnel
        </CardTitle>
        <CardDescription>
          Application flow through recruitment stages with conversion rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Funnel visualization */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={110} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-sm">{data.stage}</p>
                        <p className="text-sm text-muted-foreground">
                          Applications: <span className="font-semibold text-foreground">{data.count}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Percentage: <span className="font-semibold text-foreground">{data.percentage}%</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Conversion: <span className="font-semibold text-foreground">{data.conversionRate}%</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Conversion rates table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Stage</th>
                  <th className="text-right p-3 font-medium">Count</th>
                  <th className="text-right p-3 font-medium">% of Total</th>
                  <th className="text-right p-3 font-medium">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((item, index) => (
                  <tr key={item.stage} className="hover:bg-accent/50">
                    <td className="p-3 flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-sm" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      {item.stage}
                    </td>
                    <td className="text-right p-3 font-medium">{item.count}</td>
                    <td className="text-right p-3 text-muted-foreground">{item.percentage}%</td>
                    <td className="text-right p-3">
                      <span className={`font-medium ${item.conversionRate < 50 ? 'text-destructive' : 'text-primary'}`}>
                        {item.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
