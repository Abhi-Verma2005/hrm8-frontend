import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, DollarSign, Award, FileText, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Consultant } from '@/types/consultant';

interface ConsultantEngagementPanelProps {
  consultant: Consultant;
}

export function ConsultantEngagementPanel({ consultant }: ConsultantEngagementPanelProps) {
  const navigate = useNavigate();

  // Mock recent activity data
  const recentActivities = [
    {
      icon: Award,
      title: 'Placement completed',
      description: 'Senior Developer at TechCorp',
      time: '2 hours ago',
    },
    {
      icon: Users,
      title: 'Client meeting',
      description: 'with Acme Corporation',
      time: '5 hours ago',
    },
    {
      icon: DollarSign,
      title: 'Commission earned',
      description: '$5,200',
      time: '1 day ago',
    },
    {
      icon: Briefcase,
      title: 'New job assignment',
      description: 'Product Manager role',
      time: '2 days ago',
    },
  ];

  // This Month Quick Stats
  const thisMonthStats = {
    placements: Math.floor(consultant.totalPlacements / 12), // Mock
    revenue: Math.floor(consultant.totalRevenue / 12), // Mock
    pendingTasks: 3, // Mock
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Placements</span>
              </div>
              <span className="text-lg font-bold">{thisMonthStats.placements}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Revenue</span>
              </div>
              <span className="text-lg font-bold">${thisMonthStats.revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Pending Tasks</span>
              </div>
              <span className="text-lg font-bold">{thisMonthStats.pendingTasks}</span>
            </div>
          </div>
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
            onClick={() => navigate(`/consultants/${consultant.id}?tab=activity`)}
          >
            View Full History →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
