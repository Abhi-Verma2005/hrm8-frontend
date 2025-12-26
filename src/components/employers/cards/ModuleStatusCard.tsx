import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Employer } from "@/types/entities";
import { CheckCircle2, XCircle, Users, TrendingUp } from "lucide-react";
import { calculateMonthlyCost, getAvailableModules, getModuleCategories } from "@/lib/moduleAccessControl";
import { SUBSCRIPTION_TIERS } from "@/lib/subscriptionConfig";

interface ModuleStatusCardProps {
  employer: Employer;
}

export function ModuleStatusCard({ employer }: ModuleStatusCardProps) {
  const availableModules = getAvailableModules(employer.subscriptionTier, employer.modules);
  const categories = getModuleCategories();
  const monthlyCost = calculateMonthlyCost(employer.subscriptionTier, employer.modules);
  const tierConfig = SUBSCRIPTION_TIERS[employer.subscriptionTier];

  const atsModuleCount = availableModules.filter(m => m.startsWith('ats.')).length;
  const hrmsModuleCount = availableModules.filter(m => m.startsWith('hrms.')).length;
  const addonCount = availableModules.filter(m => m.startsWith('addon.')).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Module Access</span>
          <Badge variant="outline">{tierConfig.name}</Badge>
        </CardTitle>
        <CardDescription>
          Active modules and subscription details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Summary */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Subscription</p>
            <p className="text-2xl font-bold">${monthlyCost.toLocaleString()}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Module Status */}
        <div className="space-y-4">
          {/* ATS Status */}
          <div className="flex items-start gap-3">
            {employer.modules.atsEnabled ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Applicant Tracking System (ATS)</p>
                <Badge variant={employer.modules.atsEnabled ? "default" : "secondary"}>
                  {employer.modules.atsEnabled ? "Active" : "Inactive"}
                </Badge>
              </div>
              {employer.modules.atsEnabled && (
                <p className="text-sm text-muted-foreground mt-1">
                  {atsModuleCount} modules available
                </p>
              )}
            </div>
          </div>

          {/* HRMS Status */}
          <div className="flex items-start gap-3">
            {employer.modules.hrmsEnabled ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">HR Management System (HRMS)</p>
                <Badge variant={employer.modules.hrmsEnabled ? "default" : "secondary"}>
                  {employer.modules.hrmsEnabled ? "Active" : "Inactive"}
                </Badge>
              </div>
              {employer.modules.hrmsEnabled && employer.modules.hrmsEmployeeCount && (
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {employer.modules.hrmsEmployeeCount} employees • {hrmsModuleCount} modules
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons Status */}
          {addonCount > 0 && (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Add-on Services</p>
                  <Badge variant="default">{addonCount} Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {employer.modules.enabledAddons.join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Modules</p>
            <p className="text-xl font-semibold">{availableModules.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Billing Cycle</p>
            <p className="text-xl font-semibold capitalize">{employer.billingCycle || 'Monthly'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
