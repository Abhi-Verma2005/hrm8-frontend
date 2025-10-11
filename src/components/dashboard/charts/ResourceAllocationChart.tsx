import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { team: "Team A", billable: 85, non_billable: 15 },
  { team: "Team B", billable: 78, non_billable: 22 },
  { team: "Team C", billable: 92, non_billable: 8 },
  { team: "Team D", billable: 70, non_billable: 30 },
  { team: "Team E", billable: 88, non_billable: 12 },
];

export function ResourceAllocationChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
        <CardDescription>Team allocation across projects (%)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="team" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Bar dataKey="billable" stackId="a" fill="hsl(var(--chart-1))" name="Billable" />
            <Bar dataKey="non_billable" stackId="a" fill="hsl(var(--chart-2))" name="Non-Billable" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
