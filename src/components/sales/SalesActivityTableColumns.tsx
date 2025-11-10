import { Column } from '@/components/tables/DataTable';
import type { SalesActivity } from '@/types/salesActivity';
import { ActivityTypeBadge } from './ActivityTypeBadge';
import { ActivityOutcomeBadge } from './ActivityOutcomeBadge';
import { Phone, Mail, Users, Presentation, MoreHorizontal, Eye, Edit, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Users,
  demo: Presentation,
  'follow-up': Mail,
  proposal: Presentation,
  other: Users,
};

export function createActivityColumns(): Column<SalesActivity>[] {
  return [
    {
      key: 'subject',
      label: 'Activity',
      sortable: true,
      render: (activity) => {
        const Icon = activityIcons[activity.activityType as keyof typeof activityIcons] || Users;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">{activity.subject}</div>
              <div className="text-sm text-muted-foreground">{activity.salesAgentName}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'employerName',
      label: 'Employer',
      sortable: true,
      render: (activity) => (
        <span className="text-sm">{activity.employerName || '-'}</span>
      ),
    },
    {
      key: 'activityType',
      label: 'Type',
      sortable: true,
      render: (activity) => <ActivityTypeBadge type={activity.activityType as any} />,
    },
    {
      key: 'outcome',
      label: 'Outcome',
      sortable: true,
      render: (activity) => <ActivityOutcomeBadge outcome={activity.outcome as any} />,
    },
    {
      key: 'scheduledAt',
      label: 'Date',
      sortable: true,
      render: (activity) => (
        <span className="text-sm">
          {format(new Date(activity.scheduledAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      render: (activity) => (
        <span className="text-sm">{activity.duration ? `${activity.duration} min` : '-'}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (activity) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Activity
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
