import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/types/expense";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpenseDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
}

export function ExpenseDetailDialog({ open, onOpenChange, expense }: ExpenseDetailDialogProps) {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Expense Details</DialogTitle>
          <DialogDescription>
            Complete expense claim information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Employee</p>
            <p className="font-medium">{expense.employeeName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-bold text-lg">{expense.currency} {expense.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline" className="capitalize mt-1">
                {expense.category}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{format(new Date(expense.date), 'MMMM dd, yyyy')}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Merchant</p>
            <p className="font-medium">{expense.merchant}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm">{expense.description}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              variant={
                expense.status === 'approved' ? 'default' :
                expense.status === 'rejected' ? 'destructive' :
                expense.status === 'reimbursed' ? 'secondary' : 'outline'
              }
              className="mt-1"
            >
              {expense.status}
            </Badge>
          </div>

          {expense.receiptUrl && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Receipt</p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          )}

          {expense.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm">{expense.notes}</p>
            </div>
          )}

          {expense.submittedAt && (
            <div>
              <p className="text-sm text-muted-foreground">Submitted At</p>
              <p className="text-sm">{format(new Date(expense.submittedAt), 'MMM dd, yyyy HH:mm')}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
