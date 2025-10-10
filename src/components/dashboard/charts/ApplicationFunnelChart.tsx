import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const data = [
  { stage: "Applied", count: 1234, conversion: 100 },
  { stage: "Screening", count: 456, conversion: 37 },
  { stage: "Interview", count: 189, conversion: 15 },
  { stage: "Offer", count: 67, conversion: 5 },
  { stage: "Hired", count: 52, conversion: 4 },
];

const chartConfig = {
  count: {
    label: "Candidates",
    color: "hsl(var(--primary))",
  },
};

export function ApplicationFunnelChart() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
        <CardDescription>Candidate conversion through hiring stages</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value, name, props) => [
                `${value} (${props.payload.conversion}%)`,
                "Candidates",
              ]}
            />
            <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
