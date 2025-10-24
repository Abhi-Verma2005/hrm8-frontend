import { Employer } from "@/types/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Briefcase, DollarSign, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmployerEngagementPanelProps {
  employer: Employer;
}

export function EmployerEngagementPanel({ employer }: EmployerEngagementPanelProps) {
  const navigate = useNavigate();

  // Mock recent activity data
  const recentActivities = [
    {
      icon: Briefcase,
      title: "Posted new job",
      description: "Senior Developer",
      time: "2 hours ago"
    },
    {
      icon: UserPlus,
      title: "Added user",
      description: "John Doe",
      time: "1 day ago"
    },
    {
      icon: DollarSign,
      title: "Payment received",
      description: "$199",
      time: "2 days ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="default" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => navigate('/jobs/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Job for {employer.name}
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => navigate(`/employers/${employer.id}?tab=users`)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => navigate(`/employers/${employer.id}?tab=jobs`)}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            View All Jobs →
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => navigate(`/employers/${employer.id}?tab=billing`)}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            View Billing →
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Button 
            variant="link" 
            className="w-full mt-4" 
            size="sm"
            onClick={() => navigate(`/employers/${employer.id}?tab=activity`)}
          >
            View Full History →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
