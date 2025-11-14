import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SourceEffectivenessMetrics } from '@/lib/analytics/recruitmentMetrics';
import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SourceEffectivenessChartProps {
  data: SourceEffectivenessMetrics[];
}

export function SourceEffectivenessChart({ data }: SourceEffectivenessChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Source Effectiveness
        </CardTitle>
        <CardDescription>
          Compare quality and conversion rates across different candidate sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-3))" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-sm mb-2">{data.source}</p>
                      <div className="space-y-1 text-xs">
                        <p className="text-muted-foreground">
                          Applications: <span className="font-semibold text-foreground">{data.totalApplications}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Hired: <span className="font-semibold text-foreground">{data.hiredCount}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Conversion: <span className="font-semibold text-foreground">{data.conversionRate}%</span>
                        </p>
                        <p className="text-muted-foreground">
                          Quality Score: <span className="font-semibold text-foreground">{data.qualityScore}/100</span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="totalApplications" 
              fill="hsl(var(--primary))" 
              name="Total Applications"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              yAxisId="left"
              dataKey="hiredCount" 
              fill="hsl(var(--chart-2))" 
              name="Hired"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              yAxisId="right"
              dataKey="qualityScore" 
              fill="hsl(var(--chart-3))" 
              name="Quality Score"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Detailed metrics table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Source</th>
                <th className="text-right p-3 font-medium">Applications</th>
                <th className="text-right p-3 font-medium">Hired</th>
                <th className="text-right p-3 font-medium">Conv. Rate</th>
                <th className="text-right p-3 font-medium">Avg. TTH</th>
                <th className="text-right p-3 font-medium">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item) => (
                <tr key={item.source} className="hover:bg-accent/50">
                  <td className="p-3 font-medium capitalize">
                    {item.source.replace('_', ' ')}
                  </td>
                  <td className="text-right p-3">{item.totalApplications}</td>
                  <td className="text-right p-3 font-medium text-primary">{item.hiredCount}</td>
                  <td className="text-right p-3">
                    <span className={`font-medium ${
                      item.conversionRate >= 20 ? 'text-green-600' : 
                      item.conversionRate >= 10 ? 'text-blue-600' : 
                      'text-muted-foreground'
                    }`}>
                      {item.conversionRate}%
                    </span>
                  </td>
                  <td className="text-right p-3 text-muted-foreground">
                    {item.averageTimeToHire} days
                  </td>
                  <td className="text-right p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={item.qualityScore} className="w-16 h-2" />
                      <span className="text-xs font-medium w-8">{item.qualityScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top source highlights */}
        <div className="grid grid-cols-3 gap-4">
          {data.slice(0, 3).map((source, index) => (
            <div key={source.source} className="border rounded-lg p-4">
              <Badge variant={index === 0 ? 'default' : 'secondary'} className="mb-2">
                {index === 0 ? '🏆 Best' : `#${index + 1}`}
              </Badge>
              <p className="font-medium capitalize">{source.source.replace('_', ' ')}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {source.conversionRate}% conversion
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
