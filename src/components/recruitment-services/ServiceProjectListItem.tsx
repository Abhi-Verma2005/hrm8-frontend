import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import { Eye, Edit, ListTodo, Calendar, DollarSign } from 'lucide-react';
import type { ServiceProject } from '@/types/recruitmentService';
import { formatRelativeDate } from '@/lib/utils';
import { getServiceBaseFee, isMonthlyService } from '@/lib/subscriptionConfig';

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
        <div className="flex items-center gap-4">
          {/* Left Edge - Fixed Columns */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Column 1: Type - 200px */}
            <div className="w-[200px] flex-shrink-0 flex items-center gap-2">
              <ServiceTypeBadge type={project.serviceType} />
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

            {/* Column 4: Country - 120px */}
            <div className="hidden xl:block w-[120px] flex-shrink-0">
              <span className="text-sm font-semibold">{project.country}</span>
            </div>

            {/* Column 5: Service Fee - 120px */}
            <div className="hidden lg:block w-[120px] flex-shrink-0">
              <span className="text-sm font-semibold">
                ${getServiceBaseFee(project.serviceType).toLocaleString()}
                {isMonthlyService(project.serviceType) && '/mth'}
              </span>
            </div>

            {/* Column 6: Post Date - 120px */}
            <div className="hidden xl:block w-[120px] flex-shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatRelativeDate(project.startDate)}
              </span>
            </div>
          </div>

          {/* Middle - Flexible Progress Column */}
          <div className="hidden md:flex flex-1 min-w-[120px] max-w-[300px]">
            <div className="w-full">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1.5" />
            </div>
          </div>

          {/* Right Edge - Fixed Columns */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Status - 100px */}
            <div className="w-[100px] flex-shrink-0 flex items-center justify-center">
              <ServiceStatusBadge status={project.status} />
            </div>

            {/* Actions - 120px */}
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
