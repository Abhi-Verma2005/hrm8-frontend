import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Target, Plus } from 'lucide-react';
import { getConsultantPlans } from '@/lib/skillsStorage';
import { format } from 'date-fns';

interface DevelopmentPlansProps {
  consultantId: string;
  consultantName: string;
}

export function DevelopmentPlans({ consultantId }: DevelopmentPlansProps) {
  const plans = getConsultantPlans(consultantId);

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Development Plans</h3>
          <p className="text-muted-foreground text-center mb-4">
            Create a development plan to track skill development progress
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {plans.map(plan => (
        <Card key={plan.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{plan.title}</h3>
                  <Badge variant={getStatusColor(plan.status)}>{plan.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold">{plan.completionPercentage}%</span>
              </div>
              <Progress value={plan.completionPercentage} />
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Start:</span>
                <span className="font-medium">{format(new Date(plan.startDate), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">End:</span>
                <span className="font-medium">{format(new Date(plan.endDate), 'MMM dd, yyyy')}</span>
              </div>
            </div>

            {/* Goals */}
            {plan.goals.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Goals:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {plan.goals.map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Development Actions</h4>
                <Badge variant="outline">
                  {plan.actions.filter(a => a.status === 'completed').length} / {plan.actions.length}
                </Badge>
              </div>
              {plan.actions.map(action => (
                <div key={action.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{action.type}</div>
                  </div>
                  <Badge variant={action.status === 'completed' ? 'default' : 'outline'}>
                    {action.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Manager */}
            {plan.managerName && (
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                Managed by {plan.managerName}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
