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
import {
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Filter,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Briefcase,
} from "lucide-react";

export default function Components() {
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
                    <Calendar />
                  </Button>
                  <Button size="icon-sm" variant="reverse">
                    <Plus />
                  </Button>
                  <Button size="icon" variant="reverse">
                    <Filter />
                  </Button>
                  <Button size="icon-lg" variant="reverse">
                    <Calendar />
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

          {/* Stats Cards */}
          <section id="cards" className="mb-16">
            <h2 className="mb-8">Dashboard Cards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Users className="h-5 w-5" />}
                title="Total Candidates"
                value="2,543"
                change="+12.5%"
                trend="up"
              />
              <StatCard
                icon={<FileText className="h-5 w-5" />}
                title="Active Jobs"
                value="47"
                change="+8.2%"
                trend="up"
              />
              <StatCard
                icon={<TrendingUp className="h-5 w-5" />}
                title="Applications"
                value="1,234"
                change="+23.1%"
                trend="up"
              />
              <StatCard
                icon={<CheckCircle className="h-5 w-5" />}
                title="Hired This Month"
                value="12"
                change="-2.4%"
                trend="down"
              />
            </div>
          </section>

          {/* Enhanced Dashboard Cards */}
          <section id="enhanced-cards" className="mb-16">
            <h2 className="mb-8">Enhanced Dashboard Cards</h2>
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

        </div>
      </div>
    </AppLayout>
  );
}

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
