import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Printer } from "lucide-react";
import { type Invoice } from "@/lib/mockBillingStorage";

interface InvoiceDetailDialogProps {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
}

export function InvoiceDetailDialog({ invoice, open, onClose }: InvoiceDetailDialogProps) {
  const handleDownload = () => {
    console.log('Downloading invoice:', invoice.invoiceNumber);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>{invoice.invoiceNumber}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">HRM8 Platform</h2>
              <p className="text-sm text-muted-foreground">123 Business St</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA 94105</p>
            </div>
            <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
              {invoice.status.toUpperCase()}
            </Badge>
          </div>

          <Separator />

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Invoice Number</p>
              <p className="font-semibold">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
              <p className="font-semibold">{invoice.issueDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Due Date</p>
              <p className="font-semibold">{invoice.dueDate.toLocaleDateString()}</p>
            </div>
            {invoice.paidDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Paid Date</p>
                <p className="font-semibold">{invoice.paidDate.toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Line Items */}
          <div>
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-3">
              {invoice.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    {item.period && (
                      <p className="text-sm text-muted-foreground">Period: {item.period}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ${item.unitPrice}
                    </p>
                  </div>
                  <p className="font-semibold">${item.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${invoice.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="font-medium">${invoice.tax.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">${invoice.total.toLocaleString()}</span>
            </div>
          </div>

          {invoice.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
