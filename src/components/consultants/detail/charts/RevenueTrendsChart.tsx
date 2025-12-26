import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMonthlyRevenueTrends } from '@/lib/performanceStorage';

interface RevenueTrendsChartProps {
  consultantId: string;
}

export function RevenueTrendsChart({ consultantId }: RevenueTrendsChartProps) {
  const data = getMonthlyRevenueTrends(consultantId, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
            <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
