import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { HiringTrendsChart } from "@/components/dashboard/charts/HiringTrendsChart";
import { ApplicationFunnelChart } from "@/components/dashboard/charts/ApplicationFunnelChart";
import { JobDistributionChart } from "@/components/dashboard/charts/JobDistributionChart";
import { SourceOfHireChart } from "@/components/dashboard/charts/SourceOfHireChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileText, UserCheck, Clock, Calendar, Download, Filter, Eye, Mail, MoreVertical, Plus, XCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

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
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's what's happening with your recruitment today</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarPicker mode="range" selected={dateRange} onSelect={setDateRange} />
            </PopoverContent>
          </Popover>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatCard
          title="Active Jobs"
          value="24"
          change="+12%"
          trend="up"
          icon={<Briefcase className="h-6 w-6" />}
          showAction={true}
          actionLabel="View Jobs"
          onAction={() => navigate('/jobs')}
          showMenu={true}
          menuItems={[
            {
              label: "View all jobs",
              icon: <Eye className="h-4 w-4" />,
              onClick: () => navigate('/jobs'),
            },
            {
              label: "Create new job",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => navigate('/jobs'),
            },
            {
              label: "Filter by department",
              icon: <Filter className="h-4 w-4" />,
              onClick: () => console.log('Open filter'),
            },
            {
              label: "Export to CSV",
              icon: <Download className="h-4 w-4" />,
              onClick: () => console.log('Export jobs'),
            },
          ]}
        />
        <EnhancedStatCard
          title="Total Candidates"
          value="1,234"
          change="+8%"
          trend="up"
          icon={<Users className="h-6 w-6" />}
          variant="success"
          showAction={true}
          actionLabel="View All"
          onAction={() => navigate('/candidates')}
          showMenu={true}
          menuItems={[
            {
              label: "Browse candidates",
              icon: <Users className="h-4 w-4" />,
              onClick: () => navigate('/candidates'),
            },
            {
              label: "Add candidate",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => navigate('/candidates'),
            },
            {
              label: "Filter by skills",
              icon: <Filter className="h-4 w-4" />,
              onClick: () => console.log('Open filter'),
            },
            {
              label: "Export list",
              icon: <Download className="h-4 w-4" />,
              onClick: () => console.log('Export candidates'),
            },
          ]}
        />
        <EnhancedStatCard
          title="Applications"
          value="567"
          change="+23%"
          trend="up"
          icon={<FileText className="h-6 w-6" />}
          variant="primary"
          showAction={true}
          actionLabel="Review"
          onAction={() => navigate('/applications')}
          showMenu={true}
          menuItems={[
            {
              label: "Review pending",
              icon: <FileText className="h-4 w-4" />,
              onClick: () => navigate('/applications'),
            },
            {
              label: "View rejected",
              icon: <XCircle className="h-4 w-4" />,
              onClick: () => navigate('/applications'),
            },
            {
              label: "Filter by date",
              icon: <Calendar className="h-4 w-4" />,
              onClick: () => console.log('Open date filter'),
            },
            {
              label: "Export data",
              icon: <Download className="h-4 w-4" />,
              onClick: () => console.log('Export applications'),
            },
          ]}
        />
        <EnhancedStatCard
          title="Hired This Month"
          value="18"
          change="+5%"
          trend="up"
          icon={<UserCheck className="h-6 w-6" />}
          variant="warning"
          showAction={true}
          actionLabel="View Hires"
          onAction={() => navigate('/candidates')}
          showMenu={true}
          menuItems={[
            {
              label: "View hires",
              icon: <UserCheck className="h-4 w-4" />,
              onClick: () => navigate('/candidates'),
            },
            {
              label: "Onboarding status",
              icon: <CheckCircle className="h-4 w-4" />,
              onClick: () => console.log('View onboarding'),
            },
            {
              label: "Monthly report",
              icon: <FileText className="h-4 w-4" />,
              onClick: () => console.log('Generate report'),
            },
            {
              label: "Export hires",
              icon: <Download className="h-4 w-4" />,
              onClick: () => console.log('Export hires'),
            },
          ]}
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                All Activities
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Applications</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Interviews</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Hires</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 group">
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
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button variant="ghost" size="icon-sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <Mail className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            View All Activities
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
