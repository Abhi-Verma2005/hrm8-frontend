import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { 
  Users, Briefcase, TrendingUp, DollarSign, Download, Eye, Filter as FilterIcon, 
  BarChart3, Building2, Target, CheckCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subMonths, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

const hiringTrends = [
  { month: 'Jan', hires: 45, applications: 320, interviews: 128 },
  { month: 'Feb', hires: 52, applications: 385, interviews: 145 },
  { month: 'Mar', hires: 48, applications: 402, interviews: 136 },
  { month: 'Apr', hires: 61, applications: 445, interviews: 167 },
  { month: 'May', hires: 58, applications: 468, interviews: 159 },
  { month: 'Jun', hires: 64, applications: 512, interviews: 178 },
];

const revenueExpenses = [
  { month: 'Jan', revenue: 245000, expenses: 182000 },
  { month: 'Feb', revenue: 268000, expenses: 195000 },
  { month: 'Mar', revenue: 289000, expenses: 201000 },
  { month: 'Apr', revenue: 312000, expenses: 215000 },
  { month: 'May', revenue: 334000, expenses: 228000 },
  { month: 'Jun', revenue: 356000, expenses: 235000 },
];

const employeeDistribution = [
  { department: 'Engineering', count: 145, color: '#3b82f6' },
  { department: 'Sales', count: 89, color: '#10b981' },
  { department: 'Marketing', count: 56, color: '#f59e0b' },
  { department: 'HR', count: 34, color: '#8b5cf6' },
  { department: 'Finance', count: 28, color: '#ec4899' },
  { department: 'Operations', count: 42, color: '#6366f1' },
];

const projectPipeline = [
  { status: 'Lead', count: 15 },
  { status: 'Proposal', count: 12 },
  { status: 'Negotiation', count: 8 },
  { status: 'Active', count: 32 },
  { status: 'Completed', count: 45 },
];

export default function OverviewDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Filter data based on date range
  const filteredHiringTrends = useMemo(() => {
    if (!dateRange?.from) return hiringTrends;
    
    return hiringTrends.filter((item) => {
      const itemDate = new Date(2024, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].indexOf(item.month), 1);
      return isWithinInterval(itemDate, {
        start: dateRange.from!,
        end: dateRange.to || dateRange.from!,
      });
    });
  }, [dateRange]);

  const filteredRevenueExpenses = useMemo(() => {
    if (!dateRange?.from) return revenueExpenses;
    
    return revenueExpenses.filter((item) => {
      const itemDate = new Date(2024, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].indexOf(item.month), 1);
      return isWithinInterval(itemDate, {
        start: dateRange.from!,
        end: dateRange.to || dateRange.from!,
      });
    });
  }, [dateRange]);

  const filteredEmployeeDistribution = useMemo(() => {
    if (selectedDepartment === "all") return employeeDistribution;
    return employeeDistribution.filter(item => item.department === selectedDepartment);
  }, [selectedDepartment]);

  const filteredProjectPipeline = useMemo(() => {
    if (selectedStatus === "all") return projectPipeline;
    return projectPipeline.filter(item => item.status === selectedStatus);
  }, [selectedStatus]);

  const handleExport = () => {
    const filters = {
      dateRange,
      department: selectedDepartment,
      status: selectedStatus,
    };
    toast({ 
      title: "Exporting overview data...", 
      description: `Applying ${Object.values(filters).filter(Boolean).length} filter(s)`
    });
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedDepartment("all");
    setSelectedStatus("all");
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
              <h1 className="text-3xl font-bold">Overview Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive view of your organization's key metrics
              </p>
            </div>
            
            {!isEditMode && (
              <div className="flex items-center gap-3">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Select period"
                  align="end"
                />

                <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dashboard Filters</DialogTitle>
                      <DialogDescription>
                        Apply filters to customize your dashboard view
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {employeeDistribution.map(dept => (
                              <SelectItem key={dept.department} value={dept.department}>
                                {dept.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Project Status</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {projectPipeline.map(status => (
                              <SelectItem key={status.status} value={status.status}>
                                {status.status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleResetFilters} variant="outline" className="flex-1">
                          Reset Filters
                        </Button>
                        <Button onClick={() => setFilterDialogOpen(false)} className="flex-1">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="secondary" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EnhancedStatCard
              title="Total Employees"
              value="394"
              change="+12.5%"
              trend="up"
              icon={<Users className="h-6 w-6" />}
              variant="primary"
              showMenu={true}
              menuItems={[
                { label: "View All", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/hrms') },
                { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => navigate('/hrms/analytics') },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Active Projects"
              value="47"
              change="+8.3%"
              trend="up"
              icon={<Target className="h-6 w-6" />}
              variant="success"
              showMenu={true}
              menuItems={[
                { label: "View Projects", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/recruitment-services') },
                { label: "Pipeline", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Monthly Revenue"
              value=""
              isCurrency={true}
              rawValue={356000}
              change="+15.2%"
              trend="up"
              icon={<DollarSign className="h-6 w-6" />}
              variant="primary"
              showMenu={true}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/finance') },
                { label: "Forecast", icon: <TrendingUp className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Total Clients"
              value="89"
              change="+5.7%"
              trend="up"
              icon={<Building2 className="h-6 w-6" />}
              variant="neutral"
              showMenu={true}
              menuItems={[
                { label: "View Clients", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/employers') },
                { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <StandardChartCard
              title="Hiring Trends"
              description={`Monthly hiring activity${dateRange?.from ? ' (filtered)' : ''}`}
              showDatePicker={true}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onDownload={() => toast({ title: "Downloading hiring trends..." })}
              menuItems={[
                { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => navigate('/analytics') },
                { label: "Clear Filter", icon: <FilterIcon className="h-4 w-4" />, onClick: () => setDateRange(undefined) },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredHiringTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Revenue vs Expenses"
              description={`Financial performance comparison${dateRange?.from ? ' (filtered)' : ''}`}
              showDatePicker={true}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onDownload={() => toast({ title: "Downloading financial data..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/finance') },
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
              title="Employee Distribution"
              description={`By department${selectedDepartment !== 'all' ? ` (${selectedDepartment})` : ''}`}
              onDownload={() => toast({ title: "Downloading employee data..." })}
              menuItems={[
                { label: "View All", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/hrms') },
                { label: "Filter Department", icon: <FilterIcon className="h-4 w-4" />, onClick: () => setFilterDialogOpen(true) },
                { label: "Clear Filter", icon: <FilterIcon className="h-4 w-4" />, onClick: () => setSelectedDepartment("all") }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredEmployeeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ department, count }) => `${department}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {employeeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Project Pipeline"
              description={`Projects by status${selectedStatus !== 'all' ? ` (${selectedStatus})` : ''}`}
              onDownload={() => toast({ title: "Downloading pipeline data..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/recruitment-services') },
                { label: "Filter Status", icon: <FilterIcon className="h-4 w-4" />, onClick: () => setFilterDialogOpen(true) },
                { label: "Clear Filter", icon: <FilterIcon className="h-4 w-4" />, onClick: () => setSelectedStatus("all") }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredProjectPipeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Projects" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
