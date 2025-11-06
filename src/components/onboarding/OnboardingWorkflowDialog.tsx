import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createWorkflowFromTemplate, getOnboardingTemplates } from "@/lib/onboardingStorage";
import { getEmployees } from "@/lib/employeeStorage";

interface OnboardingWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function OnboardingWorkflowDialog({ open, onOpenChange, onSuccess }: OnboardingWorkflowDialogProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");

  const employees = getEmployees();
  const templates = getOnboardingTemplates().filter(t => t.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee || !selectedTemplate || !assignedTo || !startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const employee = employees.find(e => e.id === selectedEmployee);
      const assignee = employees.find(e => e.id === assignedTo);

      if (!employee || !assignee) {
        toast.error("Invalid employee or assignee selection");
        return;
      }

      createWorkflowFromTemplate(selectedTemplate, {
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeEmail: employee.email,
        jobTitle: employee.jobTitle,
        department: employee.department,
        startDate,
        assignedTo: assignee.id,
        assignedToName: `${assignee.firstName} ${assignee.lastName}`,
      });

      toast.success("Onboarding workflow created successfully");
      onSuccess();
      resetForm();
    } catch (error) {
      toast.error("Failed to create workflow");
      console.error(error);
    }
  };

  const resetForm = () => {
    setSelectedEmployee("");
    setSelectedTemplate("");
    setAssignedTo("");
    setStartDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Onboarding Workflow</DialogTitle>
          <DialogDescription>
            Set up a new onboarding workflow for an employee
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee *</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} - {emp.jobTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Onboarding Template *</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.duration} days)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To *</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger id="assignedTo">
                <SelectValue placeholder="Select HR manager" />
              </SelectTrigger>
              <SelectContent>
                {employees.filter(e => e.department === 'Human Resources').map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Workflow
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
