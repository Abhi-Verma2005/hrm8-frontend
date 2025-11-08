import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, DollarSign, AlertCircle, Settings } from "lucide-react";
import { calculateMonthlyCost, canEnableHRMS, calculateHRMSCost } from "@/lib/moduleAccessControl";
import { type SubscriptionTier } from "@/lib/subscriptionConfig";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ModuleChangeConfirmDialog from "./ModuleChangeConfirmDialog";

interface ModuleSettingsCardProps {
  currentTier: SubscriptionTier;
  atsEnabled: boolean;
  hrmsEnabled: boolean;
  hrmsEmployeeCount: number;
  onModuleChange: (atsEnabled: boolean, hrmsEnabled: boolean, hrmsEmployeeCount: number) => void;
}

export default function ModuleSettingsCard({
  currentTier,
  atsEnabled,
  hrmsEnabled,
  hrmsEmployeeCount,
  onModuleChange,
}: ModuleSettingsCardProps) {
  const { toast } = useToast();
  const [localAtsEnabled, setLocalAtsEnabled] = useState(atsEnabled);
  const [localHrmsEnabled, setLocalHrmsEnabled] = useState(hrmsEnabled);
  const [localEmployeeCount, setLocalEmployeeCount] = useState(hrmsEmployeeCount);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const canEnableHRMSModule = canEnableHRMS(currentTier);
  const currentCost = calculateMonthlyCost(currentTier, { 
    atsEnabled, 
    hrmsEnabled, 
    hrmsEmployeeCount,
    enabledAddons: [] 
  });
  const newCost = calculateMonthlyCost(currentTier, { 
    atsEnabled: localAtsEnabled, 
    hrmsEnabled: localHrmsEnabled,
    hrmsEmployeeCount: localEmployeeCount,
    enabledAddons: []
  });
  const costDifference = newCost - currentCost;
  const hasChanges = 
    localAtsEnabled !== atsEnabled || 
    localHrmsEnabled !== hrmsEnabled || 
    localEmployeeCount !== hrmsEmployeeCount;

  const handleAtsToggle = (checked: boolean) => {
    // ATS is the core module, always enabled for non-free tiers
    if (currentTier === 'ats-lite' || currentTier === 'payg') {
      setLocalAtsEnabled(checked);
    } else {
      toast({
        title: "ATS Module Required",
        description: "ATS module is included in your subscription tier and cannot be disabled.",
        variant: "destructive",
      });
    }
  };

  const handleHrmsToggle = (checked: boolean) => {
    if (!canEnableHRMSModule && checked) {
      toast({
        title: "Upgrade Required",
        description: "HRMS module is only available on Small, Medium, Large, and Enterprise plans.",
        variant: "destructive",
      });
      return;
    }
    setLocalHrmsEnabled(checked);
  };

  const handleEmployeeCountChange = (value: string) => {
    const count = parseInt(value) || 0;
    // Round to nearest 50
    const rounded = Math.max(50, Math.ceil(count / 50) * 50);
    setLocalEmployeeCount(rounded);
  };

  const handleSave = () => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmChange = () => {
    onModuleChange(localAtsEnabled, localHrmsEnabled, localEmployeeCount);
    setShowConfirmDialog(false);
    toast({
      title: "Modules Updated",
      description: "Your module configuration has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setLocalAtsEnabled(atsEnabled);
    setLocalHrmsEnabled(hrmsEnabled);
    setLocalEmployeeCount(hrmsEmployeeCount);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Module Configuration
              </CardTitle>
              <CardDescription>
                Manage your subscribed modules and employee capacity
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg">
              <DollarSign className="h-4 w-4 mr-1" />
              {currentCost.toFixed(2)}/month
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ATS Module */}
          <div className="space-y-4 p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ats-module" className="text-base font-semibold">
                      ATS Module
                    </Label>
                    {localAtsEnabled && <Badge variant="default">Active</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Applicant Tracking System for job postings, candidate management, and recruitment workflows
                  </p>
                  {currentTier !== 'ats-lite' && currentTier !== 'payg' && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Included in your {currentTier.toUpperCase()} plan
                    </p>
                  )}
                </div>
              </div>
              <Switch
                id="ats-module"
                checked={localAtsEnabled}
                onCheckedChange={handleAtsToggle}
                disabled={currentTier !== 'ats-lite' && currentTier !== 'payg'}
              />
            </div>
          </div>

          {/* HRMS Module */}
          <div className="space-y-4 p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="hrms-module" className="text-base font-semibold">
                      HRMS Module
                    </Label>
                    {localHrmsEnabled && <Badge variant="default">Active</Badge>}
                    {!canEnableHRMSModule && (
                      <Badge variant="secondary">Upgrade Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete HR Management System with payroll, attendance, leave, benefits, and more
                  </p>
                  {localHrmsEnabled && (
                    <div className="mt-3 space-y-2">
                      <Label htmlFor="employee-count" className="text-sm">
                        Employee Count (billed in blocks of 50)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="employee-count"
                          type="number"
                          min="50"
                          step="50"
                          value={localEmployeeCount}
                          onChange={(e) => handleEmployeeCountChange(e.target.value)}
                          className="w-32"
                        />
                        <div className="text-sm">
                          <span className="font-semibold">
                            ${calculateHRMSCost(localEmployeeCount).toFixed(2)}/month
                          </span>
                          <span className="text-muted-foreground ml-1">
                            (${(calculateHRMSCost(localEmployeeCount) / localEmployeeCount).toFixed(2)} per employee)
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum 50 employees. Price: $6/employee/month in blocks of 50.
                      </p>
                    </div>
                  )}
                  {!canEnableHRMSModule && (
                    <div className="flex items-start gap-2 mt-2 p-2 rounded bg-muted">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        HRMS module is available on Small, Medium, Large, and Enterprise plans.
                        Upgrade your subscription to enable this module.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Switch
                id="hrms-module"
                checked={localHrmsEnabled}
                onCheckedChange={handleHrmsToggle}
                disabled={!canEnableHRMSModule}
              />
            </div>
          </div>

          {/* Cost Summary */}
          {hasChanges && (
            <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
              <h4 className="font-semibold text-sm">Cost Impact</h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Monthly Cost:</span>
                <span className="font-medium">${currentCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">New Monthly Cost:</span>
                <span className="font-medium">${newCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span className="font-semibold">Difference:</span>
                <span className={`font-semibold ${costDifference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {costDifference > 0 ? '+' : ''}{costDifference > 0 ? costDifference.toFixed(2) : '0.00'} /month
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1"
            >
              Save Changes
            </Button>
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ModuleChangeConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        currentConfig={{ atsEnabled, hrmsEnabled, hrmsEmployeeCount }}
        newConfig={{ atsEnabled: localAtsEnabled, hrmsEnabled: localHrmsEnabled, hrmsEmployeeCount: localEmployeeCount }}
        currentCost={currentCost}
        newCost={newCost}
        onConfirm={handleConfirmChange}
      />
    </>
  );
}
