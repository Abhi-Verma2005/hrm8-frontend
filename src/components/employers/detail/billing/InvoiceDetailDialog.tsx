import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Invoice } from "@/types/billing";
import { Download, Send, FileText } from "lucide-react";
import { format } from "date-fns";

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoiceDetailDialog({ open, onOpenChange, invoice }: InvoiceDetailDialogProps) {
  if (!invoice) return null;

  const getStatusBadge = (status: Invoice['status']) => {
    const variants = {
      paid: { variant: "default" as const, className: "bg-green-500/10 text-green-700 dark:text-green-400", label: "Paid" },
      pending: { variant: "secondary" as const, className: "", label: "Pending" },
      overdue: { variant: "destructive" as const, className: "", label: "Overdue" },
      draft: { variant: "outline" as const, className: "", label: "Draft" },
      cancelled: { variant: "outline" as const, className: "text-muted-foreground", label: "Cancelled" }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Details
              </DialogTitle>
              <DialogDescription>{invoice.invoiceNumber}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {invoice.status === 'draft' && (
                <Button size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg mb-1">{invoice.employerName}</h3>
              <p className="text-sm text-muted-foreground">Invoice to employer</p>
            </div>
            <div className="text-right">
              {getStatusBadge(invoice.status)}
              <p className="text-sm text-muted-foreground mt-2">
                Issue Date: {format(invoice.issueDate, 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                Due Date: {format(invoice.dueDate, 'MMM d, yyyy')}
              </p>
              {invoice.paidDate && (
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                  Paid: {format(invoice.paidDate, 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Line Items */}
          <div>
            <h4 className="font-semibold mb-3">Items</h4>
            <div className="space-y-2">
              {invoice.lineItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    {item.metadata && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Object.entries(item.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                    <p className="font-semibold tabular-nums">
                      ${item.total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="font-medium tabular-nums">${invoice.tax.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg tabular-nums">${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Payment Info */}
          {invoice.paymentMethod && (
            <>
              <Separator />
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Payment Method</p>
                <p className="font-medium capitalize">{invoice.paymentMethod.replace('_', ' ')}</p>
              </div>
            </>
          )}

          {/* Notes */}
          {invoice.notes && (
            <>
              <Separator />
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
