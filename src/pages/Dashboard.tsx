import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { HiringTrendsChart } from "@/components/dashboard/charts/HiringTrendsChart";
import { ApplicationFunnelChart } from "@/components/dashboard/charts/ApplicationFunnelChart";
import { JobDistributionChart } from "@/components/dashboard/charts/JobDistributionChart";
import { SourceOfHireChart } from "@/components/dashboard/charts/SourceOfHireChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileText, UserCheck, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentActivities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "submitted an application for",
    target: "Senior Developer",
    time: "5 minutes ago",
    avatar: "SJ",
  },
  {
    id: 2,
    user: "Mike Chen",
    action: "was moved to interview stage for",
    target: "Product Manager",
    time: "1 hour ago",
    avatar: "MC",
  },
  {
    id: 3,
    user: "Emily Davis",
    action: "was hired for",
    target: "UX Designer",
    time: "2 hours ago",
    avatar: "ED",
  },
  {
    id: 4,
    user: "Alex Rodriguez",
    action: "submitted an application for",
    target: "Marketing Specialist",
    time: "3 hours ago",
    avatar: "AR",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John</h1>
        <p className="text-muted-foreground">Here's what's happening with your recruitment today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatCard
          title="Active Jobs"
          value="24"
          change="+12%"
          trend="up"
          icon={Briefcase as any}
        />
        <EnhancedStatCard
          title="Total Candidates"
          value="1,234"
          change="+8%"
          trend="up"
          icon={Users as any}
          variant="success"
        />
        <EnhancedStatCard
          title="Applications"
          value="567"
          change="+23%"
          trend="up"
          icon={FileText as any}
          variant="primary"
        />
        <EnhancedStatCard
          title="Hired This Month"
          value="18"
          change="+5%"
          trend="up"
          icon={UserCheck as any}
          variant="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <HiringTrendsChart />
        <ApplicationFunnelChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <JobDistributionChart />
        <SourceOfHireChart />
      </div>

      {/* Recent Activity */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/avatar-${activity.id}.jpg`} alt={activity.user} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
