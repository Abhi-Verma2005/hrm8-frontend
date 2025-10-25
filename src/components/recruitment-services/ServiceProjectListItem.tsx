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
          {/* Left group: Type, Project, Individual Metrics */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Column 1: Type & Priority - 200px */}
            <div className="w-[200px] flex-shrink-0 flex items-center gap-2">
              <ServiceTypeBadge type={project.serviceType} />
              <PriorityIndicator priority={project.priority} />
            </div>

            {/* Column 2: Project & Client - 300px */}
            <div className="w-[300px] flex-shrink-0">
              <h3 className="font-semibold text-base line-clamp-1">{project.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{project.clientName}</p>
            </div>

            {/* Column 3: Team - 120px */}
            <div className="hidden xl:flex w-[120px] flex-shrink-0 -space-x-2">
              {project.consultants.slice(0, 3).map((consultant) => (
                <Avatar key={consultant.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={consultant.avatar} alt={consultant.name} />
                  <AvatarFallback className="text-xs">
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.consultants.length > 3 && (
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs">+{project.consultants.length - 3}</AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Column 4: Candidates - 100px */}
            <div className="hidden lg:block w-[100px] flex-shrink-0">
              <span className="text-sm font-semibold">{project.candidatesShortlisted}</span>
            </div>

            {/* Column 5: Positions - 100px */}
            <div className="hidden lg:block w-[100px] flex-shrink-0">
              <span className="text-sm font-semibold">
                {project.positionsFilled}/{project.targetPositions}
              </span>
            </div>

            {/* Column 6: Service Fee - 100px */}
            <div className="hidden lg:block w-[100px] flex-shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {(project.projectValue / 1000).toFixed(0)}K
              </span>
            </div>

            {/* Column 7: Post Date - 120px */}
            <div className="hidden xl:block w-[120px] flex-shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatRelativeDate(project.startDate)}
              </span>
            </div>
          </div>

          {/* Right group: Progress, Status, Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Column 8: Progress - Flexible */}
            <div className="hidden md:block min-w-[100px] w-full max-w-[200px]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1.5" />
            </div>

            {/* Column 9: Status - 100px */}
            <div className="w-[100px] flex-shrink-0">
              <ServiceStatusBadge status={project.status} />
            </div>

            {/* Column 10: Actions - 120px */}
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
        </div>
      </CardContent>
    </Card>
  );
}
