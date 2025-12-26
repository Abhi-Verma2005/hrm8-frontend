import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { DashboardActionBar } from "@/components/dashboard/DashboardActionBar";
import { ActiveFiltersIndicator } from "@/components/dashboard/ActiveFiltersIndicator";
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import {
  Briefcase, Users, TrendingUp, Clock, Download, Eye, Filter as FilterIcon,
  BarChart3, DollarSign, Target, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { DashboardFilterDialog } from "@/components/dashboard/DashboardFilterDialog";
import { filterByDateRange } from "@/lib/dashboardFilterUtils";
import { applyLocationFilterToMetric, applyLocationFilterToTimeSeries } from "@/lib/mockDataWithLocations";

const projectPipeline = [
  { status: 'Discovery', count: 8 },
  { status: 'Proposal', count: 12 },
  { status: 'Active', count: 32 },
  { status: 'Delivery', count: 18 },
  { status: 'Completed', count: 45 },
];

const clientDistribution = [
  { industry: 'Technology', count: 28, color: '#3b82f6' },
  { industry: 'Finance', count: 22, color: '#10b981' },
  { industry: 'Healthcare', count: 18, color: '#f59e0b' },
  { industry: 'Retail', count: 15, color: '#8b5cf6' },
  { industry: 'Manufacturing', count: 12, color: '#ec4899' },
  { industry: 'Other', count: 10, color: '#6b7280' },
];

const resourceAllocation = [
  { consultant: 'Sarah Chen', allocated: 85, available: 15 },
  { consultant: 'Mike Johnson', allocated: 92, available: 8 },
  { consultant: 'Emily Davis', allocated: 78, available: 22 },
  { consultant: 'David Lee', allocated: 88, available: 12 },
  { consultant: 'Ana Martinez', allocated: 75, available: 25 },
];

const revenueForecast = [
  { month: 'Jan', actual: 245000, forecast: 240000 },
  { month: 'Feb', actual: 268000, forecast: 260000 },
  { month: 'Mar', actual: 289000, forecast: 285000 },
  { month: 'Apr', actual: 312000, forecast: 305000 },
  { month: 'May', actual: 334000, forecast: 330000 },
  { month: 'Jun', actual: 356000, forecast: 350000 },
];

export default function ConsultingDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const hasActiveFilters = !!(dateRange?.from) || selectedCountry !== "all" || selectedRegion !== "all";

  // Apply location filters to metrics
  const filteredActiveProjects = useMemo(() =>
    applyLocationFilterToMetric(32, selectedCountry, selectedRegion),
    [selectedCountry, selectedRegion]
  );

  const filteredTotalClients = useMemo(() =>
    applyLocationFilterToMetric(105, selectedCountry, selectedRegion),
    [selectedCountry, selectedRegion]
  );

  const filteredBillableHours = useMemo(() =>
    applyLocationFilterToMetric(8234, selectedCountry, selectedRegion),
    [selectedCountry, selectedRegion]
  );

  // Apply location filters to chart data
  const filteredProjectPipeline = useMemo(() => {
    return applyLocationFilterToTimeSeries(
      projectPipeline,
      selectedCountry,
      selectedRegion,
      ['count']
    );
  }, [selectedCountry, selectedRegion]);

  const filteredResourceAllocation = useMemo(() => {
    return applyLocationFilterToTimeSeries(
      resourceAllocation,
      selectedCountry,
      selectedRegion,
      ['allocated', 'available']
    );
  }, [selectedCountry, selectedRegion]);

  const filteredRevenueForecast = useMemo(() => {
    const locationFiltered = applyLocationFilterToTimeSeries(
      revenueForecast,
      selectedCountry,
      selectedRegion,
      ['actual', 'forecast']
    );
    return filterByDateRange(locationFiltered, dateRange, 'month');
  }, [selectedCountry, selectedRegion, dateRange]);

  const handleExport = () => {
    toast({ title: "Exporting consulting data..." });
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedCountry("all");
    setSelectedRegion("all");
    toast({ title: "Filters reset" });
  };

  return (
    <DashboardPageLayout
      title="Consulting Dashboard"
      subtitle="Project management and consultant performance tracking"
      breadcrumbActions={
        !isEditMode ? (
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
        ) : undefined
      }
      dashboardActions={<EditModeToggle isEditMode={isEditMode} onToggle={() => setIsEditMode(!isEditMode)} />}
    >
      <div className="p-6 space-y-6">
        {/* Active Filters Indicator */}
        <ActiveFiltersIndicator
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          dateRange={dateRange}
          onClearCountry={() => setSelectedCountry("all")}
          onClearRegion={() => setSelectedRegion("all")}
          onClearDateRange={() => setDateRange(undefined)}
        />

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Active Projects"
            value={filteredActiveProjects.toString()}
            change="+8 this month"
            trend="up"
            icon={<Briefcase className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              { label: "View All Projects", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/recruitment-services') },
              { label: "Pipeline", icon: <Target className="h-4 w-4" />, onClick: () => { } },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Total Clients"
            value={filteredTotalClients.toString()}
            change="+12.5%"
            trend="up"
            icon={<Users className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              { label: "View Clients", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/employers') },
              { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => { } },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Utilization Rate"
            value="83.6%"
            change="+5.2%"
            trend="up"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/consultants/workload') },
              { label: "Allocate Resources", icon: <Users className="h-4 w-4" />, onClick: () => { } },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Billable Hours"
            value={filteredBillableHours.toLocaleString()}
            change="+18.3% vs last month"
            trend="up"
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
            showMenu={true}
            menuItems={[
              { label: "View Breakdown", icon: <Eye className="h-4 w-4" />, onClick: () => { } },
              { label: "Timesheet", icon: <FilterIcon className="h-4 w-4" />, onClick: () => { } },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <StandardChartCard
            title="Project Pipeline"
            description={`Projects by stage${dateRange?.from ? ' (filtered)' : ''}`}
            className="bg-transparent border-0 shadow-none"
            onDownload={() => toast({ title: "Downloading pipeline data..." })}
            menuItems={[
              { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => { } },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredProjectPipeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="status"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#8b5cf6" name="Projects" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </StandardChartCard>

          <StandardChartCard
            title="Client Distribution"
            description="By industry sector"
            className="bg-transparent border-0 shadow-none"
            onDownload={() => toast({ title: "Downloading client data..." })}
            menuItems={[
              { label: "View All Clients", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/employers') },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clientDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  labelLine={false}
                  label={false}
                  fill="#8884d8"
                  dataKey="count"
                  strokeWidth={0}
                >
                  {clientDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </StandardChartCard>

          <StandardChartCard
            title="Resource Allocation"
            description={`Consultant utilization rates${dateRange?.from ? ' (filtered)' : ''}`}
            className="bg-transparent border-0 shadow-none"
            onDownload={() => toast({ title: "Downloading allocation data..." })}
            menuItems={[
              { label: "View Consultants", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/consultants') },
              { label: "Workload", icon: <BarChart3 className="h-4 w-4" />, onClick: () => navigate('/consultants/workload') },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => { } }
            ]}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredResourceAllocation} layout="horizontal" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="consultant"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="allocated" fill="#3b82f6" name="Allocated %" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="available" fill="#10b981" name="Available %" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </StandardChartCard>

          <StandardChartCard
            title="Revenue Forecast"
            description={`Actual vs forecasted revenue${dateRange?.from ? ' (filtered)' : ''}`}
            className="bg-transparent border-0 shadow-none"
            onDownload={() => toast({ title: "Downloading forecast data..." })}
            menuItems={[
              { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => { } },
              { label: "Adjust Forecast", icon: <TrendingUp className="h-4 w-4" />, onClick: () => { } },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => { } }
            ]}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredRevenueForecast} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  width={50}
                />
                <Tooltip
                  cursor={false}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Revenue" dot={false} activeDot={false} />
                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" name="Forecast" dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </StandardChartCard>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
