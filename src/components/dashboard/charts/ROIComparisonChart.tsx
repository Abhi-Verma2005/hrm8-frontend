import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { ROIMetrics } from '@/lib/comparative/businessComparison';

interface ROIComparisonChartProps {
  data: ROIMetrics[];
  title?: string;
  description?: string;
}

export function ROIComparisonChart({ 
  data, 
  title = "ROI & Profitability Comparison", 
  description 
}: ROIComparisonChartProps) {
  const barChartData = [
    {
      metric: 'Total Revenue',
      Assessments: data[0].totalRevenue,
      'Background Checks': data[1].totalRevenue,
    },
    {
      metric: 'Total Costs',
      Assessments: data[0].totalCosts,
      'Background Checks': data[1].totalCosts,
    },
    {
      metric: 'Net Profit',
      Assessments: data[0].netProfit,
      'Background Checks': data[1].netProfit,
    },
  ];

  const radarChartData = [
    {
      metric: 'ROI',
      Assessments: Math.min(data[0].roi, 100),
      'Background Checks': Math.min(data[1].roi, 100),
    },
    {
      metric: 'Profit Margin',
      Assessments: data[0].profitMargin,
      'Background Checks': data[1].profitMargin,
    },
    {
      metric: 'Efficiency',
      Assessments: Math.min((data[0].totalRevenue / data[0].totalCosts) * 20, 100),
      'Background Checks': Math.min((data[1].totalRevenue / data[1].totalCosts) * 20, 100),
    },
  ];

  return (
    <Card className="transition-[background,border-color,box-shadow,color] duration-500">
      <CardHeader>
        <CardTitle className="transition-colors duration-500">{title}</CardTitle>
        {description && <CardDescription className="transition-colors duration-500">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart - Financial Metrics */}
          <div>
            <h4 className="text-sm font-medium mb-4">Financial Breakdown</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="metric" 
                  className="text-xs"
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
          </div>

          {/* Radar Chart - Performance Metrics */}
          <div>
            <h4 className="text-sm font-medium mb-4">Performance Metrics</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                <Radar 
                  name="Assessments" 
                  dataKey="Assessments" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.5} 
                />
                <Radar 
                  name="Background Checks" 
                  dataKey="Background Checks" 
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))" 
                  fillOpacity={0.5} 
                />
                <Legend />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROI Metrics Details */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500">
            <h4 className="font-semibold mb-3 text-primary">Assessments ROI</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI:</span>
                <span className="font-medium text-lg">{data[0].roi.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit Margin:</span>
                <span className="font-medium">{data[0].profitMargin.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payback Period:</span>
                <span className="font-medium">{data[0].paybackPeriod.toFixed(1)} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Profit:</span>
                <span className="font-medium text-success">${data[0].netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500">
            <h4 className="font-semibold mb-3 text-success">Background Checks ROI</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI:</span>
                <span className="font-medium text-lg">{data[1].roi.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit Margin:</span>
                <span className="font-medium">{data[1].profitMargin.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payback Period:</span>
                <span className="font-medium">{data[1].paybackPeriod.toFixed(1)} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Profit:</span>
                <span className="font-medium text-success">${data[1].netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
