import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function SecurityComplianceTab() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Security & Compliance</CardTitle>
        <CardDescription>
          Manage security policies, compliance requirements, and audit trails
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
