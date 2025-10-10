import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const data = [
  { month: "Apr", applications: 145, interviews: 52, hired: 12 },
  { month: "May", applications: 178, interviews: 64, hired: 15 },
  { month: "Jun", applications: 203, interviews: 78, hired: 19 },
  { month: "Jul", applications: 189, interviews: 71, hired: 17 },
  { month: "Aug", applications: 225, interviews: 89, hired: 21 },
  { month: "Sep", applications: 267, interviews: 98, hired: 24 },
];

const chartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--primary))",
  },
  interviews: {
    label: "Interviews",
    color: "hsl(var(--secondary))",
  },
  hired: {
    label: "Hired",
    color: "hsl(var(--success))",
  },
};

export function HiringTrendsChart() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Hiring Trends</CardTitle>
        <CardDescription>Application flow over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillInterviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillHired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="hsl(var(--primary))"
              fill="url(#fillApplications)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="interviews"
              stroke="hsl(var(--secondary))"
              fill="url(#fillInterviews)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="hired"
              stroke="hsl(var(--success))"
              fill="url(#fillHired)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
