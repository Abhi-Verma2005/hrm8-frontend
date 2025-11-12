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
import { MoreHorizontal, Eye, Bell, Download, XCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Assessment } from '@/types/assessment';
import { format } from 'date-fns';
import { ReminderStatusIndicator } from './ReminderStatusIndicator';
import { EntityAvatar } from '@/components/tables/EntityAvatar';

type SortColumn = 'candidateName' | 'assessmentType' | 'provider' | 'status' | 'score' | 'invitedDate';
type SortDirection = 'asc' | 'desc' | null;

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const sortedAssessments = useMemo(() => {
    if (!sortColumn || !sortDirection) return assessments;

    return [...assessments].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'candidateName':
          aValue = a.candidateName.toLowerCase();
          bValue = b.candidateName.toLowerCase();
          break;
        case 'assessmentType':
          aValue = a.assessmentType;
          bValue = b.assessmentType;
          break;
        case 'provider':
          aValue = a.provider;
          bValue = b.provider;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'score':
          aValue = a.overallScore ?? -1;
          bValue = b.overallScore ?? -1;
          break;
        case 'invitedDate':
          aValue = new Date(a.invitedDate).getTime();
          bValue = new Date(b.invitedDate).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [assessments, sortColumn, sortDirection]);

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
              <TableHead className="w-[35%]">
                <button 
                  onClick={() => handleSort('candidateName')}
                  className="flex items-center hover:text-foreground transition-colors font-medium"
                >
                  Candidate
                  {getSortIcon('candidateName')}
                </button>
              </TableHead>
              <TableHead className="w-[12%]">
                <button 
                  onClick={() => handleSort('assessmentType')}
                  className="flex items-center hover:text-foreground transition-colors font-medium"
                >
                  Type
                  {getSortIcon('assessmentType')}
                </button>
              </TableHead>
              <TableHead className="w-[12%]">
                <button 
                  onClick={() => handleSort('provider')}
                  className="flex items-center hover:text-foreground transition-colors font-medium"
                >
                  Provider
                  {getSortIcon('provider')}
                </button>
              </TableHead>
              <TableHead className="w-[10%]">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center hover:text-foreground transition-colors font-medium"
                >
                  Status
                  {getSortIcon('status')}
                </button>
              </TableHead>
              <TableHead className="w-[8%]">
                <button 
                  onClick={() => handleSort('score')}
                  className="flex items-center hover:text-foreground transition-colors font-medium"
                >
                  Score
                  {getSortIcon('score')}
                </button>
              </TableHead>
              <TableHead className="w-[12%]">
                <button 
                  onClick={() => handleSort('invitedDate')}
                  className="flex items-center hover:text-foreground transition-colors font-medium"
                >
                  Invited Date
                  {getSortIcon('invitedDate')}
                </button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(assessment.id)}
                    onCheckedChange={() => toggleSelection(assessment.id)}
                  />
                </TableCell>
                <TableCell>
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
