import { useState, useEffect } from "react";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { salesService, Commission } from "@/lib/sales/salesService";
import { useToast } from "@/hooks/use-toast";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export default function CommissionsPage() {
  const { toast } = useToast();
  const { formatCurrency } = useCurrencyFormat();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      setIsLoading(true);
      try {
        const response = await salesService.getCommissions();
        if (response.success && response.data) {
          // @ts-ignore - response structure check
          setCommissions(response.data.commissions || []);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch commissions", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommissions();
  }, [toast]);

  // Calculate stats
  const totalEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);

  const columns: ColumnDef<Commission>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span className="font-medium">{row.original.description || "Commission"}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.original.amount)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'PAID' ? 'success' : status === 'PENDING' ? 'warning' : 'secondary'}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: "paidAt",
      header: "Paid Date",
      cell: ({ row }) => row.original.paidAt ? new Date(row.original.paidAt).toLocaleDateString() : "-",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <AtsPageHeader title="Commission Management" subtitle="Track your earnings" />

      <div className="grid gap-4 md:grid-cols-3">
        <EnhancedStatCard
          title="Total Earnings"
          value={formatCurrency(totalEarned)}
          isCurrency={false}
          rawValue={totalEarned}
          change="Lifetime"
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
          variant="success"
          showMenu={false}
        />
        <EnhancedStatCard
          title="Pending Payout"
          value={formatCurrency(pendingAmount)}
          isCurrency={false}
          rawValue={pendingAmount}
          change="Awaiting payment"
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
          showMenu={false}
        />
        <EnhancedStatCard
          title="Paid"
          value={formatCurrency(paidAmount)}
          isCurrency={false}
          rawValue={paidAmount}
          change="Processed"
          icon={<CheckCircle2 className="h-6 w-6" />}
          variant="primary"
          showMenu={false}
        />
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-1">
        <DataTable
          columns={columns}
          data={commissions}
          searchable={true}
          searchColumn="description"
        />
      </div>
    </div>
  );
}
