import { Badge } from "@/components/ui/badge";

interface TransactionItemProps {
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
}

export function TransactionItem({ date, description, amount, status }: TransactionItemProps) {
  const statusVariants = {
    paid: 'success' as const,
    pending: 'warning' as const,
    overdue: 'destructive' as const,
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium">{description}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={statusVariants[status]} className="capitalize">
          {status}
        </Badge>
        <p className="text-sm font-semibold min-w-[60px] text-right">{amount}</p>
      </div>
    </div>
  );
}
