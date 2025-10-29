import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", vacation: 15, sick: 8, personal: 5 },
  { month: "Feb", vacation: 12, sick: 10, personal: 4 },
  { month: "Mar", vacation: 18, sick: 7, personal: 6 },
  { month: "Apr", vacation: 20, sick: 9, personal: 7 },
  { month: "May", vacation: 25, sick: 6, personal: 5 },
  { month: "Jun", vacation: 30, sick: 8, personal: 8 },
];

export function LeaveAnalysisChart() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle>Leave Analysis</CardTitle>
        <CardDescription>Leave trends and types</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Bar dataKey="vacation" fill="hsl(var(--chart-1))" name="Vacation" />
            <Bar dataKey="sick" fill="hsl(var(--chart-2))" name="Sick Leave" />
            <Bar dataKey="personal" fill="hsl(var(--chart-3))" name="Personal" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
