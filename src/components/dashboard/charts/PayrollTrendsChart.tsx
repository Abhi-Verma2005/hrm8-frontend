import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", payroll: 850, forecast: 860 },
  { month: "Feb", payroll: 860, forecast: 870 },
  { month: "Mar", payroll: 875, forecast: 880 },
  { month: "Apr", payroll: 880, forecast: 890 },
  { month: "May", payroll: 890, forecast: 900 },
  { month: "Jun", payroll: 890, forecast: 910 },
];

export function PayrollTrendsChart() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle>Payroll Trends</CardTitle>
        <CardDescription>Payroll cost over time (in thousands)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="payroll" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual" />
            <Line type="monotone" dataKey="forecast" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Forecast" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
