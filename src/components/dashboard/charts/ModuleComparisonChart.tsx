import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ComparativeMetrics } from '@/lib/comparative/businessComparison';

interface ModuleComparisonChartProps {
  data: ComparativeMetrics;
  title?: string;
  description?: string;
}

export function ModuleComparisonChart({ 
  data, 
  title = "Module Performance Comparison", 
  description 
}: ModuleComparisonChartProps) {
  const chartData = [
    {
      metric: 'Total Revenue',
      Assessments: data.assessments.revenue.totalRevenue,
      'Background Checks': data.backgroundChecks.revenue.totalRevenue,
    },
    {
      metric: 'Net Profit',
      Assessments: data.assessments.profitability.netProfit,
      'Background Checks': data.backgroundChecks.profitability.netProfit,
    },
    {
      metric: 'Total Volume',
      Assessments: data.assessments.usage.totalVolume,
      'Background Checks': data.backgroundChecks.usage.totalVolume,
    },
    {
      metric: 'Revenue per Client',
      Assessments: data.assessments.revenue.revenuePerClient,
      'Background Checks': data.backgroundChecks.revenue.revenuePerClient,
    },
  ];

  return (
    <Card className="transition-[background,border-color,box-shadow,color] duration-500">
      <CardHeader>
        <CardTitle className="transition-colors duration-500">{title}</CardTitle>
        {description && <CardDescription className="transition-colors duration-500">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="metric" 
              className="text-xs"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis className="text-xs" />
            <Tooltip 
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar dataKey="Assessments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Background Checks" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500">
            <p className="text-sm text-muted-foreground">Combined Revenue</p>
            <p className="text-2xl font-bold text-primary">
              ${data.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500">
            <p className="text-sm text-muted-foreground">Combined Profit</p>
            <p className="text-2xl font-bold text-success">
              ${data.totalProfit.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500">
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <p className="text-2xl font-bold">
              {data.totalVolume.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500">
            <p className="text-sm text-muted-foreground">Overall Margin</p>
            <p className="text-2xl font-bold text-warning">
              {data.overallMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
