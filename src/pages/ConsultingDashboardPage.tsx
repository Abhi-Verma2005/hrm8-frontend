import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { 
  Briefcase, Users, TrendingUp, Clock, Download, Eye, Filter, 
  BarChart3, DollarSign, Target, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

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

  const handleExport = () => {
    toast({ title: "Exporting consulting data..." });
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
              <h1 className="text-3xl font-bold">Consulting Dashboard</h1>
              <p className="text-muted-foreground">
                Project management and consultant performance tracking
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
              title="Active Projects"
              value="32"
              change="+8 this month"
              trend="up"
              icon={<Briefcase className="h-6 w-6" />}
              variant="primary"
              showMenu={true}
              menuItems={[
                { label: "View All Projects", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/recruitment-services') },
                { label: "Pipeline", icon: <Target className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Total Clients"
              value="105"
              change="+12.5%"
              trend="up"
              icon={<Users className="h-6 w-6" />}
              variant="success"
              showMenu={true}
              menuItems={[
                { label: "View Clients", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/employers') },
                { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
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
                { label: "Allocate Resources", icon: <Users className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Billable Hours"
              value="8,234"
              change="+18.3% vs last month"
              trend="up"
              icon={<Clock className="h-6 w-6" />}
              variant="warning"
              showMenu={true}
              menuItems={[
                { label: "View Breakdown", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Timesheet", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <StandardChartCard
              title="Project Pipeline"
              description="Projects by stage"
              showDatePicker={true}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onDownload={() => toast({ title: "Downloading pipeline data..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectPipeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Projects" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Client Distribution"
              description="By industry sector"
              onDownload={() => toast({ title: "Downloading client data..." })}
              menuItems={[
                { label: "View All Clients", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/employers') },
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
              title="Resource Allocation"
              description="Consultant utilization rates"
              showDatePicker={true}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onDownload={() => toast({ title: "Downloading allocation data..." })}
              menuItems={[
                { label: "View Consultants", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/consultants') },
                { label: "Workload", icon: <BarChart3 className="h-4 w-4" />, onClick: () => navigate('/consultants/workload') },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resourceAllocation} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="consultant" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" fill="#3b82f6" name="Allocated %" />
                  <Bar dataKey="available" fill="#10b981" name="Available %" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Revenue Forecast"
              description="Actual vs forecasted revenue"
              showDatePicker={true}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onDownload={() => toast({ title: "Downloading forecast data..." })}
              menuItems={[
                { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Adjust Forecast", icon: <TrendingUp className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual Revenue" />
                  <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </StandardChartCard>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
