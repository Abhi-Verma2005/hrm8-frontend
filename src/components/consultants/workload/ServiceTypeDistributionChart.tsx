import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ServiceTypeBreakdown } from '@/lib/consultantWorkloadUtils';

interface ServiceTypeDistributionChartProps {
  data: ServiceTypeBreakdown;
}

const SERVICE_COLORS = {
  shortlisting: 'hsl(var(--chart-1))',
  'full-service': 'hsl(var(--chart-2))',
  'executive-search': 'hsl(var(--chart-3))',
  rpo: 'hsl(var(--chart-4))',
};

const SERVICE_LABELS = {
  shortlisting: 'Shortlisting',
  'full-service': 'Full Service',
  'executive-search': 'Executive Search',
  rpo: 'RPO',
};

export function ServiceTypeDistributionChart({ data }: ServiceTypeDistributionChartProps) {
  const chartData = [
    { name: SERVICE_LABELS.shortlisting, value: data.shortlisting.count, hours: data.shortlisting.hours, percentage: data.shortlisting.percentage },
    { name: SERVICE_LABELS['full-service'], value: data['full-service'].count, hours: data['full-service'].hours, percentage: data['full-service'].percentage },
    { name: SERVICE_LABELS['executive-search'], value: data['executive-search'].count, hours: data['executive-search'].hours, percentage: data['executive-search'].percentage },
    { name: SERVICE_LABELS.rpo, value: data.rpo.count, hours: data.rpo.hours, percentage: data.rpo.percentage },
  ].filter(item => item.value > 0);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Service Type Distribution</h3>
        <p className="text-sm text-muted-foreground">Active services by type</p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No active services
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              label={({ percentage }) => `${percentage}%`}
            >
              {chartData.map((entry, index) => {
                const serviceType = Object.keys(SERVICE_LABELS).find(
                  key => SERVICE_LABELS[key as keyof typeof SERVICE_LABELS] === entry.name
                ) as keyof typeof SERVICE_COLORS;
                
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={SERVICE_COLORS[serviceType]} 
                  />
                );
              })}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold mb-1">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.value} service{data.value !== 1 ? 's' : ''} ({data.percentage}%)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data.hours} hours total
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{data.total}</p>
          <p className="text-sm text-muted-foreground">Total Services</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{data.totalHours}h</p>
          <p className="text-sm text-muted-foreground">Total Hours</p>
        </div>
      </div>
    </Card>
  );
}
