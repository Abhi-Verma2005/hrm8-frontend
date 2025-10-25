import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import type { ServiceProject } from '@/types/recruitmentService';
import { Calendar, Users, Target, DollarSign, Eye, Edit, ListTodo, Archive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ServiceProjectCardProps {
  project: ServiceProject;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onViewTasks: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ServiceProjectCard({ project, onView, onEdit, onViewTasks, onArchive }: ServiceProjectCardProps) {
  const deadline = new Date(project.deadline);
  const isOverdue = deadline < new Date() && project.status !== 'completed';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <ServiceTypeBadge type={project.serviceType} />
          <PriorityIndicator priority={project.priority} />
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-lg line-clamp-2">{project.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{project.clientName}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Assigned Consultants */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {project.consultants.slice(0, 3).map((consultant, idx) => (
              <div
                key={consultant.id}
                className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                title={consultant.name}
              >
                {consultant.name.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
          </div>
          {project.consultants.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{project.consultants.length - 3} more
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Status Badge */}
        <div>
          <ServiceStatusBadge status={project.status} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{project.candidatesShortlisted}</p>
              <p className="text-xs text-muted-foreground">Candidates</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{project.positionsFilled}/{project.targetPositions}</p>
              <p className="text-xs text-muted-foreground">Positions</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">${(project.projectValue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Value</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                {formatDistanceToNow(deadline, { addSuffix: true })}
              </p>
              <p className="text-xs text-muted-foreground">Deadline</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onView(project.id)} className="flex-1">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(project.id)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onViewTasks(project.id)}>
          <ListTodo className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
