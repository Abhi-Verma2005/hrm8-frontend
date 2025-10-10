import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell, Legend } from "recharts";

const data = [
  { department: "Engineering", value: 47, fill: "hsl(var(--primary))" },
  { department: "Sales", value: 28, fill: "hsl(var(--success))" },
  { department: "Marketing", value: 18, fill: "hsl(var(--secondary))" },
  { department: "Operations", value: 15, fill: "hsl(var(--warning))" },
  { department: "Other", value: 12, fill: "hsl(var(--muted-foreground))" },
];

const chartConfig = {
  value: {
    label: "Jobs",
  },
};

export function JobDistributionChart() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Job Distribution</CardTitle>
        <CardDescription>Active jobs by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value, name, props) => [
                `${value} jobs (${Math.round((Number(value) / 120) * 100)}%)`,
                props.payload.department,
              ]}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-xs text-muted-foreground">
                  {entry.payload.department}: {entry.payload.value}
                </span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
