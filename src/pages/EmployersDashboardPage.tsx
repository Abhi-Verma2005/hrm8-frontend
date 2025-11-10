import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { DashboardActionBar } from "@/components/dashboard/DashboardActionBar";
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { 
  Building2, Briefcase, DollarSign, TrendingUp, Download, Eye, Filter, 
  BarChart3, Users, Target, Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

const clientDistribution = [
  { industry: 'Technology', count: 28, color: '#3b82f6' },
  { industry: 'Finance', count: 22, color: '#10b981' },
  { industry: 'Healthcare', count: 18, color: '#f59e0b' },
  { industry: 'Retail', count: 15, color: '#8b5cf6' },
  { industry: 'Manufacturing', count: 12, color: '#ec4899' },
  { industry: 'Other', count: 10, color: '#6b7280' },
];

const revenueExpenses = [
  { month: 'Jan', revenue: 245000, expenses: 182000, profit: 63000 },
  { month: 'Feb', revenue: 268000, expenses: 195000, profit: 73000 },
  { month: 'Mar', revenue: 289000, expenses: 201000, profit: 88000 },
  { month: 'Apr', revenue: 312000, expenses: 215000, profit: 97000 },
  { month: 'May', revenue: 334000, expenses: 228000, profit: 106000 },
  { month: 'Jun', revenue: 356000, expenses: 235000, profit: 121000 },
];

const budgetAnalysis = [
  { category: 'Recruitment', budget: 120000, spent: 115000 },
  { category: 'Marketing', budget: 45000, spent: 42000 },
  { category: 'Operations', budget: 38000, spent: 35000 },
  { category: 'Technology', budget: 28000, spent: 31000 },
  { category: 'Training', budget: 15000, spent: 12000 },
];

const clientActivity = [
  { month: 'Jan', newClients: 8, activeProjects: 45, completedProjects: 12 },
  { month: 'Feb', newClients: 10, activeProjects: 48, completedProjects: 14 },
  { month: 'Mar', newClients: 12, activeProjects: 52, completedProjects: 15 },
  { month: 'Apr', newClients: 9, activeProjects: 55, completedProjects: 16 },
  { month: 'May', newClients: 11, activeProjects: 58, completedProjects: 18 },
  { month: 'Jun', newClients: 13, activeProjects: 61, completedProjects: 19 },
];

export default function EmployersDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const hasActiveFilters = !!(dateRange?.from) || selectedCountry !== "all" || selectedRegion !== "all";

  const handleExport = () => {
    toast({ title: "Exporting employers data..." });
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedCountry("all");
    setSelectedRegion("all");
    toast({ title: "Filters reset" });
  };

  return (
    <DashboardPageLayout
      dashboardActions={<EditModeToggle isEditMode={isEditMode} onToggle={() => setIsEditMode(!isEditMode)} />}
    >
      <div className="min-h-screen bg-background">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Employers Dashboard</h1>
              <p className="text-muted-foreground">
                Client relationships, projects, and financial performance
              </p>
            </div>
            
            {!isEditMode && (
              <DashboardActionBar
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                selectedCountry={selectedCountry}
                selectedRegion={selectedRegion}
                onCountryChange={setSelectedCountry}
                onRegionChange={setSelectedRegion}
                onExport={handleExport}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EnhancedStatCard
              title="Total Clients"
              value="105"
              change="+13 this quarter"
              trend="up"
              icon={<Building2 className="h-6 w-6" />}
              variant="primary"
              showMenu={true}
              menuItems={[
                { label: "View All", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/employers') },
                { label: "Add Client", icon: <Building2 className="h-4 w-4" />, onClick: () => navigate('/employers?action=create') },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Active Projects"
              value="61"
              change="+12.5%"
              trend="up"
              icon={<Briefcase className="h-6 w-6" />}
              variant="success"
              showMenu={true}
              menuItems={[
                { label: "View Projects", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/recruitment-services') },
                { label: "Pipeline", icon: <Target className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Total Revenue"
              value=""
              isCurrency={true}
              rawValue={356000}
              change="+18.2%"
              trend="up"
              icon={<DollarSign className="h-6 w-6" />}
              variant="success"
              showMenu={true}
              menuItems={[
                { label: "View Breakdown", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Forecast", icon: <TrendingUp className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Profit Margin"
              value="34.0%"
              change="+2.8%"
              trend="up"
              icon={<TrendingUp className="h-6 w-6" />}
              variant="primary"
              showMenu={true}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <StandardChartCard
              title="Client Distribution"
              description="By industry sector"
              onDownload={() => toast({ title: "Downloading client distribution..." })}
              menuItems={[
                { label: "View All", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/employers') },
                { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clientDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ industry, count }) => `${industry}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {clientDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Revenue vs Expenses"
              description={`Monthly financial comparison${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading financial data..." })}
              menuItems={[
                { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Budget Analysis"
              description={`Budget vs actual spending${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading budget analysis..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Adjust Budget", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetAnalysis} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                  <Bar dataKey="spent" fill="#8b5cf6" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Client Activity"
              description={`New clients and project trends${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading activity data..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clientActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newClients" stroke="#3b82f6" strokeWidth={2} name="New Clients" />
                  <Line type="monotone" dataKey="activeProjects" stroke="#10b981" strokeWidth={2} name="Active Projects" />
                  <Line type="monotone" dataKey="completedProjects" stroke="#8b5cf6" strokeWidth={2} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            </StandardChartCard>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
