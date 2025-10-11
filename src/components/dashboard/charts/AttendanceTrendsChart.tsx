import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", attendance: 92, target: 95 },
  { month: "Feb", attendance: 93, target: 95 },
  { month: "Mar", attendance: 94, target: 95 },
  { month: "Apr", attendance: 94.5, target: 95 },
  { month: "May", attendance: 94.2, target: 95 },
  { month: "Jun", attendance: 93.8, target: 95 },
];

export function AttendanceTrendsChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Attendance Trends</CardTitle>
        <CardDescription>Daily attendance patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" domain={[90, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual" />
            <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Target" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
