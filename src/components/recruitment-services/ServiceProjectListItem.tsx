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
        <div className="flex items-center gap-0">
          {/* Column 1: Type & Priority - Fixed 200px */}
          <div className="w-[200px] flex-shrink-0 flex items-center gap-2 pr-4">
            <ServiceTypeBadge type={project.serviceType} />
            <PriorityIndicator priority={project.priority} />
          </div>

          {/* Column 2: Project & Client - Fixed 300px */}
          <div className="w-[300px] flex-shrink-0 pr-4">
            <h3 className="font-semibold text-base line-clamp-1">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{project.clientName}</p>
          </div>

          {/* Column 3: Team & Metrics - Fixed 400px */}
          <div className="hidden lg:flex w-[400px] flex-shrink-0 items-center gap-4 pr-4">
            {/* Consultant avatars - Fixed width */}
            <div className="flex -space-x-2 w-[100px] flex-shrink-0">
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

            {/* Metrics - Flex fill remaining space */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-1 min-w-0">
              <span className="whitespace-nowrap">{project.candidatesShortlisted} cand</span>
              <span className="whitespace-nowrap">{project.positionsFilled}/{project.targetPositions} pos</span>
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

          {/* Column 4: Progress - Fixed 120px */}
          <div className="hidden md:block w-[120px] flex-shrink-0 pr-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1.5" />
          </div>

          {/* Column 5: Status - Fixed 100px */}
          <div className="w-[100px] flex-shrink-0 pr-4">
            <ServiceStatusBadge status={project.status} />
          </div>

          {/* Column 6: Actions - Fixed 120px */}
          <div className="w-[120px] flex-shrink-0 flex items-center gap-1 justify-end">
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
      </CardContent>
    </Card>
  );
}
