import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Plus } from "lucide-react";
import { getAllOpportunities } from "@/lib/salesOpportunityStorage";
import type { SalesOpportunity } from "@/types/salesOpportunity";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const [opportunities] = useState<SalesOpportunity[]>(getAllOpportunities());

  const columns: ColumnDef<SalesOpportunity>[] = [
    {
      accessorKey: "name",
      header: "Opportunity",
    },
    {
      accessorKey: "employerName",
      header: "Employer",
    },
    {
      accessorKey: "salesAgentName",
      header: "Sales Agent",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      },
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ getValue }) => {
        const stage = getValue() as string;
        const colors: Record<string, string> = {
          prospecting: "bg-blue-100 text-blue-800",
          qualification: "bg-purple-100 text-purple-800",
          proposal: "bg-yellow-100 text-yellow-800",
          negotiation: "bg-orange-100 text-orange-800",
          "closed-won": "bg-green-100 text-green-800",
          "closed-lost": "bg-red-100 text-red-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[stage]}`}>
            {stage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        );
      },
    },
    {
      accessorKey: "estimatedValue",
      header: "Value",
      cell: ({ getValue }) => `$${(getValue() as number / 1000).toFixed(0)}K`,
    },
    {
      accessorKey: "probability",
      header: "Probability",
      cell: ({ getValue }) => `${getValue()}%`,
    },
    {
      accessorKey: "expectedCloseDate",
      header: "Expected Close",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return format(new Date(date), 'MMM dd, yyyy');
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="Opportunities"
      subtitle="Manage and track all sales opportunities"
      actions={
        <Button onClick={() => navigate("/sales/opportunities/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Opportunity
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={opportunities}
        searchKey="name"
        searchPlaceholder="Search opportunities..."
      />
    </DashboardPageLayout>
  );
}
