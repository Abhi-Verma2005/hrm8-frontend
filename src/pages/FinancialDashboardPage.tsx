import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { DashboardActionBar } from "@/components/dashboard/DashboardActionBar";
import { ActiveFiltersIndicator } from "@/components/dashboard/ActiveFiltersIndicator";
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard, Download, Eye, Filter as FilterIcon, 
  BarChart3, PieChart as PieChartIcon, Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { isWithinInterval } from "date-fns";
import { applyLocationFilterToMetric, applyLocationFilterToTimeSeries } from "@/lib/mockDataWithLocations";

const revenueExpenses = [
  { month: 'Jan', revenue: 245000, expenses: 182000, profit: 63000 },
  { month: 'Feb', revenue: 268000, expenses: 195000, profit: 73000 },
  { month: 'Mar', revenue: 289000, expenses: 201000, profit: 88000 },
  { month: 'Apr', revenue: 312000, expenses: 215000, profit: 97000 },
  { month: 'May', revenue: 334000, expenses: 228000, profit: 106000 },
  { month: 'Jun', revenue: 356000, expenses: 235000, profit: 121000 },
];

const budgetAnalysis = [
  { category: 'Salaries', budget: 180000, spent: 175000 },
  { category: 'Operations', budget: 45000, spent: 42000 },
  { category: 'Marketing', budget: 32000, spent: 28500 },
  { category: 'Technology', budget: 28000, spent: 31000 },
  { category: 'Training', budget: 15000, spent: 12000 },
];

const costBreakdown = [
  { name: 'Salaries', value: 175000, color: '#3b82f6' },
  { name: 'Operations', value: 42000, color: '#10b981' },
  { name: 'Marketing', value: 28500, color: '#f59e0b' },
  { name: 'Technology', value: 31000, color: '#8b5cf6' },
  { name: 'Training', value: 12000, color: '#ec4899' },
];

const payrollTrends = [
  { month: 'Jan', payroll: 175000, benefits: 28000 },
  { month: 'Feb', payroll: 178000, benefits: 28500 },
  { month: 'Mar', payroll: 181000, benefits: 29000 },
  { month: 'Apr', payroll: 185000, benefits: 29500 },
  { month: 'May', payroll: 188000, benefits: 30000 },
  { month: 'Jun', payroll: 192000, benefits: 30500 },
];

export default function FinancialDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const hasActiveFilters = !!(dateRange?.from) || selectedCountry !== "all" || selectedRegion !== "all";

  // Calculate filtered metrics
  const filteredTotalRevenue = useMemo(() => 
    applyLocationFilterToMetric(356000, selectedCountry, selectedRegion),
    [selectedCountry, selectedRegion]
  );

  const filteredNetProfit = useMemo(() => 
    applyLocationFilterToMetric(121000, selectedCountry, selectedRegion),
    [selectedCountry, selectedRegion]
  );

  const filteredTotalExpenses = useMemo(() => 
    applyLocationFilterToMetric(235000, selectedCountry, selectedRegion),
    [selectedCountry, selectedRegion]
  );

  // Filter data based on date range and location
  const filteredRevenueExpenses = useMemo(() => {
    let data = revenueExpenses;
    
    if (dateRange?.from) {
      data = data.filter((item) => {
        const itemDate = new Date(2024, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].indexOf(item.month), 1);
        return isWithinInterval(itemDate, {
          start: dateRange.from!,
          end: dateRange.to || dateRange.from!,
        });
      });
    }
    
    return applyLocationFilterToTimeSeries(
      data,
      selectedCountry,
      selectedRegion,
      ['revenue', 'expenses', 'profit']
    );
  }, [dateRange, selectedCountry, selectedRegion]);

  const filteredPayrollTrends = useMemo(() => {
    let data = payrollTrends;
    
    if (dateRange?.from) {
      data = data.filter((item) => {
        const itemDate = new Date(2024, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].indexOf(item.month), 1);
        return isWithinInterval(itemDate, {
          start: dateRange.from!,
          end: dateRange.to || dateRange.from!,
        });
      });
    }
    
    return applyLocationFilterToTimeSeries(
      data,
      selectedCountry,
      selectedRegion,
      ['payroll', 'benefits']
    );
  }, [dateRange, selectedCountry, selectedRegion]);

  const handleExport = () => {
    toast({ 
      title: "Exporting financial data...",
      description: "Preparing your export..."
    });
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedCountry("all");
    setSelectedRegion("all");
    toast({ title: "Filters reset" });
  };

  return (
    <DashboardPageLayout
      title="Financial Dashboard"
      subtitle="Monitor revenue, expenses, and financial performance"
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EnhancedStatCard
              title="Total Revenue"
              value=""
              isCurrency={true}
              rawValue={filteredTotalRevenue}
              change="+15.2%"
              trend="up"
              icon={<DollarSign className="h-6 w-6" />}
              variant="success"
              showMenu={true}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/finance') },
                { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Total Expenses"
              value=""
              isCurrency={true}
              rawValue={235000}
              change="+8.4%"
              trend="up"
              icon={<CreditCard className="h-6 w-6" />}
              variant="warning"
              showMenu={true}
              menuItems={[
                { label: "View Breakdown", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Budget Analysis", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Profit Margin"
              value="34.0%"
              change="+2.3%"
              trend="up"
              icon={<TrendingUp className="h-6 w-6" />}
              variant="success"
              showMenu={true}
              menuItems={[
                { label: "View Trend", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Compare Periods", icon: <FilterIcon className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Payroll Cost"
              value=""
              isCurrency={true}
              rawValue={192000}
              change="+3.2%"
              trend="up"
              icon={<Wallet className="h-6 w-6" />}
              variant="primary"
              showMenu={true}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/payroll') },
                { label: "Forecast", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <StandardChartCard
              title="Revenue vs Expenses"
              description={`Monthly financial comparison${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading financial comparison..." })}
              menuItems={[
                { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Clear Filter", icon: <FilterIcon className="h-4 w-4" />, onClick: () => setDateRange(undefined) },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredRevenueExpenses}>
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
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
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
              title="Cost Breakdown"
              description="Expense distribution by category"
              onDownload={() => toast({ title: "Downloading cost breakdown..." })}
              menuItems={[
                { label: "View All", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Payroll Trends"
              description={`Monthly payroll and benefits${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading payroll trends..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/payroll') },
                { label: "Forecast", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={filteredPayrollTrends}>
                  <defs>
                    <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBenefits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="payroll" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPayroll)" name="Payroll" />
                  <Area type="monotone" dataKey="benefits" stroke="#10b981" fillOpacity={1} fill="url(#colorBenefits)" name="Benefits" />
                </AreaChart>
              </ResponsiveContainer>
            </StandardChartCard>
          </div>
      </div>
    </DashboardPageLayout>
  );
}
