import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { getClientAdoptionStats } from '@/lib/addons/combinedAnalytics';

export function ClientAdoptionChart() {
  const stats = getClientAdoptionStats();
  
  const data = [
    { name: 'Using 1 Service', clients: stats.usingOne, fill: 'hsl(var(--chart-1))' },
    { name: 'Using 2 Services', clients: stats.usingTwo, fill: 'hsl(var(--chart-2))' },
    { name: 'Using All 3', clients: stats.usingAll, fill: 'hsl(var(--chart-3))' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Adoption Patterns</CardTitle>
        <CardDescription>How clients utilize add-on services</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))' 
              }}
              formatter={(value: number) => [`${value} clients`, 'Count']}
            />
            <Bar dataKey="clients" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
