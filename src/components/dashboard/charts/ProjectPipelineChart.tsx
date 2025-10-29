import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { status: "Lead", count: 15 },
  { status: "Proposal", count: 12 },
  { status: "Negotiation", count: 8 },
  { status: "Active", count: 32 },
  { status: "Completed", count: 45 },
];

export function ProjectPipelineChart() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle>Project Pipeline</CardTitle>
        <CardDescription>Projects by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="status" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--primary))" name="Projects" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
