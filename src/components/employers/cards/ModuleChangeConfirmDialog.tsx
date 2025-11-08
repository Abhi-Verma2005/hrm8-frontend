import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface ModuleConfig {
  atsEnabled: boolean;
  hrmsEnabled: boolean;
  hrmsEmployeeCount: number;
}

interface ModuleChangeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentConfig: ModuleConfig;
  newConfig: ModuleConfig;
  currentCost: number;
  newCost: number;
  onConfirm: () => void;
}

export default function ModuleChangeConfirmDialog({
  open,
  onOpenChange,
  currentConfig,
  newConfig,
  currentCost,
  newCost,
  onConfirm,
}: ModuleChangeConfirmDialogProps) {
  const costDifference = newCost - currentCost;

  const ModuleStatusRow = ({ label, current, next }: { label: string; current: boolean; next: boolean }) => {
    const Icon = next ? CheckCircle : XCircle;
    const changed = current !== next;

    return (
      <div className="flex items-center justify-between py-2">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <Badge variant={current ? "default" : "secondary"}>
            {current ? "Enabled" : "Disabled"}
          </Badge>
          {changed && (
            <>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant={next ? "default" : "secondary"}>
                <Icon className="h-3 w-3 mr-1" />
                {next ? "Enabled" : "Disabled"}
              </Badge>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Module Changes</AlertDialogTitle>
          <AlertDialogDescription>
            Review the changes to your module configuration before confirming.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Module Changes */}
          <div className="space-y-1">
            <ModuleStatusRow
              label="ATS Module"
              current={currentConfig.atsEnabled}
              next={newConfig.atsEnabled}
            />
            <ModuleStatusRow
              label="HRMS Module"
              current={currentConfig.hrmsEnabled}
              next={newConfig.hrmsEnabled}
            />
            
            {(currentConfig.hrmsEnabled || newConfig.hrmsEnabled) && (
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">HRMS Employee Count</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{currentConfig.hrmsEmployeeCount}</Badge>
                  {currentConfig.hrmsEmployeeCount !== newConfig.hrmsEmployeeCount && (
                    <>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{newConfig.hrmsEmployeeCount}</Badge>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Cost Impact */}
          <div className="space-y-2 p-4 rounded-lg bg-muted">
            <h4 className="font-semibold text-sm">Billing Impact</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current:</span>
                <span className="font-medium">${currentCost.toFixed(2)}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">New:</span>
                <span className="font-medium">${newCost.toFixed(2)}/month</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Change:</span>
                <span className={costDifference > 0 ? 'text-orange-600' : 'text-green-600'}>
                  {costDifference > 0 ? '+' : ''}{costDifference > 0 ? `$${costDifference.toFixed(2)}` : '$0.00'}/month
                </span>
              </div>
            </div>
          </div>

          {costDifference > 0 && (
            <p className="text-sm text-muted-foreground">
              The cost increase will be prorated and reflected in your next billing cycle.
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
