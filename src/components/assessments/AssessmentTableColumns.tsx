import { Column } from '@/components/tables/DataTable';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Bell, Download, XCircle } from 'lucide-react';
import { EntityAvatar } from '@/components/tables/EntityAvatar';
import { ReminderStatusIndicator } from './ReminderStatusIndicator';
import type { Assessment } from '@/types/assessment';
import { format } from 'date-fns';

const getStatusBadge = (status: Assessment['status']) => {
  const variants: Record<Assessment['status'], { variant: any; label: string }> = {
    'draft': { variant: 'secondary', label: 'Draft' },
    'pending-invitation': { variant: 'warning', label: 'Pending Invitation' },
    'invited': { variant: 'default', label: 'Invited' },
    'in-progress': { variant: 'default', label: 'In Progress' },
    'completed': { variant: 'success', label: 'Completed' },
    'expired': { variant: 'destructive', label: 'Expired' },
    'cancelled': { variant: 'secondary', label: 'Cancelled' },
  };
  const config = variants[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const createAssessmentTableColumns = (
  onViewDetails: (id: string) => void,
  onSendReminder: (id: string) => void,
  onDownloadReport: (id: string) => void,
  onCancelAssessment: (id: string) => void
): Column<Assessment>[] => [
  {
    key: 'candidateName',
    label: 'Candidate',
    sortable: true,
    render: (assessment) => (
      <div className="flex items-center gap-3">
        <EntityAvatar
          name={assessment.employerName || 'Unknown'}
          src={assessment.employerLogo}
          type="logo"
        />
        <div className="min-w-0 flex-1">
          <Link to={`/candidates/${assessment.candidateId}`}>
            <p className="font-semibold text-base hover:underline cursor-pointer line-clamp-1 block transition-colors duration-500">
              {assessment.candidateName}
            </p>
          </Link>
          {assessment.jobTitle && (
            <Link to={`/jobs/${assessment.jobId}`}>
              <p className="text-sm text-muted-foreground hover:text-foreground hover:underline line-clamp-1 block transition-colors">
                {assessment.jobTitle}
              </p>
            </Link>
          )}
          {assessment.employerName && (
            <Link to={`/employers/${assessment.employerId}`}>
              <p className="text-xs text-muted-foreground hover:text-foreground hover:underline line-clamp-1 block transition-colors">
                {assessment.employerName}
              </p>
            </Link>
          )}
        </div>
      </div>
    )
  },
  {
    key: 'assessmentType',
    label: 'Type',
    sortable: true,
    render: (assessment) => (
      <span className="capitalize transition-colors duration-500">
        {assessment.assessmentType.replace('-', ' ')}
      </span>
    )
  },
  {
    key: 'provider',
    label: 'Provider',
    sortable: true,
    render: (assessment) => (
      <span className="capitalize transition-colors duration-500">
        {assessment.provider}
      </span>
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (assessment) => (
      <div className="space-y-1">
        {getStatusBadge(assessment.status)}
        <ReminderStatusIndicator
          remindersSent={assessment.remindersSent}
          lastReminderDate={assessment.lastReminderDate}
          invitedDate={assessment.invitedDate}
          status={assessment.status}
        />
      </div>
    )
  },
  {
    key: 'overallScore',
    label: 'Score',
    sortable: true,
    render: (assessment) => {
      if (assessment.overallScore) {
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium transition-colors duration-500">
              {assessment.overallScore}%
            </span>
            {assessment.passed !== undefined && (
              <Badge variant={assessment.passed ? 'success' : 'destructive'} className="text-xs">
                {assessment.passed ? 'Pass' : 'Fail'}
              </Badge>
            )}
          </div>
        );
      }
      return <span className="text-muted-foreground transition-colors duration-500">—</span>;
    }
  },
  {
    key: 'invitedDate',
    label: 'Invited Date',
    sortable: true,
    render: (assessment) => (
      <span className="transition-colors duration-500">
        {format(new Date(assessment.invitedDate), 'MMM d, yyyy')}
      </span>
    )
  },
  {
    key: 'actions',
    label: 'Actions',
    width: "80px",
    render: (assessment) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewDetails(assessment.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          {assessment.status !== 'completed' && (
            <DropdownMenuItem onClick={() => onSendReminder(assessment.id)}>
              <Bell className="h-4 w-4 mr-2" />
              Send Reminder
            </DropdownMenuItem>
          )}
          {assessment.status === 'completed' && (
            <DropdownMenuItem onClick={() => onDownloadReport(assessment.id)}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </DropdownMenuItem>
          )}
          {assessment.status !== 'completed' && assessment.status !== 'cancelled' && (
            <DropdownMenuItem onClick={() => onCancelAssessment(assessment.id)}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Assessment
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
];
