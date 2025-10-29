import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { quarter: "Q1", actual: 580, forecast: 580 },
  { quarter: "Q2", actual: 620, forecast: 620 },
  { quarter: "Q3", actual: null, forecast: 680 },
  { quarter: "Q4", actual: null, forecast: 750 },
];

export function RevenueForecastChart() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle>Revenue Forecast</CardTitle>
        <CardDescription>Projected revenue by quarter (in thousands)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="quarter" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual" connectNulls />
            <Line type="monotone" dataKey="forecast" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Forecast" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
