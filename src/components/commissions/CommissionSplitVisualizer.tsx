import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CommissionRoleAssignment } from "@/types/commissionRole";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CommissionSplitVisualizerProps {
  roleAssignments: CommissionRoleAssignment[];
  totalAmount: number;
  currency?: string;
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export function CommissionSplitVisualizer({ roleAssignments, totalAmount, currency = 'USD' }: CommissionSplitVisualizerProps) {
  const chartData = roleAssignments.map((ra) => ({
    name: ra.roleName,
    value: ra.percentage,
    amount: ra.commissionAmount,
    consultant: ra.consultantName,
  }));

  const totalPercentage = roleAssignments.reduce((sum, ra) => sum + ra.percentage, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Commission Split</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% ($${props.payload.amount.toLocaleString()})`,
                    props.payload.consultant
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown List */}
          <div className="space-y-3">
            {roleAssignments.map((ra, index) => (
              <div key={ra.id || index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <div className="font-medium">{ra.roleName}</div>
                    <div className="text-sm text-muted-foreground">{ra.consultantName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${ra.commissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-sm text-muted-foreground">{ra.percentage}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Commission</div>
                <div className="text-sm text-muted-foreground">({totalPercentage}% of base amount)</div>
              </div>
              <div className="text-2xl font-bold text-primary">
                ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            {totalPercentage > 100 && (
              <Badge variant="destructive" className="mt-2">
                Warning: Total exceeds 100%
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
