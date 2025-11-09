import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { WorkloadData } from '@/lib/consultantWorkloadUtils';
import { getCapacityColor } from '@/lib/consultantWorkloadUtils';

interface ConsultantWorkloadChartProps {
  data: WorkloadData[];
}

export function ConsultantWorkloadChart({ data }: ConsultantWorkloadChartProps) {
  const chartData = data.map(item => ({
    name: item.consultantName,
    jobs: item.currentJobs,
    employers: item.currentEmployers,
    available: Math.max(0, item.totalCapacity - item.totalAssigned),
    utilizationPercent: item.utilizationPercent,
  }));

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Team Workload Overview</h3>
        <p className="text-sm text-muted-foreground">Current assignments vs. capacity</p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{data.name}</p>
                    <div className="space-y-1 text-sm">
                      <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Jobs:</span>
                        <span className="font-medium">{data.jobs}</span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Employers:</span>
                        <span className="font-medium">{data.employers}</span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium">{data.available}</span>
                      </p>
                      <p className="flex justify-between gap-4 pt-1 border-t mt-2">
                        <span className="text-muted-foreground">Utilization:</span>
                        <span className="font-semibold">{data.utilizationPercent}%</span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="jobs" stackId="a" fill="hsl(var(--chart-3))" name="Jobs" />
          <Bar dataKey="employers" stackId="a" fill="hsl(var(--chart-4))" name="Employers" />
          <Bar dataKey="available" stackId="a" name="Available Capacity">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCapacityColor(entry.utilizationPercent)} opacity={0.3} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
