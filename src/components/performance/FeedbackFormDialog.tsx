import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Feedback, FeedbackType } from "@/types/performance";
import { saveFeedback } from "@/lib/performanceStorage";
import { getEmployees } from "@/lib/employeeStorage";
import { toast } from "sonner";

interface FeedbackFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function FeedbackFormDialog({ open, onOpenChange, onSuccess }: FeedbackFormDialogProps) {
  const employees = getEmployees();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    type: "positive" as FeedbackType,
    category: "",
    content: "",
    isAnonymous: false,
    isPrivate: false,
  });

  const selectedEmployee = employees.find(e => e.id === formData.employeeId);

  const handleSave = async () => {
    if (!formData.employeeId || !formData.category || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const feedbackData: Feedback = {
        id: `feedback-${Date.now()}`,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "",
        fromId: "current-user",
        fromName: "Current User",
        type: formData.type,
        category: formData.category,
        content: formData.content,
        isAnonymous: formData.isAnonymous,
        isPrivate: formData.isPrivate,
        createdAt: new Date().toISOString(),
      };

      saveFeedback(feedbackData);
      toast.success("Feedback submitted successfully");
      onSuccess();
      onOpenChange(false);
      setFormData({
        employeeId: "",
        type: "positive",
        category: "",
        content: "",
        isAnonymous: false,
        isPrivate: false,
      });
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Give Feedback</DialogTitle>
          <DialogDescription>
            Provide feedback to help your team members grow
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Employee *</Label>
              <Select value={formData.employeeId} onValueChange={(val) => setFormData({ ...formData, employeeId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as FeedbackType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="constructive">Constructive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Category *</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Communication, Teamwork, Leadership"
            />
          </div>

          <div>
            <Label>Feedback *</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your feedback..."
              rows={5}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="anonymous">Submit Anonymously</Label>
            <Switch
              id="anonymous"
              checked={formData.isAnonymous}
              onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="private">Private Feedback</Label>
            <Switch
              id="private"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
