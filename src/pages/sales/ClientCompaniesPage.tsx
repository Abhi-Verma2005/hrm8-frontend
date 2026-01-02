import { useState, useEffect } from "react";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { DataTable, Column } from "@/components/tables/DataTable";
import { Building2, CheckCircle2, DollarSign } from "lucide-react";
import { salesService } from "@/lib/sales/salesService";
import { useToast } from "@/hooks/use-toast";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";
import { Badge } from "@/components/ui/badge";

interface Company {
  id: string;
  name: string;
  domain: string;
  email: string;
  createdAt: string;
  attributionStatus: 'OPEN' | 'LOCKED' | 'EXPIRED';
  subscription: {
    plan: string;
    startDate: string;
    renewalDate: string;
  } | null;
}

export default function ClientCompaniesPage() {
  const { toast } = useToast();
  const { formatCurrency } = useCurrencyFormat();
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await salesService.getCompanies();
      if (response.success && response.data?.companies) {
        setCompanies(response.data.companies);
      } else {
        toast({
          title: "Error fetching companies",
          description: response.error || "Could not load companies",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from companies data
  const totalCompanies = companies.length;
  const activeSubscriptions = companies.filter(c => c.subscription !== null).length;
  const lockedAttributions = companies.filter(c => c.attributionStatus === 'LOCKED').length;

  // Company Columns
  const companyColumns: Column<Company>[] = [
    {
      key: "name",
      label: "Company Name",
      sortable: true,
      render: (company) => <span className="font-medium">{company.name}</span>,
    },
    {
      key: "domain",
      label: "Domain",
      sortable: true,
      render: (company) => (
        <a
          href={`https://${company.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {company.domain}
        </a>
      ),
    },
    {
      key: "attributionStatus",
      label: "Attribution",
      sortable: true,
      render: (company) => {
        const status = company.attributionStatus;
        const variantMap = {
          OPEN: 'neutral',
          LOCKED: 'success',
          EXPIRED: 'destructive'
        };
        return (
          <Badge variant={variantMap[status] as any}>
            {status}
          </Badge>
        );
      },
    },
    {
      key: "subscription",
      label: "Subscription",
      render: (company) => {
        const sub = company.subscription;
        if (!sub) {
          return <Badge variant="outline">No Subscription</Badge>;
        }
        return <Badge variant="success">{sub.plan}</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Created Date",
      sortable: true,
      render: (company) => new Date(company.createdAt).toLocaleDateString(),
    },
    {
      key: "subscriptionStartDate",
      label: "Subscription Start",
      render: (company) => {
        const sub = company.subscription;
        return sub ? new Date(sub.startDate).toLocaleDateString() : '-';
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <AtsPageHeader title="My Clients" subtitle="Companies attributed to you" />
        <div className="text-center py-8">Loading companies...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AtsPageHeader
        title="My Clients"
        subtitle="Manage and track your attributed companies"
      />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EnhancedStatCard
          title="Total Companies"
          value={totalCompanies.toString()}
          change={`${lockedAttributions} locked`}
          trend="up"
          icon={<Building2 className="h-5 w-5" />}
          variant="neutral"
          showMenu={false}
        />

        <EnhancedStatCard
          title="Active Subscriptions"
          value={activeSubscriptions.toString()}
          change={`${totalCompanies - activeSubscriptions} inactive`}
          trend={activeSubscriptions > 0 ? "up" : "neutral"}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="success"
          showMenu={false}
        />

        <EnhancedStatCard
          title="Attributed"
          value={lockedAttributions.toString()}
          change="Locked attributions"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
          variant="primary"
          showMenu={false}
        />
      </div>

      {/* Companies Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Companies List</h3>
          <DataTable
            columns={companyColumns}
            data={companies}
            searchable={true}
            searchKeys={['name', 'domain', 'email']}
            emptyMessage="No companies found"
          />
        </div>
      </div>
    </div>
  );
}
