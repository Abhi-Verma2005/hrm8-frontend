import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMonthlyPlacementTrends } from '@/lib/performanceStorage';

interface PerformanceTrendsChartProps {
  consultantId: string;
}

export function PerformanceTrendsChart({ consultantId }: PerformanceTrendsChartProps) {
  const data = getMonthlyPlacementTrends(consultantId, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Placement Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="placements" stroke="hsl(var(--primary))" strokeWidth={2} name="Placements" />
            <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Target" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
