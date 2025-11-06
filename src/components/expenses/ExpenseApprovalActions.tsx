import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { updateExpense } from "@/lib/expenseStorage";
import { useToast } from "@/hooks/use-toast";

interface ExpenseApprovalActionsProps {
  expenseId: string;
  onUpdate: () => void;
}

export function ExpenseApprovalActions({ expenseId, onUpdate }: ExpenseApprovalActionsProps) {
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      updateExpense(expenseId, {
        status: 'approved',
        currentApprovalLevel: 1,
      });

      toast({
        title: "Expense Approved",
        description: "The expense claim has been approved",
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve expense",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    try {
      updateExpense(expenseId, {
        status: 'rejected',
        currentApprovalLevel: 1,
      });

      toast({
        title: "Expense Rejected",
        description: "The expense claim has been rejected",
        variant: "destructive",
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject expense",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="default" onClick={handleApprove}>
        <Check className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button size="sm" variant="destructive" onClick={handleReject}>
        <X className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
}
