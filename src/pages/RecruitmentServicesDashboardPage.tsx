import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { 
  Briefcase, Users, Target, TrendingUp, Download, Eye, Filter, 
  BarChart3, DollarSign, Award, CheckCircle, UserCog
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

const servicePipeline = [
  { status: 'Discovery', count: 12 },
  { status: 'Active', count: 28 },
  { status: 'Shortlisting', count: 15 },
  { status: 'Interviewing', count: 18 },
  { status: 'Completed', count: 52 },
];

const serviceTypeDistribution = [
  { type: 'Shortlisting', count: 45, color: '#3b82f6' },
  { type: 'Full Service', count: 38, color: '#10b981' },
  { type: 'Executive Search', count: 22, color: '#f59e0b' },
  { type: 'RPO', count: 18, color: '#8b5cf6' },
  { type: 'Temp Staffing', count: 12, color: '#ec4899' },
];

const consultantPerformance = [
  { consultant: 'Sarah Chen', placements: 28, satisfaction: 4.8 },
  { consultant: 'Mike Johnson', placements: 25, satisfaction: 4.7 },
  { consultant: 'Emily Davis', placements: 22, satisfaction: 4.9 },
  { consultant: 'David Lee', placements: 20, satisfaction: 4.6 },
  { consultant: 'Ana Martinez', placements: 18, satisfaction: 4.8 },
];

const revenueTrends = [
  { month: 'Jan', revenue: 145000, target: 140000 },
  { month: 'Feb', revenue: 162000, target: 155000 },
  { month: 'Mar', revenue: 178000, target: 170000 },
  { month: 'Apr', revenue: 195000, target: 185000 },
  { month: 'May', revenue: 212000, target: 200000 },
  { month: 'Jun', revenue: 228000, target: 220000 },
];

const projectCompletionRate = [
  { month: 'Jan', completed: 8, total: 12, rate: 67 },
  { month: 'Feb', completed: 9, total: 14, rate: 64 },
  { month: 'Mar', completed: 11, total: 15, rate: 73 },
  { month: 'Apr', completed: 12, total: 16, rate: 75 },
  { month: 'May', completed: 14, total: 18, rate: 78 },
  { month: 'Jun', completed: 15, total: 19, rate: 79 },
];

export default function RecruitmentServicesDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleExport = () => {
    toast({ title: "Exporting recruitment services data..." });
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
              <h1 className="text-3xl font-bold">Recruitment Services Dashboard</h1>
              <p className="text-muted-foreground">
                Track service projects, performance, and revenue metrics
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
              value="28"
              change="+15.2%"
              trend="up"
              icon={<Briefcase className="h-6 w-6" />}
              variant="primary"
              showMenu={true}
              menuItems={[
                { label: "View All", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/recruitment-services') },
                { label: "Create New", icon: <Target className="h-4 w-4" />, onClick: () => navigate('/recruitment-services?action=create') },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Service Revenue"
              value=""
              isCurrency={true}
              rawValue={228000}
              change="+18.3%"
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
              title="Success Rate"
              value="78.9%"
              change="+4.2%"
              trend="up"
              icon={<Award className="h-6 w-6" />}
              variant="success"
              showMenu={true}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />

            <EnhancedStatCard
              title="Completed Projects"
              value="52"
              change="15 this month"
              trend="up"
              icon={<CheckCircle className="h-6 w-6" />}
              variant="primary"
              showMenu={true}
              menuItems={[
                { label: "View History", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Reports", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <StandardChartCard
              title="Service Pipeline"
              description={`Projects by status${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading pipeline data..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicePipeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Projects" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Service Type Distribution"
              description="Projects by service type"
              onDownload={() => toast({ title: "Downloading distribution data..." })}
              menuItems={[
                { label: "View All Types", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, count }) => `${type}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {serviceTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Consultant Performance"
              description={`Top performing consultants${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading performance data..." })}
              menuItems={[
                { label: "View All", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/consultants') },
                { label: "Leaderboard", icon: <Award className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consultantPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="consultant" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="placements" fill="#3b82f6" name="Placements" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Revenue Trends"
              description={`Monthly revenue vs target${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading revenue trends..." })}
              menuItems={[
                { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Forecast", icon: <TrendingUp className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </StandardChartCard>

            <StandardChartCard
              title="Project Completion Rate"
              description={`Monthly completion metrics${dateRange?.from ? ' (filtered)' : ''}`}
              onDownload={() => toast({ title: "Downloading completion data..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectCompletionRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="total" fill="#94a3b8" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
