import { Employer } from "@/types/entities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { TransactionItem } from "./shared/TransactionItem";
import { useNavigate } from "react-router-dom";

interface EmployerMetrics {
  lifetimeValue: number;
  monthlyRevenue: number;
}

interface EmployerFinancialCardProps {
  employer: Employer;
  metrics: EmployerMetrics;
}

export function EmployerFinancialCard({ employer, metrics }: EmployerFinancialCardProps) {
  const navigate = useNavigate();

  // Mock recent transactions - in real app, fetch from billing service
  const recentTransactions = [
    { date: 'Dec 15, 2024', description: 'Subscription payment', amount: '$199', status: 'paid' as const },
    { date: 'Nov 15, 2024', description: 'Job posting fee', amount: '$299', status: 'paid' as const },
    { date: 'Oct 15, 2024', description: 'Subscription payment', amount: '$199', status: 'paid' as const },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <CardTitle>Financial Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
            <p className="text-sm text-muted-foreground mb-1">Lifetime Value</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${metrics.lifetimeValue.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ${metrics.monthlyRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Outstanding Balance (if applicable) */}
        {employer.accountType === 'approved' && employer.outstandingBalance !== undefined && employer.outstandingBalance > 0 && (
          <>
            <Separator />
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Outstanding Balance</p>
                  <p className="text-xs text-muted-foreground">
                    Credit Limit: ${employer.creditLimit?.toLocaleString() || 0}
                  </p>
                </div>
                <p className="text-xl font-bold text-destructive">
                  ${employer.outstandingBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </>
        )}
        
        <Separator />
        
        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Recent Activity</h4>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0"
              onClick={() => navigate(`/employers/${employer.id}?tab=billing`)}
            >
              View All →
            </Button>
          </div>
          
          <div className="space-y-2">
            {recentTransactions.map((transaction, index) => (
              <TransactionItem key={index} {...transaction} />
            ))}
          </div>
        </div>
        
        {/* Action */}
        <Button 
          variant="outline" 
          className="w-full" 
          size="sm"
          onClick={() => navigate(`/employers/${employer.id}?tab=billing`)}
        >
          Go to Billing →
        </Button>
      </CardContent>
    </Card>
  );
}
