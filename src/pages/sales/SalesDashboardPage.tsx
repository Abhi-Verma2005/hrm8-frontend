import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { DataTable } from "@/components/tables/DataTable";
import { TrendingUp, DollarSign, Target, Users, Award, Eye, Plus, BarChart3, Building2 } from "lucide-react";
import { salesService, SalesDashboardStats } from "@/lib/sales/salesService";
import { useToast } from "@/hooks/use-toast";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";
import { SalesDashboardSkeleton } from "@/components/sales/SalesDashboardSkeleton";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export default function SalesDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatCurrency } = useCurrencyFormat();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SalesDashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await salesService.getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          toast({
            title: "Error fetching dashboard",
            description: response.error || "Could not load stats",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  // Activity Columns
  const activityColumns: ColumnDef<any>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span className="font-medium">{row.original.description}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.type === 'COMMISSION' ? 'success' : 'default'}>
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => row.original.amount ? formatCurrency(row.original.amount) : '-',
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <SalesDashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AtsPageHeader
        title="Sales Dashboard"
        subtitle="Monitor sales performance and commissions"
      />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatCard
          title="Total Revenue"
          value={stats ? Math.round(stats.commissions.total).toString() : "0"}
          isCurrency={true}
          rawValue={stats?.commissions.total || 0}
          change={`${stats?.commissions.pending || 0} pending`}
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
          variant="success"
          showMenu={false}
        />
        
        <EnhancedStatCard
          title="Active Leads"
          value={stats ? stats.leads.total.toString() : "0"}
          change={`${stats?.leads.converted || 0} converted`}
          trend="up"
          icon={<Users className="h-5 w-5" />}
          variant="primary"
          showMenu={true}
          menuItems={[
            {
              label: "View Leads",
              icon: <Eye className="h-4 w-4" />,
              onClick: () => navigate('/sales-agent/leads')
            },
            {
              label: "Add Lead",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => navigate('/sales-agent/leads?action=new')
            }
          ]}
        />

        <EnhancedStatCard
          title="Active Companies"
          value={stats ? stats.companies.total.toString() : "0"}
          change={`${stats?.companies.activeSubscriptions || 0} subscribed`}
          trend="up"
          icon={<Building2 className="h-5 w-5" />}
          variant="neutral"
          showMenu={true}
          menuItems={[
            {
              label: "View All Clients",
              icon: <Eye className="h-4 w-4" />,
              onClick: () => navigate('/sales-agent/companies')
            }
          ]}
        />

        <EnhancedStatCard
          title="Conversion Rate"
          value={stats ? `${stats.leads.conversionRate}%` : "0%"}
          change="Lead to Company"
          trend={stats && stats.leads.conversionRate > 20 ? "up" : "neutral"}
          icon={<Target className="h-5 w-5" />}
          variant="warning"
          showMenu={false}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-1">
        <StandardChartCard
          title="Recent Activity"
          menuItems={[
            { label: "View All", onClick: () => {} }
          ]}
        >
          <div className="overflow-x-auto -mx-1 px-1">
            <DataTable
              columns={activityColumns}
              data={stats?.recentActivity || []}
              searchable={false}
            />
          </div>
        </StandardChartCard>
      </div>
    </div>
  );
}
