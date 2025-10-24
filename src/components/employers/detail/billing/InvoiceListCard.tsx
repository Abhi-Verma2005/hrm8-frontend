import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types/billing";
import { FileText, Eye, Send, Download } from "lucide-react";
import { format } from "date-fns";
import { mockInvoices } from "@/data/mockBillingData";

interface InvoiceListCardProps {
  employerId: string;
  onViewInvoice: (invoice: Invoice) => void;
  onSendInvoice: (invoice: Invoice) => void;
}

export function InvoiceListCard({ employerId, onViewInvoice, onSendInvoice }: InvoiceListCardProps) {
  const invoices = mockInvoices.filter(inv => inv.employerId === employerId);

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Invoices
            </CardTitle>
            <CardDescription>View and manage invoices</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No invoices yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Issued {format(invoice.issueDate, 'MMM d, yyyy')} • Due {format(invoice.dueDate, 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {invoice.lineItems.length} item{invoice.lineItems.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <p className="font-bold text-sm tabular-nums">
                      ${invoice.total.toFixed(2)}
                    </p>
                    {invoice.status === 'paid' && invoice.paidDate && (
                      <p className="text-xs text-muted-foreground">
                        Paid {format(invoice.paidDate, 'MMM d')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewInvoice(invoice)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {invoice.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onSendInvoice(invoice)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
