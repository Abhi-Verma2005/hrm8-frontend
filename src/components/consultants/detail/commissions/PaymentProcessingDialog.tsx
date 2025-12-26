import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateCommission } from "@/lib/commissionStorage";
import type { Commission } from "@/types/commission";

interface PaymentProcessingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantId: string;
  pendingCommissions: Commission[];
  onSuccess?: () => void;
}

export function PaymentProcessingDialog({
  open,
  onOpenChange,
  consultantId,
  pendingCommissions,
  onSuccess,
}: PaymentProcessingDialogProps) {
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCommission = (id: string) => {
    setSelectedCommissions((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedCommissions(pendingCommissions.map((c) => c.id));
  };

  const deselectAll = () => {
    setSelectedCommissions([]);
  };

  const selectedTotal = pendingCommissions
    .filter((c) => selectedCommissions.includes(c.id))
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCommissions.length === 0) {
      toast.error("Please select at least one commission to process");
      return;
    }

    if (!paymentReference.trim()) {
      toast.error("Please enter a payment reference");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedCommissions = pendingCommissions
        .filter((c) => selectedCommissions.includes(c.id))
        .map((c) => ({
          ...c,
          status: "paid" as const,
          paymentDate: paymentDate.toISOString(),
          paymentMethod,
          paymentReference,
          notes,
          updatedAt: new Date().toISOString(),
        }));

      updatedCommissions.forEach((c) => {
        updateCommission(c.id, {
          status: "paid",
          paymentDate: c.paymentDate,
          paymentMethod: c.paymentMethod as "bank-transfer" | "check" | "payroll" | "other",
          paymentReference: c.paymentReference,
          notes: c.notes,
        });
      });

      toast.success(`${updatedCommissions.length} commission(s) marked as paid`);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Process Commission Payment</DialogTitle>
            <DialogDescription>
              Select commissions to include in this payment and enter payment details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Commission Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Commissions</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
                    Select All
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={deselectAll}>
                    Clear
                  </Button>
                </div>
              </div>

              <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-lg p-3">
                {pendingCommissions.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    No pending commissions
                  </div>
                ) : (
                  pendingCommissions.map((commission) => (
                    <div
                      key={commission.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedCommissions.includes(commission.id)
                          ? "bg-primary/5 border-primary"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => toggleCommission(commission.id)}
                    >
                      <Checkbox
                        checked={selectedCommissions.includes(commission.id)}
                        onCheckedChange={() => toggleCommission(commission.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{commission.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(commission.earnedDate), "MMM d, yyyy")} • {commission.status}
                        </p>
                      </div>
                      <span className="font-semibold text-sm whitespace-nowrap">
                        ${commission.commissionAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {selectedCommissions.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <span className="font-semibold">Total Selected:</span>
                  <span className="text-xl font-bold text-primary">
                    ${selectedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Payment Details */}
            <div className="space-y-4">
              <h4 className="font-semibold">Payment Details</h4>

              <div className="space-y-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="payment-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !paymentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {paymentDate ? format(paymentDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={(date) => date && setPaymentDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="payroll">Payroll Integration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-reference">Payment Reference *</Label>
                <Input
                  id="payment-reference"
                  placeholder="e.g., PMT-2025-001"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  required
                />
              </div>

              {paymentMethod === "bank-transfer" && (
                <div className="p-3 border rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-1">Bank Details</p>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>Account: **** **** 1234</p>
                    <p>Routing: 021000021</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this payment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 border rounded-lg bg-muted/30 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <CheckCircle2 className="h-4 w-4" />
                Payment Summary
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commissions:</span>
                  <span className="font-medium">{selectedCommissions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold">
                    ${selectedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date:</span>
                  <span className="font-medium">{format(paymentDate, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-medium capitalize">
                    {paymentMethod.replace("-", " ")}
                  </span>
                </div>
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
            <Button type="submit" disabled={isSubmitting || selectedCommissions.length === 0}>
              {isSubmitting ? "Processing..." : "Process Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
