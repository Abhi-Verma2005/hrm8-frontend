import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import type { GrowthComparison } from '@/lib/comparative/businessComparison';

interface GrowthComparisonChartProps {
  data: GrowthComparison[];
  title?: string;
  description?: string;
}

export function GrowthComparisonChart({ 
  data, 
  title = "Growth Rate Comparison", 
  description 
}: GrowthComparisonChartProps) {
  const chartData = [
    {
      metric: 'Revenue Growth',
      Assessments: data[0].revenueGrowth,
      'Background Checks': data[1].revenueGrowth,
    },
    {
      metric: 'Volume Growth',
      Assessments: data[0].volumeGrowth,
      'Background Checks': data[1].volumeGrowth,
    },
    {
      metric: 'Profit Growth',
      Assessments: data[0].profitGrowth,
      'Background Checks': data[1].profitGrowth,
    },
    {
      metric: 'Client Growth',
      Assessments: data[0].clientGrowth,
      'Background Checks': data[1].clientGrowth,
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
            />
            <YAxis 
              className="text-xs"
              label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(1)}%`}
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

        {/* Growth Metrics Summary */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500">
            <h4 className="font-semibold mb-3 text-primary">Assessments Growth</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">{data[0].revenueGrowth.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-medium">{data[0].volumeGrowth.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit:</span>
                <span className="font-medium">{data[0].profitGrowth.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clients:</span>
                <span className="font-medium">{data[0].clientGrowth.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500">
            <h4 className="font-semibold mb-3 text-success">Background Checks Growth</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">{data[1].revenueGrowth.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-medium">{data[1].volumeGrowth.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit:</span>
                <span className="font-medium">{data[1].profitGrowth.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clients:</span>
                <span className="font-medium">{data[1].clientGrowth.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
