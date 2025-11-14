import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SourceEffectivenessMetrics } from "@/lib/analyticsService";

interface SourceEffectivenessChartProps {
  data: SourceEffectivenessMetrics[];
}

export function SourceEffectivenessChart({ data }: SourceEffectivenessChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Source Effectiveness</CardTitle>
        <CardDescription>Candidate sources performance comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload as SourceEffectivenessMetrics;
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium mb-2">{data.source}</p>
                    <div className="space-y-1 text-sm">
                      <p>Total: {data.candidates} candidates</p>
                      <p>Hired: {data.hired} ({data.conversionRate}%)</p>
                      <p>Avg. Time to Hire: {data.averageTimeToHire} days</p>
                      <p>Avg. Rating: {data.averageRating}/5</p>
                    </div>
                  </div>
                );
              }}
            />
            <Legend />
            <Bar dataKey="candidates" fill="#8b5cf6" name="Total Candidates" />
            <Bar dataKey="hired" fill="#22c55e" name="Hired" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
