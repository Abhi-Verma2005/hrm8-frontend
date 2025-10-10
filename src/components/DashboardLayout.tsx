import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { HiringTrendsChart } from "@/components/dashboard/charts/HiringTrendsChart";
import { ApplicationFunnelChart } from "@/components/dashboard/charts/ApplicationFunnelChart";
import { JobDistributionChart } from "@/components/dashboard/charts/JobDistributionChart";
import { SourceOfHireChart } from "@/components/dashboard/charts/SourceOfHireChart";
import {
  Briefcase,
  Users,
  FileText,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react";

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          <DashboardHeader />
          
          <main className="flex-1 p-6 space-y-6 bg-gradient-soft">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Page Header */}
              <div>
                <h2 className="mb-2">Recruitment Dashboard</h2>
                <p className="text-muted-foreground">
                  Track your hiring pipeline and team performance
                </p>
              </div>

              {/* KPI Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <EnhancedStatCard
                  title="Active Jobs"
                  value="47"
                  change="+12%"
                  trend="up"
                  icon={<Briefcase className="h-5 w-5" />}
                  variant="primary"
                />
                <EnhancedStatCard
                  title="Total Candidates"
                  value="2,543"
                  change="+23%"
                  trend="up"
                  icon={<Users className="h-5 w-5" />}
                  variant="success"
                />
                <EnhancedStatCard
                  title="Applications"
                  value="1,234"
                  change="+8%"
                  trend="up"
                  icon={<FileText className="h-5 w-5" />}
                  variant="warning"
                />
                <EnhancedStatCard
                  title="Hired This Month"
                  value="12"
                  change="-2%"
                  trend="down"
                  icon={<CheckCircle className="h-5 w-5" />}
                  variant="neutral"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HiringTrendsChart />
                <ApplicationFunnelChart />
              </div>

              {/* Content Tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Applications */}
                    <Card className="lg:col-span-2 p-6 shadow-md">
                      <h4 className="mb-4">Recent Applications</h4>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <ApplicationItem key={i} />
                        ))}
                      </div>
                    </Card>

                    {/* Upcoming Interviews */}
                    <Card className="p-6 shadow-md">
                      <h4 className="mb-4">Upcoming Interviews</h4>
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <InterviewItem key={i} />
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Active Jobs */}
                  <Card className="p-6 shadow-md">
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

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <JobDistributionChart />
                    <SourceOfHireChart />
                  </div>
                </TabsContent>

                <TabsContent value="activity">
                  <Card className="p-6 shadow-md">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function ApplicationItem() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-md">
        SJ
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">Sarah Johnson</p>
        <p className="text-xs text-muted-foreground truncate">Senior Frontend Developer</p>
      </div>
      <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">New</Badge>
    </div>
  );
}

function InterviewItem() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-warning/20 bg-warning/5">
      <div className="p-2 bg-gradient-to-br from-warning to-warning/80 rounded-lg text-white shadow-md">
        <Calendar className="h-4 w-4" />
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
    <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-l-4 border-l-success bg-gradient-to-br from-success/5 to-transparent">
      <div className="flex items-start justify-between mb-3">
        <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
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
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-md">
        <CheckCircle className="h-4 w-4 text-white" />
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
