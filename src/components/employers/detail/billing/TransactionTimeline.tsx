import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { mockTransactions } from "@/data/mockBillingData";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";

interface TransactionTimelineProps {
  employerId: string;
}

export function TransactionTimeline({ employerId }: TransactionTimelineProps) {
  const { formatCurrency } = useCurrencyFormat();
  const transactions = mockTransactions.slice(0, 8); // Show recent 8 transactions

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Activity Timeline
        </CardTitle>
        <CardDescription>Recent billing activity and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
          
          {transactions.map((transaction, index) => (
            <div key={transaction.id} className="relative flex gap-4 pl-8">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background">
                {getStatusIcon(transaction.status)}
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {transaction.description}
                  </p>
                  <p className={`text-sm font-semibold tabular-nums ${
                    transaction.type === 'refund' || (transaction.type === 'adjustment' && transaction.amount < 0)
                      ? 'text-destructive'
                      : 'text-foreground'
                  }`}>
                    {transaction.type === 'refund' || (transaction.type === 'adjustment' && transaction.amount < 0)
                      ? `-${formatCurrency(Math.abs(transaction.amount))}`
                      : formatCurrency(transaction.amount)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{format(transaction.date, 'MMM d, yyyy • h:mm a')}</span>
                  {transaction.paymentMethod && (
                    <>
                      <span>•</span>
                      <span>{transaction.paymentMethod}</span>
                    </>
                  )}
                </div>
                
                {transaction.invoiceId && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {transaction.invoiceId}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
