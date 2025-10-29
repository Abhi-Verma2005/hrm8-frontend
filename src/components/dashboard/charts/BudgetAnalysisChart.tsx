import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { category: "Payroll", budget: 1000, actual: 890 },
  { category: "Marketing", budget: 300, actual: 320 },
  { category: "Operations", budget: 250, actual: 230 },
  { category: "Technology", budget: 200, actual: 180 },
  { category: "Travel", budget: 150, actual: 140 },
  { category: "Facilities", budget: 100, actual: 95 },
];

export function BudgetAnalysisChart() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle>Budget Analysis</CardTitle>
        <CardDescription>Budget vs actual spending (in thousands)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="hsl(var(--chart-1))" name="Budget" />
            <Bar dataKey="actual" fill="hsl(var(--chart-2))" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
