import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import type { TrendDataPoint } from '@/lib/backgroundChecks/analyticsService';

interface TrendsChartProps {
  data: TrendDataPoint[];
}

export function TrendsChart({ data }: TrendsChartProps) {
  const navigate = useNavigate();

  const handleDataPointClick = (data: any) => {
    if (!data || !data.activePayload || !data.activePayload[0]) return;
    
    const point = data.activePayload[0].payload;
    const date = point.date;
    
    // Navigate to main page with date filter
    const params = new URLSearchParams({
      dateFrom: date,
      dateTo: date,
    });
    
    navigate(`/background-checks?${params.toString()}`);
    
    toast({
      title: "Filters Applied",
      description: `Viewing checks from ${new Date(date).toLocaleDateString()}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trends Over Time</CardTitle>
        <CardDescription>Check volume, completion rates, and average processing time. Click on any point to view those checks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} onClick={handleDataPointClick} style={{ cursor: 'pointer' }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="totalChecks" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Total Checks"
              dot={{ r: 4, strokeWidth: 2, cursor: 'pointer' }}
              activeDot={{ r: 6, strokeWidth: 2, cursor: 'pointer' }}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              name="Completed"
              dot={{ r: 4, strokeWidth: 2, cursor: 'pointer' }}
              activeDot={{ r: 6, strokeWidth: 2, cursor: 'pointer' }}
            />
            <Line 
              type="monotone" 
              dataKey="inProgress" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2}
              name="In Progress"
              dot={{ r: 4, strokeWidth: 2, cursor: 'pointer' }}
              activeDot={{ r: 6, strokeWidth: 2, cursor: 'pointer' }}
            />
            <Line 
              type="monotone" 
              dataKey="avgCompletionTime" 
              stroke="hsl(var(--info))" 
              strokeWidth={2}
              name="Avg. Days to Complete"
              dot={{ r: 4, strokeWidth: 2, cursor: 'pointer' }}
              activeDot={{ r: 6, strokeWidth: 2, cursor: 'pointer' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
