import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PerformanceGoal, GoalStatus } from "@/types/performance";
import { savePerformanceGoal } from "@/lib/performanceStorage";
import { toast } from "sonner";
import { TrendingUp, CheckCircle2 } from "lucide-react";

interface GoalProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: PerformanceGoal;
  onSuccess?: () => void;
}

export function GoalProgressDialog({ open, onOpenChange, goal, onSuccess }: GoalProgressDialogProps) {
  const [progress, setProgress] = useState(goal.progress);
  const [status, setStatus] = useState(goal.status);
  const [kpiValues, setKpiValues] = useState(
    goal.kpis?.reduce((acc, kpi) => {
      acc[kpi.id] = kpi.current;
      return acc;
    }, {} as Record<string, number>) || {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedGoal: PerformanceGoal = {
        ...goal,
        progress,
        status,
        kpis: goal.kpis?.map((kpi) => ({
          ...kpi,
          current: kpiValues[kpi.id] || kpi.current,
        })),
        completedDate: status === 'completed' && !goal.completedDate ? new Date().toISOString() : goal.completedDate,
        updatedAt: new Date().toISOString(),
      };

      savePerformanceGoal(updatedGoal);
      toast.success("Progress updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
            <DialogDescription>
              Update the overall progress and KPI values for {goal.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Overall Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="progress">Overall Progress</Label>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <Slider
                id="progress"
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as GoalStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* KPIs */}
            {goal.kpis && goal.kpis.length > 0 && (
              <div className="space-y-4 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  Key Performance Indicators
                </div>
                {goal.kpis.map((kpi) => (
                  <div key={kpi.id} className="space-y-2">
                    <Label htmlFor={`kpi-${kpi.id}`} className="text-sm">
                      {kpi.name}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id={`kpi-${kpi.id}`}
                        type="number"
                        min={0}
                        max={kpi.target}
                        step="0.01"
                        value={kpiValues[kpi.id] || kpi.current}
                        onChange={(e) =>
                          setKpiValues((prev) => ({
                            ...prev,
                            [kpi.id]: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        / {kpi.target} {kpi.unit}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(((kpiValues[kpi.id] || kpi.current) / kpi.target) * 100)}% complete
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completion Message */}
            {status === 'completed' && (
              <div className="flex items-start gap-2 p-3 border rounded-lg bg-success/10 border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-success">Goal Completed!</p>
                  <p className="text-muted-foreground">Great work achieving this goal.</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Progress"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
