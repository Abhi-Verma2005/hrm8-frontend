import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { Eye, Edit, ListTodo, Calendar, DollarSign } from 'lucide-react';
import type { ServiceProject } from '@/types/recruitmentService';
import { formatRelativeDate } from '@/lib/utils';

interface ServiceProjectListItemProps {
  project: ServiceProject;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onViewTasks: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ServiceProjectListItem({ 
  project, 
  onView, 
  onEdit, 
  onViewTasks 
}: ServiceProjectListItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left section: Type, Priority, Names */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <ServiceTypeBadge type={project.serviceType} />
              <PriorityIndicator priority={project.priority} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base line-clamp-1">{project.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{project.clientName}</p>
            </div>
          </div>

          {/* Middle section: Consultants and metrics */}
          <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
            {/* Consultant avatars */}
            <div className="flex -space-x-2">
              {project.consultants.slice(0, 3).map((consultant) => (
                <Avatar key={consultant.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={consultant.avatar} alt={consultant.name} />
                  <AvatarFallback>{consultant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              ))}
              {project.consultants.length > 3 && (
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback>+{project.consultants.length - 3}</AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Quick metrics */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">{project.candidatesShortlisted} candidates</span>
              <span className="whitespace-nowrap">{project.positionsFilled}/{project.targetPositions} positions</span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <DollarSign className="h-3 w-3" />
                {(project.projectValue / 1000).toFixed(0)}K
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Calendar className="h-3 w-3" />
                {formatRelativeDate(project.deadline)}
              </span>
            </div>
          </div>

          {/* Right section: Progress, Status, Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden md:block w-24">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1.5" />
            </div>

            <ServiceStatusBadge status={project.status} />

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => onView(project.id)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(project.id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onViewTasks(project.id)}>
                <ListTodo className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
