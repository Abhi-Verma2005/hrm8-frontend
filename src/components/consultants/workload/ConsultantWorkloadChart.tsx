import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { WorkloadData } from '@/lib/consultantWorkloadUtils';
import { getCapacityColor } from '@/lib/consultantWorkloadUtils';
import { CalendarOff } from 'lucide-react';
import { MONTHLY_HOURS_AVAILABLE } from '@/lib/serviceHoursConfig';

interface ConsultantWorkloadChartProps {
  data: WorkloadData[];
}

export function ConsultantWorkloadChart({ data }: ConsultantWorkloadChartProps) {
  const chartData = data.map(item => ({
    name: item.consultantName,
    assigned: item.hoursAssigned,
    available: item.hoursRemaining,
    utilizationPercent: item.utilizationPercent,
    adjustedCapacity: item.monthlyHoursAvailable,
    timeOffDays: item.timeOffAdjustment?.scheduledDaysOff || 0,
    timeOffHours: item.timeOffAdjustment?.hoursOff || 0,
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
                const hasTimeOff = data.timeOffDays > 0;
                
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
                      {hasTimeOff && (
                        <p className="flex justify-between gap-4 text-warning">
                          <span className="flex items-center gap-1">
                            <CalendarOff className="h-3 w-3" />
                            Time Off:
                          </span>
                          <span className="font-medium">{data.timeOffDays}d ({data.timeOffHours}h)</span>
                        </p>
                      )}
                      <div className="pt-1 border-t mt-2 space-y-1">
                        <p className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Base Capacity:</span>
                          <span className="font-medium">{MONTHLY_HOURS_AVAILABLE}h</span>
                        </p>
                        {hasTimeOff && (
                          <p className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Adjusted Capacity:</span>
                            <span className="font-medium">{data.adjustedCapacity}h</span>
                          </p>
                        )}
                        <p className="flex justify-between gap-4 pt-1 border-t">
                          <span className="text-muted-foreground">Utilization:</span>
                          <span className="font-semibold">{data.utilizationPercent}%</span>
                        </p>
                      </div>
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
