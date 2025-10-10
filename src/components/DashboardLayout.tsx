import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  Search,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import logoDark from "@/assets/logo-dark.png";

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Top Navigation */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-8">
            <img src={logoDark} alt="HRM8" className="h-8" />
            <div className="relative w-80 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates, jobs..."
                className="pl-9 bg-muted border-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="gradient" size="sm">
              <Plus />
              New Job
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-card h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            <NavItem
              icon={<LayoutDashboard />}
              label="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => setActiveSection("dashboard")}
            />
            <NavItem
              icon={<Users />}
              label="Candidates"
              active={activeSection === "candidates"}
              onClick={() => setActiveSection("candidates")}
              badge="24"
            />
            <NavItem
              icon={<Briefcase />}
              label="Jobs"
              active={activeSection === "jobs"}
              onClick={() => setActiveSection("jobs")}
            />
            <NavItem
              icon={<FileText />}
              label="Applications"
              active={activeSection === "applications"}
              onClick={() => setActiveSection("applications")}
            />
            <NavItem
              icon={<BarChart3 />}
              label="Analytics"
              active={activeSection === "analytics"}
              onClick={() => setActiveSection("analytics")}
            />
            <div className="pt-4 border-t mt-4">
              <NavItem
                icon={<Settings />}
                label="Settings"
                active={activeSection === "settings"}
                onClick={() => setActiveSection("settings")}
              />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="mb-2">Recruitment Dashboard</h2>
              <p className="text-muted-foreground">
                Track your hiring pipeline and team performance
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Active Jobs"
                value="47"
                change="+12%"
                trend="up"
                icon={<Briefcase className="h-5 w-5" />}
              />
              <StatsCard
                title="Total Candidates"
                value="2,543"
                change="+23%"
                trend="up"
                icon={<Users className="h-5 w-5" />}
              />
              <StatsCard
                title="Applications"
                value="1,234"
                change="+8%"
                trend="up"
                icon={<FileText className="h-5 w-5" />}
              />
              <StatsCard
                title="Hired This Month"
                value="12"
                change="-2%"
                trend="down"
                icon={<CheckCircle className="h-5 w-5" />}
              />
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Applications */}
                  <Card className="p-6">
                    <h4 className="mb-4">Recent Applications</h4>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <ApplicationItem key={i} />
                      ))}
                    </div>
                  </Card>

                  {/* Upcoming Interviews */}
                  <Card className="p-6">
                    <h4 className="mb-4">Upcoming Interviews</h4>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <InterviewItem key={i} />
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Active Jobs */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4>Active Job Postings</h4>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <JobCard key={i} />
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="pipeline">
                <Card className="p-6">
                  <h4 className="mb-4">Hiring Pipeline Status</h4>
                  <p className="text-muted-foreground">
                    Kanban board integration would go here - see KanbanBoard component
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="p-6">
                  <h4 className="mb-4">Activity Feed</h4>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <ActivityItem key={i} />
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <Badge className="bg-primary-light text-primary border-0">{badge}</Badge>
      )}
    </button>
  );
}

function StatsCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary-light rounded-lg text-primary">{icon}</div>
        <Badge
          className={
            trend === "up"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          }
        >
          {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {change}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </Card>
  );
}

function ApplicationItem() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
      <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
        SJ
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">Sarah Johnson</p>
        <p className="text-xs text-muted-foreground truncate">Senior Frontend Developer</p>
      </div>
      <Badge variant="outline" className="text-xs">New</Badge>
    </div>
  );
}

function InterviewItem() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border">
      <div className="p-2 bg-warning-light rounded-lg">
        <Calendar className="h-4 w-4 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">Michael Chen</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3" />
          Tomorrow at 2:00 PM
        </p>
      </div>
    </div>
  );
}

function JobCard() {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Badge className="bg-success-light text-success border-0">Active</Badge>
        <p className="text-xs text-muted-foreground">24 applicants</p>
      </div>
      <h5 className="font-semibold mb-2">Senior Frontend Developer</h5>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Badge variant="outline" className="text-xs">Remote</Badge>
        <Badge variant="outline" className="text-xs">Full-time</Badge>
      </div>
      <Button variant="outline" size="sm" className="w-full">
        View Applications
      </Button>
    </Card>
  );
}

function ActivityItem() {
  return (
    <div className="flex items-start gap-3 pb-4 border-b last:border-0">
      <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
        <CheckCircle className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">Emma Davis</span> moved to Interview stage
        </p>
        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
      </div>
    </div>
  );
}