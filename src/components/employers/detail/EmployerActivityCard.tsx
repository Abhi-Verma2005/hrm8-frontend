import { Employer } from "@/types/entities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Briefcase, Users, DollarSign } from "lucide-react";
import { MetricBox } from "./shared/MetricBox";
import { StatRow } from "./shared/StatRow";
import { ActivityItem } from "./shared/ActivityItem";
import { formatRelativeDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface EmployerMetrics {
  daysAsCustomer: number;
  lastActivityDate: Date;
  activeJobs: number;
  totalJobs: number;
  activeUsers: number;
  totalUsers: number;
}

interface EmployerActivityCardProps {
  employer: Employer;
  metrics: EmployerMetrics;
}

export function EmployerActivityCard({ employer, metrics }: EmployerActivityCardProps) {
  const navigate = useNavigate();

  // Mock activity items - in real app, fetch from activity service
  const recentActivities = [
    { icon: Briefcase, text: 'Posted new job: Senior Developer', time: '2 hours ago' },
    { icon: Users, text: 'Added new user: John Doe', time: '1 day ago' },
    { icon: DollarSign, text: 'Payment processed: $199', time: '2 days ago' },
  ];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          <CardTitle>Activity & Metrics</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <MetricBox
            icon={Calendar}
            label="Customer Since"
            value={`${metrics.daysAsCustomer} days`}
            sublabel={formatDate(employer.createdAt)}
          />
          <MetricBox
            icon={Activity}
            label="Last Activity"
            value={formatRelativeDate(metrics.lastActivityDate)}
            sublabel="Recent"
          />
        </div>
        
        <Separator />
        
        {/* Engagement Stats */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Engagement</h4>
          <div className="space-y-3">
            <StatRow
              icon={Briefcase}
              label="Jobs"
              active={metrics.activeJobs}
              total={metrics.totalJobs}
            />
            <StatRow
              icon={Users}
              label="Users"
              active={metrics.activeUsers}
              total={metrics.totalUsers}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Recent Activity Timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Recent Activity</h4>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0"
              onClick={() => navigate(`/employers/${employer.id}?tab=activity`)}
            >
              View All →
            </Button>
          </div>
          
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
