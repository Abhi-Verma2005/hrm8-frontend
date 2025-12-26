import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Employer } from "@/types/entities";
import { Package, Users } from "lucide-react";
import { ModuleStatusBadge } from "../badges/ModuleStatusBadge";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getEmployerBillingBreakdown } from "@/lib/employerModuleUtils";

interface EmployerModulesCardProps {
  employer: Employer;
}

export function EmployerModulesCard({ employer }: EmployerModulesCardProps) {
  const { modules } = employer;
  const billing = getEmployerBillingBreakdown(employer);
  
  const addonLabels: Record<string, string> = {
    'assessments': 'Skills Assessments',
    'reference-checking': 'Reference Checking',
    'video-interviewing': 'Video Interviewing'
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="w-5 h-5" />
          Enabled Modules
        </CardTitle>
        <CardDescription>Active platform features and add-ons</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Core Modules */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Core Modules</h4>
          <div className="flex flex-wrap gap-2">
            <ModuleStatusBadge enabled={modules.atsEnabled} moduleName="ATS" />
            <ModuleStatusBadge enabled={modules.hrmsEnabled} moduleName="HRMS" />
          </div>
        </div>

        {/* HRMS Details */}
        {modules.hrmsEnabled && modules.hrmsEmployeeCount && (
          <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium">HRMS Employee Count</span>
              </div>
              <span className="font-semibold text-primary">
                {modules.hrmsEmployeeCount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Billed at ${6}/employee/month (minimum 50 employees per block)
            </p>
          </div>
        )}

        {/* Add-on Services */}
        {modules.enabledAddons.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Add-on Services</h4>
            <div className="flex flex-wrap gap-2">
              {modules.enabledAddons.map((addon) => (
                <Badge 
                  key={addon} 
                  variant="outline"
                  className="bg-accent/10 text-accent-foreground border-accent/20"
                >
                  {addonLabels[addon] || addon}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Billing Breakdown */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-semibold text-foreground">Monthly Billing</h4>
          <div className="space-y-2">
            {billing.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.item}</span>
                <span className="font-medium">{formatCurrency(item.cost)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-base font-semibold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(billing.total)}</span>
            </div>
          </div>
        </div>

        {/* No modules warning */}
        {!modules.atsEnabled && !modules.hrmsEnabled && (
          <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground text-center">
            No modules currently enabled
          </div>
        )}
      </CardContent>
    </Card>
  );
}
