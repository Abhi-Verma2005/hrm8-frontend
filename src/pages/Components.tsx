import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLayout } from "@/components/AppLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { HiringTrendsChart } from "@/components/dashboard/charts/HiringTrendsChart";
import { ApplicationFunnelChart } from "@/components/dashboard/charts/ApplicationFunnelChart";
import { JobDistributionChart } from "@/components/dashboard/charts/JobDistributionChart";
import { SourceOfHireChart } from "@/components/dashboard/charts/SourceOfHireChart";
import { KanbanBoard } from "@/components/KanbanBoard";
import { DateRangePicker, DateRangePickerCompact } from "@/components/ui/date-filters";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DataTable, Column } from "@/components/tables/DataTable";
import { EntityAvatar } from "@/components/tables/EntityAvatar";
import { mockEmployers, mockJobs, mockCandidates, mockConsultants } from "@/data/mockTableData";
import type { Employer, Job, Candidate, Consultant } from "@/types/entities";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail, Phone, Star, Trash2, Edit, ExternalLink } from "lucide-react";
import {
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  Users,
  FileText,
  TrendingUp,
  Briefcase,
  Eye,
  Download,
  BarChart3,
  Share2,
  Target,
  Clock,
  UserCheck,
} from "lucide-react";

export default function Components() {
  const [singleDate, setSingleDate] = useState<Date>();
  const [interviewDate, setInterviewDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [compactRange, setCompactRange] = useState<DateRange | undefined>();
  
  return (
    <AppLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12 animate-slide-up">
            <Badge className="mb-4 bg-primary-light text-primary border-0">
              UI Components
            </Badge>
            <h1 className="mb-4">Component Library</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A comprehensive collection of reusable, production-ready components
              for building modern HR Tech applications.
            </p>
          </div>

          {/* Button Components */}
          <section id="buttons" className="mb-16">
            <h2 className="mb-8">Buttons</h2>
            <div className="space-y-8">
              {/* Primary Buttons */}
              <Card className="p-8">
                <h4 className="mb-6">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Default Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="accent">Accent</Button>
                  <Button variant="gradient">Gradient</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </Card>

              {/* State Buttons */}
              <Card className="p-8">
                <h4 className="mb-6">State Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="success">
                    <CheckCircle />
                    Success
                  </Button>
                  <Button variant="warning">
                    <AlertCircle />
                    Warning
                  </Button>
                  <Button variant="destructive">
                    <AlertCircle />
                    Destructive
                  </Button>
                </div>
              </Card>

              {/* Sizes */}
              <Card className="p-8">
                <h4 className="mb-6">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </Card>

              {/* Icon Buttons */}
              <Card className="p-8">
                <h4 className="mb-6">Icon Buttons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button size="icon-sm" variant="ghost">
                    <Plus />
                  </Button>
                  <Button size="icon">
                    <Filter />
                  </Button>
                  <Button size="icon-lg" variant="gradient">
                    <CalendarIcon />
                  </Button>
                  <Button size="icon-sm" variant="reverse">
                    <Plus />
                  </Button>
                  <Button size="icon" variant="reverse">
                    <Filter />
                  </Button>
                  <Button size="icon-lg" variant="reverse">
                    <CalendarIcon />
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Form Elements */}
          <section id="forms" className="mb-16">
            <h2 className="mb-8">Form Elements</h2>
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Input</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search candidates..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="you@company.com" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Preferences</label>
                  <div className="flex items-center gap-2">
                    <Checkbox id="terms" />
                    <label htmlFor="terms" className="text-sm">
                      Accept terms and conditions
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="notifications" />
                    <label htmlFor="notifications" className="text-sm">
                      Enable notifications
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Date Pickers */}
          <section id="date-pickers" className="mb-16">
            <h2 className="mb-8">Date Pickers</h2>
            <div className="space-y-8">
              
              {/* Basic Single Date Picker */}
              <Card className="p-8">
                <h4 className="mb-2">Basic Date Picker</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Simple calendar for selecting a single date
                </p>
                <div className="flex flex-col gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={!singleDate && "text-muted-foreground"}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {singleDate ? format(singleDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={singleDate}
                        onSelect={setSingleDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {singleDate && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {format(singleDate, "PPPP")}
                    </p>
                  )}
                </div>
              </Card>

              {/* Compact Date Range Picker */}
              <Card className="p-8">
                <h4 className="mb-2">Compact Date Range Picker</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Icon-only date range picker with quick filters - perfect for toolbars and dashboards
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Filter Period:</span>
                    <DateRangePickerCompact
                      value={compactRange}
                      onChange={setCompactRange}
                      align="start"
                    />
                    {compactRange?.from && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCompactRange(undefined)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {compactRange?.from && compactRange?.to && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">From:</span>{" "}
                        {format(compactRange.from, "MMM d, yyyy")}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">To:</span>{" "}
                        {format(compactRange.to, "MMM d, yyyy")}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Full Date Range Picker */}
              <Card className="p-8">
                <h4 className="mb-2">Full Date Range Picker</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Comprehensive date range picker with preset ranges, custom selection, and smart formatting
                </p>
                <div className="flex flex-col gap-4">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Select date range"
                    align="start"
                  />
                  {dateRange?.from && dateRange?.to && (
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">From:</span>{" "}
                            {format(dateRange.from, "PPPP")}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">To:</span>{" "}
                            {format(dateRange.to, "PPPP")}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Use Cases */}
              <Card className="p-8">
                <h4 className="mb-2">Common Use Cases</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Real-world examples of date pickers in action
                </p>
                <div className="space-y-6">
                  
                  {/* Dashboard Filters */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold">Dashboard Filters</h5>
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <span className="text-sm">Analytics Period:</span>
                      <DateRangePickerCompact
                        value={compactRange}
                        onChange={setCompactRange}
                      />
                      <Button variant="secondary" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>

                  {/* Report Generation */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold">Report Generation</h5>
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium min-w-[100px]">
                          Report Period:
                        </label>
                        <DateRangePicker
                          value={dateRange}
                          onChange={setDateRange}
                          placeholder="Select reporting period"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium min-w-[100px]">
                          Report Type:
                        </label>
                        <Button variant="outline" size="sm" className="justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Hiring Metrics
                        </Button>
                      </div>
                      <Button className="w-full">
                        Generate Report
                      </Button>
                    </div>
                  </div>

                  {/* Event Scheduling */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold">Interview Scheduling</h5>
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium min-w-[120px]">
                          Interview Date:
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={!interviewDate && "text-muted-foreground"}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {interviewDate ? format(interviewDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={interviewDate}
                              onSelect={setInterviewDate}
                              initialFocus
                              className="pointer-events-auto"
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium min-w-[120px]">
                          Candidate:
                        </label>
                        <Button variant="outline" size="sm" className="justify-start">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Sarah Johnson
                        </Button>
                      </div>
                      <Button variant="success" className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                    </div>
                  </div>

                </div>
              </Card>
            </div>
          </section>

          {/* Alerts & Notifications */}
          <section id="alerts" className="mb-16">
            <h2 className="mb-8">Alerts & Status</h2>
            <div className="space-y-4">
              <Alert className="border-success bg-success-light">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertTitle className="text-success">Success!</AlertTitle>
                <AlertDescription className="text-success/90">
                  Your candidate profile has been updated successfully.
                </AlertDescription>
              </Alert>
              <Alert className="border-warning bg-warning-light">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertTitle className="text-warning">Warning</AlertTitle>
                <AlertDescription className="text-warning/90">
                  Your job posting will expire in 3 days.
                </AlertDescription>
              </Alert>
              <Alert className="border-primary bg-primary-light">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Information</AlertTitle>
                <AlertDescription className="text-primary/90">
                  5 new applicants match your job criteria.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Badges */}
          <section id="badges" className="mb-16">
            <h2 className="mb-8">Badges & Status Indicators</h2>
            <Card className="p-8">
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-success text-success-foreground">
                  Active
                </Badge>
                <Badge className="bg-warning text-warning-foreground">
                  Pending
                </Badge>
                <Badge className="bg-primary-light text-primary border-0">
                  New
                </Badge>
              </div>
            </Card>
          </section>

          {/* Tabs */}
          <section id="tabs" className="mb-16">
            <h2 className="mb-8">Tabs & Navigation</h2>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <Card className="p-6">
                  <h4 className="mb-2">Overview Dashboard</h4>
                  <p className="text-muted-foreground">
                    View key metrics and performance indicators.
                  </p>
                </Card>
              </TabsContent>
              <TabsContent value="analytics" className="mt-6">
                <Card className="p-6">
                  <h4 className="mb-2">Analytics Dashboard</h4>
                  <p className="text-muted-foreground">
                    Deep dive into your recruitment data.
                  </p>
                </Card>
              </TabsContent>
              <TabsContent value="reports" className="mt-6">
                <Card className="p-6">
                  <h4 className="mb-2">Reports Dashboard</h4>
                  <p className="text-muted-foreground">
                    Generate and export custom reports.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* Dashboard Stat Cards */}
          <section id="dashboard-cards" className="mb-16">
            <h2 className="mb-8">Dashboard Stat Cards</h2>
            
            {/* Basic Stat Cards */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Stat Card Variants</h3>
              <Card className="p-6">
                <Badge className="mb-2 bg-primary-light text-primary border-0">
                  All Variants
                </Badge>
                <p className="text-sm text-muted-foreground mb-4">
                  Stat cards with different color variants to visualize various metrics and KPIs
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <EnhancedStatCard
                    variant="primary"
                    icon={<Briefcase className="h-5 w-5" />}
                    title="Active Jobs"
                    value="47"
                    change="+8.2%"
                    trend="up"
                  />
                  <EnhancedStatCard
                    variant="success"
                    icon={<Users className="h-5 w-5" />}
                    title="Total Candidates"
                    value="2,543"
                    change="+12.5%"
                    trend="up"
                  />
                  <EnhancedStatCard
                    variant="warning"
                    icon={<FileText className="h-5 w-5" />}
                    title="Applications"
                    value="1,234"
                    change="+23.1%"
                    trend="up"
                  />
                  <EnhancedStatCard
                    variant="neutral"
                    icon={<CheckCircle className="h-5 w-5" />}
                    title="Hired This Month"
                    value="12"
                    change="-2.4%"
                    trend="down"
                  />
                </div>
              </Card>
            </div>

            {/* Interactive Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Interactive Features</h3>
              <Card className="p-6">
                <Badge className="mb-2 bg-primary-light text-primary border-0">
                  Hover to Reveal Actions
                </Badge>
                <p className="text-sm text-muted-foreground mb-4">
                  Cards support action buttons and dropdown menus for enhanced interactivity. Hover over the cards below to see the action buttons appear.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <EnhancedStatCard
                    variant="success"
                    icon={<TrendingUp className="h-5 w-5" />}
                    title="Conversion Rate"
                    value="68%"
                    change="+5.2%"
                    trend="up"
                    showAction={true}
                    actionLabel="Analyze"
                    onAction={() => alert('Opening analysis view...')}
                    showMenu={true}
                    menuItems={[
                      {
                        label: "View funnel",
                        icon: <BarChart3 className="h-4 w-4" />,
                        onClick: () => alert('Opening funnel...'),
                      },
                      {
                        label: "Compare periods",
                        icon: <Calendar className="h-4 w-4" />,
                        onClick: () => alert('Opening comparison...'),
                      },
                      {
                        label: "Share insights",
                        icon: <Share2 className="h-4 w-4" />,
                        onClick: () => alert('Opening share dialog...'),
                      },
                    ]}
                  />
                  <EnhancedStatCard
                    variant="warning"
                    icon={<Clock className="h-5 w-5" />}
                    title="Avg. Time to Hire"
                    value="24 days"
                    change="-3 days"
                    trend="up"
                    showAction={true}
                    actionLabel="Optimize"
                    onAction={() => alert('Opening optimization tips...')}
                    showMenu={true}
                    menuItems={[
                      {
                        label: "View bottlenecks",
                        icon: <AlertCircle className="h-4 w-4" />,
                        onClick: () => alert('Analyzing bottlenecks...'),
                      },
                      {
                        label: "Set goals",
                        icon: <Target className="h-4 w-4" />,
                        onClick: () => alert('Opening goals...'),
                      },
                    ]}
                  />
                </div>
              </Card>
            </div>
          </section>

          {/* Charts */}
          <section id="charts" className="mb-16">
            <h2 className="mb-8">Data Visualization Charts</h2>
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <HiringTrendsChart />
                <ApplicationFunnelChart />
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <JobDistributionChart />
                <SourceOfHireChart />
              </div>
            </div>
          </section>

          {/* Kanban Board */}
          <section id="kanban" className="mb-16">
            <h2 className="mb-8">Kanban Board System</h2>
            <Card className="p-6">
              <div className="mb-4">
                <Badge className="mb-2 bg-primary-light text-primary border-0">
                  Interactive Demo
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Drag and drop cards between columns to manage candidate pipeline
                </p>
              </div>
              <KanbanBoard />
            </Card>
          </section>

          {/* Data Tables */}
          <section id="tables" className="mb-16">
            <h2 className="mb-8">Data Tables</h2>
            
            {/* Basic Sortable Table */}
            <Card className="p-6 mb-8">
              <h4 className="mb-2">Basic Sortable Table</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Simple table with sorting - click column headers to sort ascending/descending
              </p>
              <DataTable
                data={mockEmployers.slice(0, 5)}
                columns={employerBasicColumns}
              />
            </Card>

            {/* Employers Table with Logos */}
            <Card className="p-6 mb-8">
              <h4 className="mb-2">Employers Table</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Table with company logos, status badges, filtering, and action menus
              </p>
              <DataTable
                data={mockEmployers}
                columns={employerColumns}
                searchable
                searchKeys={['name', 'industry', 'location']}
                statusFilter
                statusOptions={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'Pending', value: 'pending' }
                ]}
                statusKey="status"
              />
            </Card>

            {/* Jobs Table */}
            <Card className="p-6 mb-8">
              <h4 className="mb-2">Jobs Table</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Job listings with employer information, applicant counts, and advanced filtering
              </p>
              <DataTable
                data={mockJobs}
                columns={jobColumns}
                searchable
                searchKeys={['title', 'employer', 'location']}
                statusFilter
                statusOptions={[
                  { label: 'Open', value: 'open' },
                  { label: 'Closed', value: 'closed' },
                  { label: 'Draft', value: 'draft' }
                ]}
                statusKey="status"
                typeFilter
                typeOptions={[
                  { label: 'Full-time', value: 'Full-time' },
                  { label: 'Part-time', value: 'Part-time' },
                  { label: 'Contract', value: 'Contract' }
                ]}
                typeKey="type"
              />
            </Card>

            {/* Candidates Table with Selection */}
            <Card className="p-6 mb-8">
              <h4 className="mb-2">Candidates Table</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Candidate profiles with photos, skills, row selection, and bulk actions
              </p>
              <DataTable
                data={mockCandidates}
                columns={candidateColumns}
                selectable
                renderBulkActions={(selectedIds) => (
                  <>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Selected
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                searchable
                searchKeys={['name', 'email', 'position']}
                statusFilter
                statusOptions={[
                  { label: 'Active', value: 'active' },
                  { label: 'Placed', value: 'placed' },
                  { label: 'Inactive', value: 'inactive' }
                ]}
                statusKey="status"
              />
            </Card>

            {/* Consultants Table */}
            <Card className="p-6 mb-8">
              <h4 className="mb-2">Consultants Table</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Consultant directory with availability status, ratings, and client counts
              </p>
              <DataTable
                data={mockConsultants}
                columns={consultantColumns}
                searchable
                searchKeys={['name', 'email', 'specialization']}
                statusFilter
                statusOptions={[
                  { label: 'Available', value: 'available' },
                  { label: 'Assigned', value: 'assigned' },
                  { label: 'Unavailable', value: 'unavailable' }
                ]}
                statusKey="availability"
              />
            </Card>
          </section>

        </div>
      </div>
    </AppLayout>
  );
}

// Table Column Definitions

const employerBasicColumns: Column<Employer>[] = [
  {
    key: 'name',
    label: 'Company Name',
    sortable: true
  },
  {
    key: 'industry',
    label: 'Industry',
    sortable: true
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true
  },
  {
    key: 'activeJobs',
    label: 'Active Jobs',
    sortable: true
  }
];

const employerColumns: Column<Employer>[] = [
  {
    key: 'name',
    label: 'Company',
    sortable: true,
    render: (employer) => (
      <div className="flex items-center gap-3">
        <EntityAvatar
          src={employer.logo}
          name={employer.name}
          type="logo"
        />
        <div>
          <p className="font-medium">{employer.name}</p>
          <p className="text-sm text-muted-foreground">{employer.email}</p>
        </div>
      </div>
    )
  },
  {
    key: 'industry',
    label: 'Industry',
    sortable: true,
    render: (employer) => (
      <Badge variant="outline">{employer.industry}</Badge>
    )
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (employer) => (
      <Badge
        variant={
          employer.status === 'active' ? 'default' :
          employer.status === 'pending' ? 'secondary' : 'outline'
        }
      >
        {employer.status}
      </Badge>
    )
  },
  {
    key: 'activeJobs',
    label: 'Active Jobs',
    sortable: true,
    render: (employer) => (
      <span className="font-medium">{employer.activeJobs}</span>
    )
  },
  {
    key: 'actions',
    label: '',
    render: (employer) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

const jobColumns: Column<Job>[] = [
  {
    key: 'title',
    label: 'Job Title',
    sortable: true,
    render: (job) => (
      <div className="flex items-center gap-3">
        {job.employerLogo && (
          <EntityAvatar
            src={job.employerLogo}
            name={job.employer}
            type="logo"
            size="sm"
          />
        )}
        <div>
          <p className="font-medium">{job.title}</p>
          <p className="text-sm text-muted-foreground">{job.employer}</p>
        </div>
      </div>
    )
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    render: (job) => (
      <Badge variant="outline">{job.type}</Badge>
    )
  },
  {
    key: 'salary',
    label: 'Salary',
    sortable: true,
    render: (job) => (
      <span className="text-sm">{job.salary}</span>
    )
  },
  {
    key: 'applicants',
    label: 'Applicants',
    sortable: true,
    render: (job) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{job.applicants}</span>
      </div>
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (job) => (
      <Badge
        variant={
          job.status === 'open' ? 'default' :
          job.status === 'draft' ? 'secondary' : 'outline'
        }
      >
        {job.status}
      </Badge>
    )
  },
  {
    key: 'actions',
    label: '',
    render: (job) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            View Job
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Applicants
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

const candidateColumns: Column<Candidate>[] = [
  {
    key: 'name',
    label: 'Candidate',
    sortable: true,
    render: (candidate) => (
      <div className="flex items-center gap-3">
        <EntityAvatar
          src={candidate.photo}
          name={candidate.name}
          type="person"
        />
        <div>
          <p className="font-medium">{candidate.name}</p>
          <p className="text-sm text-muted-foreground">{candidate.email}</p>
        </div>
      </div>
    )
  },
  {
    key: 'position',
    label: 'Position',
    sortable: true
  },
  {
    key: 'experience',
    label: 'Experience',
    sortable: true
  },
  {
    key: 'skills',
    label: 'Skills',
    render: (candidate) => (
      <div className="flex flex-wrap gap-1">
        {candidate.skills.slice(0, 3).map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {candidate.skills.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{candidate.skills.length - 3}
          </Badge>
        )}
      </div>
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (candidate) => (
      <Badge
        variant={
          candidate.status === 'active' ? 'default' :
          candidate.status === 'placed' ? 'secondary' : 'outline'
        }
      >
        {candidate.status}
      </Badge>
    )
  },
  {
    key: 'actions',
    label: '',
    render: (candidate) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Phone className="h-4 w-4 mr-2" />
            Call
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

const consultantColumns: Column<Consultant>[] = [
  {
    key: 'name',
    label: 'Consultant',
    sortable: true,
    render: (consultant) => (
      <div className="flex items-center gap-3">
        <EntityAvatar
          src={consultant.photo}
          name={consultant.name}
          type="person"
        />
        <div>
          <p className="font-medium">{consultant.name}</p>
          <p className="text-sm text-muted-foreground">{consultant.email}</p>
        </div>
      </div>
    )
  },
  {
    key: 'specialization',
    label: 'Specialization',
    sortable: true,
    render: (consultant) => (
      <Badge variant="outline">{consultant.specialization}</Badge>
    )
  },
  {
    key: 'availability',
    label: 'Availability',
    sortable: true,
    render: (consultant) => (
      <Badge
        variant={
          consultant.availability === 'available' ? 'default' :
          consultant.availability === 'assigned' ? 'secondary' : 'outline'
        }
      >
        {consultant.availability}
      </Badge>
    )
  },
  {
    key: 'rating',
    label: 'Rating',
    sortable: true,
    render: (consultant) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{consultant.rating.toFixed(1)}</span>
      </div>
    )
  },
  {
    key: 'activeClients',
    label: 'Active Clients',
    sortable: true,
    render: (consultant) => (
      <span className="font-medium">{consultant.activeClients}</span>
    )
  },
  {
    key: 'actions',
    label: '',
    render: (consultant) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Briefcase className="h-4 w-4 mr-2" />
            Assign Client
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

function StatCard({
  icon,
  title,
  value,
  change,
  trend,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary-light rounded-lg text-primary">
          {icon}
        </div>
        <Badge
          className={
            trend === "up"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          }
        >
          {change}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </Card>
  );
}
