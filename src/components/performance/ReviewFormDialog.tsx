import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PerformanceReview, ReviewPeriod, ReviewStatus } from "@/types/performance";
import { saveReview } from "@/lib/performanceStorage";
import { getEmployees } from "@/lib/employeeStorage";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface ReviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: PerformanceReview;
  onSuccess: () => void;
}

export function ReviewFormDialog({ open, onOpenChange, review, onSuccess }: ReviewFormDialogProps) {
  const employees = getEmployees();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<PerformanceReview>>({
    employeeId: review?.employeeId || "",
    reviewerId: review?.reviewerId || "current-user",
    reviewerName: review?.reviewerName || "Current User",
    reviewPeriod: review?.reviewPeriod || "quarterly",
    periodStart: review?.periodStart || "",
    periodEnd: review?.periodEnd || "",
    dueDate: review?.dueDate || "",
    status: review?.status || "draft",
    ratings: review?.ratings || {
      technicalSkills: 3,
      communication: 3,
      teamwork: 3,
      initiative: 3,
      problemSolving: 3,
      reliability: 3,
    },
    strengths: review?.strengths || "",
    areasForImprovement: review?.areasForImprovement || "",
    achievements: review?.achievements || "",
    comments: review?.comments || "",
  });

  const selectedEmployee = employees.find(e => e.id === formData.employeeId);

  const calculateOverallRating = () => {
    const ratings = Object.values(formData.ratings || {});
    return ratings.reduce((sum, val) => sum + val, 0) / ratings.length;
  };

  const handleSave = async () => {
    if (!formData.employeeId || !formData.periodStart || !formData.periodEnd || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const reviewData: PerformanceReview = {
        id: review?.id || `review-${Date.now()}`,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "",
        reviewerId: formData.reviewerId!,
        reviewerName: formData.reviewerName!,
        reviewPeriod: formData.reviewPeriod as ReviewPeriod,
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
        status: formData.status as ReviewStatus,
        dueDate: formData.dueDate,
        ratings: formData.ratings!,
        overallRating: calculateOverallRating(),
        strengths: formData.strengths!,
        areasForImprovement: formData.areasForImprovement!,
        achievements: formData.achievements!,
        comments: formData.comments!,
        createdAt: review?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: review?.createdBy || "current-user",
      };

      saveReview(reviewData);
      toast.success(review ? "Review updated successfully" : "Review created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const RatingInput = ({ label, value, onChange }: { label: string; value: number; onChange: (val: number) => void }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                rating <= value ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-muted-foreground ml-2">{value}/5</span>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{review ? "Edit Review" : "New Performance Review"}</DialogTitle>
          <DialogDescription>
            {review ? "Update the performance review" : "Create a new performance review for an employee"}
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
              <Label>Review Period *</Label>
              <Select value={formData.reviewPeriod} onValueChange={(val) => setFormData({ ...formData, reviewPeriod: val as ReviewPeriod })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Period Start *</Label>
              <Input
                type="date"
                value={formData.periodStart}
                onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
              />
            </div>
            <div>
              <Label>Period End *</Label>
              <Input
                type="date"
                value={formData.periodEnd}
                onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
              />
            </div>
            <div>
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as ReviewStatus })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Performance Ratings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <RatingInput
                label="Technical Skills"
                value={formData.ratings?.technicalSkills || 3}
                onChange={(val) => setFormData({ ...formData, ratings: { ...formData.ratings!, technicalSkills: val } })}
              />
              <RatingInput
                label="Communication"
                value={formData.ratings?.communication || 3}
                onChange={(val) => setFormData({ ...formData, ratings: { ...formData.ratings!, communication: val } })}
              />
              <RatingInput
                label="Teamwork"
                value={formData.ratings?.teamwork || 3}
                onChange={(val) => setFormData({ ...formData, ratings: { ...formData.ratings!, teamwork: val } })}
              />
              <RatingInput
                label="Initiative"
                value={formData.ratings?.initiative || 3}
                onChange={(val) => setFormData({ ...formData, ratings: { ...formData.ratings!, initiative: val } })}
              />
              <RatingInput
                label="Problem Solving"
                value={formData.ratings?.problemSolving || 3}
                onChange={(val) => setFormData({ ...formData, ratings: { ...formData.ratings!, problemSolving: val } })}
              />
              <RatingInput
                label="Reliability"
                value={formData.ratings?.reliability || 3}
                onChange={(val) => setFormData({ ...formData, ratings: { ...formData.ratings!, reliability: val } })}
              />
            </div>
          </div>

          <div>
            <Label>Strengths</Label>
            <Textarea
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              placeholder="Key strengths demonstrated during this period..."
              rows={3}
            />
          </div>

          <div>
            <Label>Areas for Improvement</Label>
            <Textarea
              value={formData.areasForImprovement}
              onChange={(e) => setFormData({ ...formData, areasForImprovement: e.target.value })}
              placeholder="Areas where employee can improve..."
              rows={3}
            />
          </div>

          <div>
            <Label>Key Achievements</Label>
            <Textarea
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              placeholder="Notable achievements and contributions..."
              rows={3}
            />
          </div>

          <div>
            <Label>Additional Comments</Label>
            <Textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Any additional comments or notes..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : review ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
