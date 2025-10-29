import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { level: "Entry Level", count: 42, percentage: "28%" },
  { level: "Mid Level", count: 58, percentage: "39%" },
  { level: "Senior", count: 38, percentage: "25%" },
  { level: "Executive", count: 12, percentage: "8%" },
];

export function CandidateExperienceBreakdownChart() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle>Experience Breakdown</CardTitle>
        <CardDescription>Candidates by experience level</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis dataKey="level" type="category" className="text-xs" width={100} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
