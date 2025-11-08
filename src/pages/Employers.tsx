import { useState, useMemo } from "react";
import { Plus, Download, Upload, Building, DollarSign, Briefcase, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { DataTable } from "@/components/tables/DataTable";
import { StatsCard } from "@/components/ui/stats-card";
import { EmployersFilterBar } from "@/components/employers/EmployersFilterBar";
import { createEmployerColumns } from "@/components/employers/EmployerTableColumns";
import { getEmployers } from "@/lib/employerService";
import { formatRevenue } from "@/lib/employerUtils";
import type { Employer } from "@/types/entities";
import type { SubscriptionTier } from "@/lib/subscriptionConfig";

export default function Employers() {
  const allEmployers = getEmployers();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<SubscriptionTier | 'all'>('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState<Employer['accountType'] | 'all'>('all');

  // Filter logic
  const filteredEmployers = useMemo(() => {
    return allEmployers.filter(employer => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          employer.name.toLowerCase().includes(searchLower) ||
          employer.industry.toLowerCase().includes(searchLower) ||
          employer.location.toLowerCase().includes(searchLower) ||
          employer.email?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Country filter
      if (countryFilter !== 'all') {
        const employerCountry = employer.locations?.[0]?.country || 'United States';
        if (employerCountry !== countryFilter) {
          return false;
        }
      }

      // Tier filter
      if (tierFilter !== 'all' && employer.subscriptionTier !== tierFilter) {
        return false;
      }

      // Account type filter
      if (accountTypeFilter !== 'all' && employer.accountType !== accountTypeFilter) {
        return false;
      }

      return true;
    });
  }, [allEmployers, searchTerm, countryFilter, tierFilter, accountTypeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeCount = allEmployers.filter(e => e.status === 'active').length;
    const totalRevenue = allEmployers.reduce((sum, e) => sum + (e.monthlySubscriptionFee || 0), 0);
    const pendingRenewals = allEmployers.filter(e => {
      if (!e.subscriptionEndDate) return false;
      const daysUntilRenewal = Math.floor(
        (new Date(e.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilRenewal <= 30 && daysUntilRenewal >= 0;
    }).length;

    return {
      total: allEmployers.length,
      active: activeCount,
      revenue: totalRevenue,
      pendingRenewals,
    };
  }, [allEmployers]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (countryFilter !== 'all') count++;
    if (tierFilter !== 'all') count++;
    if (accountTypeFilter !== 'all') count++;
    return count;
  }, [searchTerm, countryFilter, tierFilter, accountTypeFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCountryFilter('all');
    setTierFilter('all');
    setAccountTypeFilter('all');
  };

  const columns = createEmployerColumns();

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Employers</h1>
            <p className="text-muted-foreground">
              Manage employer relationships and accounts
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/employers/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Employer
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/employers">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Employers"
            value={stats.total}
            icon={Building}
            description={`${stats.active} active`}
          />
          <StatsCard
            title="Active Accounts"
            value={stats.active}
            icon={Briefcase}
            description={`${((stats.active / stats.total) * 100).toFixed(0)}% of total`}
          />
          <StatsCard
            title="Monthly Revenue"
            value={formatRevenue(stats.revenue)}
            icon={DollarSign}
            description="From subscriptions"
          />
          <StatsCard
            title="Pending Renewals"
            value={stats.pendingRenewals}
            icon={Clock}
            description="Due within 30 days"
          />
        </div>

        {/* Filters */}
        <EmployersFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          countryFilter={countryFilter}
          onCountryChange={setCountryFilter}
          tierFilter={tierFilter}
          onTierChange={setTierFilter}
          accountTypeFilter={accountTypeFilter}
          onAccountTypeChange={setAccountTypeFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredEmployers}
          selectable
        />
      </div>
    </DashboardPageLayout>
  );
}
