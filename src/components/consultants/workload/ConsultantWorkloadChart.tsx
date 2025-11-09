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
    assigned: item.hoursAssigned,
    available: item.hoursRemaining,
    utilizationPercent: item.utilizationPercent,
  }));

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Team Workload Overview</h3>
          <p className="text-sm text-muted-foreground">Hours assigned vs. available (160h/month)</p>
        </div>
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
                        <span className="text-muted-foreground">Hours Assigned:</span>
                        <span className="font-medium">{data.assigned}h</span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Hours Available:</span>
                        <span className="font-medium">{data.available}h</span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Total Capacity:</span>
                        <span className="font-medium">160h</span>
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
          <Bar dataKey="assigned" stackId="a" fill="hsl(var(--chart-3))" name="Hours Assigned" />
          <Bar dataKey="available" stackId="a" name="Hours Available">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCapacityColor(entry.utilizationPercent)} opacity={0.4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
