import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import type { CheckTypeMetrics } from '@/lib/backgroundChecks/analyticsService';

interface CheckTypeComparisonChartProps {
  data: CheckTypeMetrics[];
}

export function CheckTypeComparisonChart({ data }: CheckTypeComparisonChartProps) {
  const navigate = useNavigate();

  const handleBarClick = (data: any) => {
    if (!data || !data.type) return;
    
    // Convert display name back to type key
    const typeMap: Record<string, string> = {
      'Reference': 'reference',
      'Criminal': 'criminal',
      'Identity': 'identity',
      'Education': 'education',
      'Employment': 'employment',
      'Credit': 'credit',
      'Drug Screen': 'drug-screen',
      'Professional License': 'professional-license',
    };
    
    const checkType = typeMap[data.type] || data.type.toLowerCase();
    
    // Navigate to main page with check type filter
    const params = new URLSearchParams({
      checkType,
    });
    
    navigate(`/background-checks?${params.toString()}`);
    
    toast({
      title: "Filters Applied",
      description: `Viewing ${data.type} checks`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Type Comparison</CardTitle>
        <CardDescription>Volume, completion time, and success rate by check type. Click on any bar to view those checks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="type" className="text-xs" angle={-45} textAnchor="end" height={100} />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
            />
            <Legend />
            <Bar 
              dataKey="total" 
              fill="hsl(var(--primary))" 
              name="Total Checks" 
              onClick={handleBarClick}
              cursor="pointer"
            />
            <Bar 
              dataKey="completed" 
              fill="hsl(var(--success))" 
              name="Completed" 
              onClick={handleBarClick}
              cursor="pointer"
            />
            <Bar 
              dataKey="avgTime" 
              fill="hsl(var(--warning))" 
              name="Avg. Days" 
              onClick={handleBarClick}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
