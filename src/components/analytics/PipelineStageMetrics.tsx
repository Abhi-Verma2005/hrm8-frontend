import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PipelineStageMetrics as StageMetrics } from "@/lib/analyticsService";

interface PipelineStageMetricsProps {
  data: StageMetrics[];
}

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff'];

export function PipelineStageMetrics({ data }: PipelineStageMetricsProps) {
  const chartData = data.map(item => ({
    name: item.stage,
    value: item.count,
    percentage: item.percentage,
    avgTime: item.averageTimeInStage,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Stage Distribution</CardTitle>
        <CardDescription>Current candidate distribution across stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  labelLine={false}
                  label={false}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium mb-1">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value} candidates ({data.percentage}%)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Avg. time: {data.avgTime} days
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-3">
            {data.map((stage, index) => (
              <div key={stage.stage} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium text-sm">{stage.stage}</p>
                    <p className="text-xs text-muted-foreground">
                      {stage.averageTimeInStage} days avg.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{stage.count}</p>
                  <p className="text-xs text-muted-foreground">{stage.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
