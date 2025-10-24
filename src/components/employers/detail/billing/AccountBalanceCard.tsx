import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { mockInvoices } from "@/data/mockBillingData";

interface AccountBalanceCardProps {
  employerId: string;
  onGenerateInvoice: () => void;
}

export function AccountBalanceCard({ employerId, onGenerateInvoice }: AccountBalanceCardProps) {
  // Calculate balances from mock invoices
  const employerInvoices = mockInvoices.filter(inv => inv.employerId === employerId);
  const unpaidInvoices = employerInvoices.filter(inv => inv.status === 'pending' || inv.status === 'sent' || inv.status === 'overdue');
  const overdueInvoices = employerInvoices.filter(inv => inv.status === 'overdue');
  
  const currentBalance = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const overdueBalance = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const lifetimeSpend = employerInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const hasOverdue = overdueBalance > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Account Balance
            </CardTitle>
            <CardDescription>Outstanding payments and account summary</CardDescription>
          </div>
          <Button onClick={onGenerateInvoice} variant="outline" size="sm">
            Generate Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert for overdue */}
        {hasOverdue && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Overdue Balance</p>
              <p className="text-sm text-muted-foreground">
                {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? 's' : ''} past due
              </p>
            </div>
            <p className="text-lg font-bold text-destructive tabular-nums">
              ${overdueBalance.toFixed(2)}
            </p>
          </div>
        )}

        {/* Balance Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Balance */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold tabular-nums">
              ${currentBalance.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Overdue */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <p className={`text-2xl font-bold tabular-nums ${hasOverdue ? 'text-destructive' : ''}`}>
              ${overdueBalance.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {overdueInvoices.length} overdue invoice{overdueInvoices.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Lifetime Spend */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Lifetime Spend</p>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold tabular-nums">
              ${lifetimeSpend.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              All-time payments
            </p>
          </div>
        </div>

        {/* Account Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-xs text-muted-foreground">Payment history and standing</p>
            </div>
            <Badge variant={hasOverdue ? "destructive" : "default"} className={hasOverdue ? "" : "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20"}>
              {hasOverdue ? "Action Required" : "Good Standing"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
