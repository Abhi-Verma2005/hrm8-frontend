import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Bell, Download, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Assessment } from '@/types/assessment';
import { format } from 'date-fns';
import { ReminderStatusIndicator } from './ReminderStatusIndicator';

interface AssessmentsTableProps {
  assessments: Assessment[];
  onViewDetails: (id: string) => void;
  onSendReminder: (id: string) => void;
  onDownloadReport: (id: string) => void;
  onCancelAssessment: (id: string) => void;
  onBulkSendReminders?: (ids: string[]) => void;
  onBulkExport?: (ids: string[]) => void;
  onBulkCancel?: (ids: string[]) => void;
}

export function AssessmentsTable({
  assessments,
  onViewDetails,
  onSendReminder,
  onDownloadReport,
  onCancelAssessment,
  onBulkSendReminders,
  onBulkExport,
  onBulkCancel,
}: AssessmentsTableProps) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(
      selectedIds.length === assessments.length
        ? []
        : assessments.map(a => a.id)
    );
  };

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

  if (assessments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center transition-[background,border-color,box-shadow,color] duration-500">
        <p className="text-sm text-muted-foreground transition-colors duration-500">
          No assessments found matching your criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted p-3 transition-[background,border-color,box-shadow,color] duration-500">
          <span className="text-sm font-medium transition-colors duration-500">
            {selectedIds.length} selected
          </span>
          {onBulkSendReminders && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkSendReminders(selectedIds)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
          )}
          {onBulkExport && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkExport(selectedIds)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          )}
          {onBulkCancel && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkCancel(selectedIds)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Selected
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border transition-[background,border-color,box-shadow,color] duration-500">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === assessments.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-[20%]">Candidate</TableHead>
              <TableHead className="w-[20%]">Related To</TableHead>
              <TableHead className="w-[12%]">Type</TableHead>
              <TableHead className="w-[12%]">Provider</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[8%]">Score</TableHead>
              <TableHead className="w-[12%]">Invited Date</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(assessment.id)}
                    onCheckedChange={() => toggleSelection(assessment.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p 
                      className="font-medium text-primary hover:underline cursor-pointer transition-colors duration-500"
                      onClick={() => navigate(`/candidates/${assessment.candidateId}`)}
                    >
                      {assessment.candidateName}
                    </p>
                  </div>
                </TableCell>

                {/* Related To Column */}
                <TableCell>
                  {assessment.jobTitle && assessment.employerName ? (
                    <div className="space-y-0.5">
                      <p 
                        className="font-medium text-primary hover:underline cursor-pointer text-sm transition-colors duration-500"
                        onClick={() => navigate(`/jobs/${assessment.jobId}`)}
                      >
                        {assessment.jobTitle}
                      </p>
                      <p 
                        className="text-xs text-muted-foreground hover:underline cursor-pointer transition-colors duration-500"
                        onClick={() => navigate(`/employers/${assessment.employerId}`)}
                      >
                        {assessment.employerName}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground transition-colors duration-500">—</span>
                  )}
                </TableCell>
                <TableCell className="capitalize transition-colors duration-500">
                  {assessment.assessmentType.replace('-', ' ')}
                </TableCell>
                <TableCell className="capitalize transition-colors duration-500">
                  {assessment.provider}
                </TableCell>
                 <TableCell>
                   <div className="space-y-1">
                     {getStatusBadge(assessment.status)}
                     <ReminderStatusIndicator
                       remindersSent={assessment.remindersSent}
                       lastReminderDate={assessment.lastReminderDate}
                       invitedDate={assessment.invitedDate}
                       status={assessment.status}
                     />
                   </div>
                 </TableCell>
                <TableCell>
                  {assessment.overallScore ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium transition-colors duration-500">{assessment.overallScore}%</span>
                      {assessment.passed !== undefined && (
                        <Badge variant={assessment.passed ? 'success' : 'destructive'} className="text-xs">
                          {assessment.passed ? 'Pass' : 'Fail'}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground transition-colors duration-500">—</span>
                  )}
                </TableCell>
                <TableCell className="transition-colors duration-500">
                  {format(new Date(assessment.invitedDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
