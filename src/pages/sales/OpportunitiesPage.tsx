import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/tables/DataTable";
import { Plus, Target, DollarSign, TrendingUp, Award } from "lucide-react";
import { getAllOpportunities, getOpportunityStats } from "@/lib/salesOpportunityStorage";
import type { SalesOpportunity } from "@/types/salesOpportunity";
import { format } from "date-fns";
import { StatsCard } from "@/components/ui/stats-card";

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const [opportunities] = useState<SalesOpportunity[]>(getAllOpportunities());
  const stats = getOpportunityStats();

  const columns: Column<SalesOpportunity>[] = [
    {
      key: "name",
      label: "Opportunity",
    },
    {
      key: "employerName",
      label: "Employer",
    },
    {
      key: "salesAgentName",
      label: "Sales Agent",
    },
    {
      key: "type",
      label: "Type",
      render: (opp) => opp.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    },
    {
      key: "stage",
      label: "Stage",
      render: (opp) => {
        const colors: Record<string, string> = {
          prospecting: "bg-blue-100 text-blue-800",
          qualification: "bg-purple-100 text-purple-800",
          proposal: "bg-yellow-100 text-yellow-800",
          negotiation: "bg-orange-100 text-orange-800",
          "closed-won": "bg-green-100 text-green-800",
          "closed-lost": "bg-red-100 text-red-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[opp.stage]}`}>
            {opp.stage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        );
      },
    },
    {
      key: "estimatedValue",
      label: "Value",
      render: (opp) => `$${(opp.estimatedValue / 1000).toFixed(0)}K`,
    },
    {
      key: "probability",
      label: "Probability",
      render: (opp) => `${opp.probability}%`,
    },
    {
      key: "expectedCloseDate",
      label: "Expected Close",
      render: (opp) => format(new Date(opp.expectedCloseDate), 'MMM dd, yyyy'),
    },
  ];

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground mt-2">Manage and track all sales opportunities</p>
          </div>
          <Button onClick={() => navigate("/sales/opportunities/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Opportunity
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Opportunities"
            value={stats.total}
            icon={Target}
            description={`${stats.active} open`}
          />
          <StatsCard
            title="Open Value"
            value={`$${(stats.pipelineValue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            description="Pipeline value"
          />
          <StatsCard
            title="Avg Deal Size"
            value={`$${(stats.avgDealSize / 1000).toFixed(0)}K`}
            icon={TrendingUp}
            description="Per opportunity"
          />
          <StatsCard
            title="Win Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={Award}
            description="Conversion rate"
          />
        </div>

        <DataTable
          columns={columns}
          data={opportunities}
          searchable
          searchKeys={["name", "employerName"]}
          exportable
          exportFilename="opportunities"
        />
      </div>
    </DashboardPageLayout>
  );
}
