import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Settings } from "lucide-react";
import { toast } from "sonner";

interface PaymentScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantId: string;
  onSuccess?: () => void;
}

export function PaymentScheduleDialog({
  open,
  onOpenChange,
  consultantId,
  onSuccess,
}: PaymentScheduleDialogProps) {
  const [frequency, setFrequency] = useState("monthly");
  const [paymentDay, setPaymentDay] = useState("15");
  const [minimumThreshold, setMinimumThreshold] = useState("1000");
  const [autoApproval, setAutoApproval] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would save to a database
      const schedule = {
        consultantId,
        frequency,
        paymentDay: parseInt(paymentDay),
        minimumThreshold: parseFloat(minimumThreshold),
        autoApproval,
        emailNotifications,
        updatedAt: new Date().toISOString(),
      };

      console.log("Payment schedule saved:", schedule);
      toast.success("Payment schedule configured successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to configure payment schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Payment Schedule Configuration
            </DialogTitle>
            <DialogDescription>
              Configure automatic payment schedule and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Payment Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Payment Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Day */}
            <div className="space-y-2">
              <Label htmlFor="payment-day">
                Payment Day
                {frequency === "weekly" && " (Day of Week)"}
                {(frequency === "monthly" || frequency === "quarterly") && " (Day of Month)"}
              </Label>
              {frequency === "weekly" ? (
                <Select value={paymentDay} onValueChange={setPaymentDay}>
                  <SelectTrigger id="payment-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                  </SelectContent>
                </Select>
              ) : frequency === "biweekly" ? (
                <Select value={paymentDay} onValueChange={setPaymentDay}>
                  <SelectTrigger id="payment-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st and 15th</SelectItem>
                    <SelectItem value="5">5th and 20th</SelectItem>
                    <SelectItem value="10">10th and 25th</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="payment-day"
                  type="number"
                  min="1"
                  max="31"
                  value={paymentDay}
                  onChange={(e) => setPaymentDay(e.target.value)}
                  placeholder="e.g., 15"
                />
              )}
              <p className="text-xs text-muted-foreground">
                {frequency === "weekly" && "The day of the week when payments are processed"}
                {frequency === "biweekly" && "Two payment dates per month"}
                {(frequency === "monthly" || frequency === "quarterly") &&
                  "The day of the month when payments are processed"}
              </p>
            </div>

            {/* Minimum Threshold */}
            <div className="space-y-2">
              <Label htmlFor="threshold">Minimum Payment Threshold</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">$</span>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  step="0.01"
                  value={minimumThreshold}
                  onChange={(e) => setMinimumThreshold(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only process payments if total pending exceeds this amount
              </p>
            </div>

            {/* Auto Approval */}
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="auto-approval" className="text-base">
                  Auto-approve Commissions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically approve and pay eligible commissions
                </p>
              </div>
              <Switch
                id="auto-approval"
                checked={autoApproval}
                onCheckedChange={setAutoApproval}
              />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Send email when payments are processed
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {/* Next Payment Preview */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4" />
                Next Scheduled Payment
              </div>
              <div className="text-sm text-muted-foreground">
                Based on your settings, the next payment will be processed on the{" "}
                {frequency === "weekly" ? (
                  <span className="font-medium">
                    next {["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][parseInt(paymentDay)]}
                  </span>
                ) : frequency === "biweekly" ? (
                  <span className="font-medium">1st or 15th of the month</span>
                ) : (
                  <span className="font-medium">{paymentDay}th of the month</span>
                )}
                {parseFloat(minimumThreshold) > 0 &&
                  ` if the total pending exceeds $${parseFloat(minimumThreshold).toLocaleString()}`}
                .
              </div>
            </div>
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
              {isSubmitting ? "Saving..." : "Save Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
