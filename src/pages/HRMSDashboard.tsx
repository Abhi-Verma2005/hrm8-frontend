import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
import type { DateRange } from "react-day-picker";
import { ViewOnlyEditButton } from "@/components/dashboard/ViewOnlyEditButton";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from "recharts";
import { 
  Users, TrendingUp, TrendingDown, UserPlus, UserMinus, 
  Clock, DollarSign, Award, Download, Building2, Eye, BarChart3, Calendar, Filter, Plus
} from "lucide-react";
import { getEmployees } from "@/lib/employeeStorage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";
import { useToast } from "@/hooks/use-toast";

export default function HRMSDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const employees = getEmployees();
  const { formatCurrency } = useCurrencyFormat();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleExport = () => {
    toast({
      title: "Exporting Report",
      description: "Preparing your HR analytics export...",
    });
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const onLeave = employees.filter(e => e.status === 'on-leave').length;
    const avgSalary = employees.reduce((sum, e) => sum + e.salary, 0) / total;
    
    return {
      total,
      active,
      onLeave,
      avgSalary: Math.round(avgSalary),
      activeRate: total > 0 ? ((active / total) * 100).toFixed(1) : 0,
    };
  }, [employees]);

  // Headcount trends
  const headcountTrends = [
    { month: 'Jan', headcount: 485, hires: 12, departures: 8 },
    { month: 'Feb', headcount: 489, hires: 15, departures: 11 },
    { month: 'Mar', headcount: 493, hires: 18, departures: 14 },
    { month: 'Apr', headcount: 497, hires: 21, departures: 17 },
    { month: 'May', headcount: 501, hires: 19, departures: 15 },
    { month: 'Jun', headcount: 505, hires: 23, departures: 19 },
  ];

  // Department distribution
  const departmentData = [
    { name: 'Engineering', count: 187, color: '#3b82f6' },
    { name: 'Sales', count: 98, color: '#10b981' },
    { name: 'Marketing', count: 67, color: '#f59e0b' },
    { name: 'HR', count: 45, color: '#8b5cf6' },
    { name: 'Finance', count: 54, color: '#ec4899' },
    { name: 'Operations', count: 54, color: '#06b6d4' },
  ];

  // Tenure distribution
  const tenureData = [
    { range: '0-1 years', count: 123 },
    { range: '1-3 years', count: 198 },
    { range: '3-5 years', count: 134 },
    { range: '5-10 years', count: 87 },
    { range: '10+ years', count: 43 },
  ];

  // Turnover rate by department
  const turnoverData = [
    { department: 'Engineering', rate: 8.5, benchmark: 12.0 },
    { department: 'Sales', rate: 15.2, benchmark: 18.0 },
    { department: 'Marketing', rate: 11.3, benchmark: 14.0 },
    { department: 'HR', rate: 6.8, benchmark: 10.0 },
    { department: 'Finance', rate: 7.2, benchmark: 9.0 },
    { department: 'Operations', rate: 12.1, benchmark: 15.0 },
  ];

  // Compensation analysis
  const compensationData = [
    { level: 'Entry', min: 45000, avg: 55000, max: 65000 },
    { level: 'Mid', min: 65000, avg: 85000, max: 105000 },
    { level: 'Senior', min: 95000, avg: 125000, max: 155000 },
    { level: 'Lead', min: 125000, avg: 165000, max: 205000 },
    { level: 'Executive', min: 180000, avg: 250000, max: 320000 },
  ];

  // Diversity metrics
  const diversityData = [
    { category: 'Gender', male: 62, female: 35, nonBinary: 3 },
    { category: 'Age Group', '18-25': 18, '26-35': 42, '36-45': 28, '46-55': 9, '56+': 3 },
  ];

  // Location breakdown
  const locationData = [
    { location: 'New York', count: 156 },
    { location: 'San Francisco', count: 142 },
    { location: 'London', count: 89 },
    { location: 'Remote', count: 78 },
    { location: 'Austin', count: 40 },
  ];

  return (
    <DashboardPageLayout
      title="HR Analytics"
      subtitle="Workforce insights, headcount trends, and organizational metrics"
      breadcrumbActions={
        <div className="flex items-center gap-3">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Select period"
            align="end"
          />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
      dashboardActions={<ViewOnlyEditButton />}
    >
      <div className="space-y-6 animate-fade-in">

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Headcount"
            value={metrics.total.toString()}
            change="+4.2%"
            trend="up"
            icon={<Users className="h-6 w-6" />}
            variant="neutral"
            showMenu={true}
            menuItems={[
              { label: "View Employees", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/hrms') },
              { label: "Add Employee", icon: <Plus className="h-4 w-4" />, onClick: () => navigate('/hrms/employees/new') },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Active Employees"
            value={metrics.active.toString()}
            change={`${metrics.activeRate}% of workforce`}
            trend="up"
            icon={<UserPlus className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              { label: "View Active", icon: <Eye className="h-4 w-4" />, onClick: () => navigate('/hrms?status=active') },
              { label: "View Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => navigate('/hrms/analytics') },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Turnover Rate"
            value="9.8%"
            change="-1.3%"
            trend="up"
            icon={<UserMinus className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
              { label: "Compare Periods", icon: <Calendar className="h-4 w-4" />, onClick: () => {} },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />

          <EnhancedStatCard
            title="Avg. Salary"
            value={formatCurrency(metrics.avgSalary)}
            change="+3.5%"
            trend="up"
            icon={<DollarSign className="h-6 w-6" />}
            variant="warning"
            showMenu={true}
            menuItems={[
              { label: "View Breakdown", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
              { label: "View Analytics", icon: <BarChart3 className="h-4 w-4" />, onClick: () => navigate('/hrms/analytics') },
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport }
            ]}
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="headcount" className="space-y-4">
          <TabsList>
            <TabsTrigger value="headcount">Headcount</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="turnover">Turnover</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
            <TabsTrigger value="diversity">Diversity</TabsTrigger>
          </TabsList>

          <TabsContent value="headcount" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <StandardChartCard
                title="Headcount Trend"
                description="Employee growth over time"
                showDatePicker={true}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onDownload={() => toast({ title: "Downloading headcount trend..." })}
                menuItems={[
                  { label: "View Full Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                  { label: "Compare Periods", icon: <Calendar className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={headcountTrends}>
                    <defs>
                      <linearGradient id="colorHeadcount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="headcount" 
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#colorHeadcount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Hires vs Departures"
                description="Monthly workforce changes"
                showDatePicker={true}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onDownload={() => toast({ title: "Downloading hiring data..." })}
                menuItems={[
                  { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={headcountTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hires" fill="#10b981" name="Hires" />
                    <Bar dataKey="departures" fill="#ef4444" name="Departures" />
                  </BarChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Employee Tenure"
                description="Distribution by years of service"
                showDatePicker={false}
                onDownload={() => toast({ title: "Downloading tenure data..." })}
                menuItems={[
                  { label: "View Breakdown", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tenureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Location Breakdown"
                description="Employees by office location"
                showDatePicker={false}
                onDownload={() => toast({ title: "Downloading location data..." })}
                menuItems={[
                  { label: "View Map", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Filter by Location", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="location" type="category" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#06b6d4" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </StandardChartCard>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <StandardChartCard
                title="Department Distribution"
                description="Headcount by department"
                showDatePicker={false}
                onDownload={() => toast({ title: "Downloading department data..." })}
                menuItems={[
                  { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Filter by Department", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
                ]}
              >
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Department Sizes"
                description="Employee count per department"
                showDatePicker={false}
                onDownload={() => toast({ title: "Downloading department sizes..." })}
                menuItems={[
                  { label: "View All Departments", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
                ]}
              >
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: dept.color }}
                          />
                          <span className="text-sm font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{dept.count}</span>
                          <Badge variant="secondary" className="text-xs">
                            {((dept.count / metrics.total) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${(dept.count / metrics.total) * 100}%`,
                            backgroundColor: dept.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </StandardChartCard>
            </div>
          </TabsContent>

          <TabsContent value="turnover" className="space-y-4">
            <StandardChartCard
              title="Turnover Rate by Department"
              description="Actual vs industry benchmark"
              showDatePicker={true}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onDownload={() => toast({ title: "Downloading turnover data..." })}
              menuItems={[
                { label: "View Full Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Set Benchmarks", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={turnoverData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis label={{ value: 'Turnover Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rate" fill="#3b82f6" name="Actual Rate" />
                  <Bar dataKey="benchmark" fill="#94a3b8" name="Industry Benchmark" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-500">9.8%</div>
                    <div className="text-xs text-muted-foreground">Company Avg</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">13.2%</div>
                    <div className="text-xs text-muted-foreground">Industry Avg</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-500">92</div>
                    <div className="text-xs text-muted-foreground">Days Avg Tenure</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">87%</div>
                    <div className="text-xs text-muted-foreground">Retention Rate</div>
                  </div>
                </div>
              </div>
            </StandardChartCard>
          </TabsContent>

          <TabsContent value="compensation" className="space-y-4">
            <StandardChartCard
              title="Compensation Ranges by Level"
              description="Salary distribution across career levels"
              showDatePicker={false}
              onDownload={() => toast({ title: "Downloading compensation data..." })}
              menuItems={[
                { label: "View Analysis", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Compare Market", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={compensationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="level" type="category" width={80} />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="min" fill="#94a3b8" name="Min" />
                  <Bar dataKey="avg" fill="#3b82f6" name="Average" />
                  <Bar dataKey="max" fill="#10b981" name="Max" />
                </BarChart>
              </ResponsiveContainer>
            </StandardChartCard>
          </TabsContent>

          <TabsContent value="diversity" className="space-y-4">
            <StandardChartCard
              title="Diversity & Inclusion Metrics"
              description="Workforce demographic breakdown"
              showDatePicker={false}
              onDownload={() => toast({ title: "Downloading diversity data..." })}
              menuItems={[
                { label: "View Full Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export Data", icon: <Download className="h-4 w-4" />, onClick: handleExport }
              ]}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Gender Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Male</span>
                      <div className="flex items-center gap-2">
                        <div className="w-48 bg-muted rounded-full h-2">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '62%' }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">62%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Female</span>
                      <div className="flex items-center gap-2">
                        <div className="w-48 bg-muted rounded-full h-2">
                          <div className="h-2 bg-pink-500 rounded-full" style={{ width: '35%' }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">35%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Non-Binary</span>
                      <div className="flex items-center gap-2">
                        <div className="w-48 bg-muted rounded-full h-2">
                          <div className="h-2 bg-purple-500 rounded-full" style={{ width: '3%' }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">3%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Age Distribution</h4>
                  <div className="space-y-3">
                    {[
                      { range: '18-25', percent: 18, color: '#3b82f6' },
                      { range: '26-35', percent: 42, color: '#10b981' },
                      { range: '36-45', percent: 28, color: '#f59e0b' },
                      { range: '46-55', percent: 9, color: '#8b5cf6' },
                      { range: '56+', percent: 3, color: '#ec4899' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.range}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-48 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ width: `${item.percent}%`, backgroundColor: item.color }} 
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{item.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StandardChartCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
