import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Briefcase, MoreVertical, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AssignmentCardProps {
  type: 'employer' | 'job';
  entityId: string;
  entityName: string;
  role: string;
  isPrimary?: boolean;
  assignedDate: string;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function AssignmentCard({
  type,
  entityId,
  entityName,
  role,
  isPrimary,
  assignedDate,
  onEdit,
  onRemove,
}: AssignmentCardProps) {
  return (
    <Card className="border-muted">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {type === 'employer' ? (
              <Building2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            )}
            <Badge variant="outline" className="text-xs">
              {type === 'employer' ? 'Employer' : 'Job'}
            </Badge>
            {isPrimary && (
              <Badge variant="default" className="text-xs">
                Primary
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={onRemove}>
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link
          to={type === 'employer' ? `/employers/${entityId}` : `/jobs/${entityId}`}
          className="group"
        >
          <h4 className="font-medium mb-1 group-hover:text-primary flex items-center gap-1">
            {entityName}
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
        </Link>

        <p className="text-sm text-muted-foreground mb-2">{role}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Assigned</span>
          <span>{new Date(assignedDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
