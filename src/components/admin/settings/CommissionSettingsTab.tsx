import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Percent } from "lucide-react";

export function CommissionSettingsTab() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Percent className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Commission Settings</CardTitle>
        <CardDescription>
          Manage commission structures, rates, and payout rules
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          This feature is under development and will be available soon.
        </p>
      </CardContent>
    </Card>
  );
}
