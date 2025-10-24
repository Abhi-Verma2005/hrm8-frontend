import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";
import { mockTransactions, Transaction } from "@/data/mockBillingData";

interface PaymentHistoryTableProps {
  employerId: string;
}

export function PaymentHistoryTable({ employerId }: PaymentHistoryTableProps) {
  // In a real app, this would filter by employerId
  const transactions = mockTransactions;

  const getTypeLabel = (type: Transaction['type']) => {
    const labels = {
      payment: 'Payment',
      refund: 'Refund',
      adjustment: 'Adjustment',
      subscription: 'Subscription',
      service_fee: 'Service Fee'
    };
    return labels[type];
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      completed: { variant: "default" as const, className: "bg-green-500/10 text-green-700 dark:text-green-400", label: "Completed" },
      pending: { variant: "secondary" as const, className: "", label: "Pending" },
      failed: { variant: "destructive" as const, className: "", label: "Failed" }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment History
        </CardTitle>
        <CardDescription>Complete transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {format(transaction.date, 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(transaction.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {transaction.paymentMethod || '—'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {transaction.type === 'refund' || transaction.type === 'adjustment' && transaction.amount < 0
                    ? `-$${Math.abs(transaction.amount).toFixed(2)}`
                    : `$${transaction.amount.toFixed(2)}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
