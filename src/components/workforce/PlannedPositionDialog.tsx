import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { plannedPositionSchema, type PlannedPositionFormData } from "@/schemas/headcountPlanSchema";
import { toast } from "sonner";

interface PlannedPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (position: PlannedPositionFormData) => void;
}

export function PlannedPositionDialog({ open, onOpenChange, onSuccess }: PlannedPositionDialogProps) {
  const form = useForm<PlannedPositionFormData>({
    resolver: zodResolver(plannedPositionSchema),
    defaultValues: {
      jobTitle: "",
      level: "",
      department: "",
      location: "",
      hireDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      estimatedSalary: 0,
      positionType: "new",
      justification: "",
      status: "planned",
    },
  });

  const onSubmit = (data: PlannedPositionFormData) => {
    try {
      const position: PlannedPositionFormData = {
        ...data,
        status: "planned",
      };
      toast.success("Position added to plan");
      onOpenChange(false);
      onSuccess?.(position);
      form.reset();
    } catch (error) {
      toast.error("Failed to add position");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Planned Position</DialogTitle>
          <DialogDescription>Define a position for your headcount plan</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" {...form.register("jobTitle")} placeholder="Senior Software Engineer" />
              {form.formState.errors.jobTitle && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.jobTitle.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="level">Level</Label>
              <Input id="level" {...form.register("level")} placeholder="L5, Senior, etc." />
              {form.formState.errors.level && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.level.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" {...form.register("department")} placeholder="Engineering" />
              {form.formState.errors.department && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.department.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" {...form.register("location")} placeholder="Remote, NYC, etc." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hireDate">Target Hire Date</Label>
              <Input id="hireDate" type="date" {...form.register("hireDate")} />
              {form.formState.errors.hireDate && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.hireDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="estimatedSalary">Estimated Salary ($)</Label>
              <Input 
                id="estimatedSalary" 
                type="number" 
                {...form.register("estimatedSalary", { valueAsNumber: true })} 
                placeholder="120000"
              />
              {form.formState.errors.estimatedSalary && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.estimatedSalary.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="positionType">Position Type</Label>
            <Select onValueChange={(value: any) => form.setValue("positionType", value)} defaultValue="new">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Position</SelectItem>
                <SelectItem value="replacement">Replacement</SelectItem>
                <SelectItem value="backfill">Backfill</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.watch("positionType") === "replacement" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="replacingEmployeeId">Replacing Employee ID</Label>
                <Input id="replacingEmployeeId" {...form.register("replacingEmployeeId")} placeholder="EMP-123" />
              </div>

              <div>
                <Label htmlFor="replacingEmployeeName">Replacing Employee Name</Label>
                <Input id="replacingEmployeeName" {...form.register("replacingEmployeeName")} placeholder="John Doe" />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="justification">Business Justification</Label>
            <Textarea 
              id="justification" 
              {...form.register("justification")} 
              placeholder="Explain why this position is needed..."
              rows={4}
            />
            {form.formState.errors.justification && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.justification.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Position</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
