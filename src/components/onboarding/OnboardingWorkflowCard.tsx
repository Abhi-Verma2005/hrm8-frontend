import { OnboardingWorkflow } from "@/types/onboarding";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, User, Building2, ArrowRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface OnboardingWorkflowCardProps {
  workflow: OnboardingWorkflow;
  onUpdate: () => void;
}

export function OnboardingWorkflowCard({ workflow, onUpdate }: OnboardingWorkflowCardProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: OnboardingWorkflow['status']) => {
    const variants: Record<OnboardingWorkflow['status'], { variant: any; label: string }> = {
      'not-started': { variant: 'secondary', label: 'Not Started' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      'completed': { variant: 'outline', label: 'Completed' },
      'overdue': { variant: 'destructive', label: 'Overdue' },
    };
    return variants[status];
  };

  const statusBadge = getStatusBadge(workflow.status);
  const isOverdue = workflow.status === 'overdue';
  const daysUntilDue = Math.ceil((new Date(workflow.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{workflow.employeeName}</h3>
            <p className="text-sm text-muted-foreground">{workflow.jobTitle}</p>
          </div>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{workflow.progress}%</span>
          </div>
          <Progress value={workflow.progress} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{workflow.department}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{workflow.assignedToName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Start: {format(new Date(workflow.startDate), 'MMM d, yyyy')}</span>
          </div>
          
          <div className={`flex items-center gap-2 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isOverdue && <AlertCircle className="h-4 w-4" />}
            <Calendar className="h-4 w-4" />
            <span>
              Due: {format(new Date(workflow.dueDate), 'MMM d, yyyy')}
              {!isOverdue && daysUntilDue >= 0 && ` (${daysUntilDue} days)`}
              {isOverdue && ` (${Math.abs(daysUntilDue)} days overdue)`}
            </span>
          </div>
        </div>

        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate(`/onboarding/${workflow.id}`)}
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
