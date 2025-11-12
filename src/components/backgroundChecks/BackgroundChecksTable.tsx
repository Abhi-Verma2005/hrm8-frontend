import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, FileText, Mail, Ban, Download, X, Send, FileDown, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { getCheckTypeIcon, getCheckProgress } from '@/lib/backgroundChecks/checkTypeHelpers';
import type { BackgroundCheck, BackgroundCheckType } from '@/types/backgroundCheck';
import { EntityAvatar } from '@/components/tables/EntityAvatar';

interface BackgroundChecksTableProps {
  checks: BackgroundCheck[];
  onViewDetails?: (checkId: string) => void;
  onViewConsent?: (checkId: string) => void;
  onViewReferees?: (checkId: string) => void;
  onDownloadReport?: (checkId: string) => void;
  onSendReminder?: (checkId: string) => void;
  onCancelCheck?: (checkId: string) => void;
}

export function BackgroundChecksTable({
  checks,
  onViewDetails,
  onViewConsent,
  onViewReferees,
  onDownloadReport,
  onSendReminder,
  onCancelCheck,
}: BackgroundChecksTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const handleViewDetails = (checkId: string) => {
    if (onViewDetails) {
      onViewDetails(checkId);
    } else {
      navigate(`/background-checks/${checkId}`);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(checks.map(c => c.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (checkId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, checkId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== checkId));
    }
  };

  const handleBulkSendReminders = () => {
    const pendingChecks = checks.filter(
      c => selectedRows.includes(c.id) && c.status === 'pending-consent'
    );
    
    if (pendingChecks.length === 0) {
      toast({
        title: "No eligible checks",
        description: "Selected checks must be in 'pending consent' status to send reminders.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending reminders
    pendingChecks.forEach(check => {
      if (onSendReminder) {
        onSendReminder(check.id);
      }
    });

    toast({
      title: "Reminders sent",
      description: `Successfully sent ${pendingChecks.length} reminder email(s).`,
    });

    setSelectedRows([]);
  };

  const handleBulkExport = () => {
    const completedChecks = checks.filter(
      c => selectedRows.includes(c.id) && c.status === 'completed'
    );
    
    if (completedChecks.length === 0) {
      toast({
        title: "No completed checks",
        description: "Only completed checks can be exported.",
        variant: "destructive",
      });
      return;
    }

    // Simulate bulk export
    toast({
      title: "Export started",
      description: `Preparing to download ${completedChecks.length} report(s)...`,
    });

    completedChecks.forEach(check => {
      if (onDownloadReport) {
        setTimeout(() => onDownloadReport(check.id), 100);
      }
    });

    setSelectedRows([]);
  };

  const handleBulkCancel = () => {
    const eligibleChecks = checks.filter(
      c => selectedRows.includes(c.id) && 
      c.status !== 'completed' && 
      c.status !== 'cancelled'
    );
    
    if (eligibleChecks.length === 0) {
      toast({
        title: "No eligible checks",
        description: "Selected checks must not be completed or already cancelled.",
        variant: "destructive",
      });
      return;
    }

    // Simulate bulk cancel
    eligibleChecks.forEach(check => {
      if (onCancelCheck) {
        onCancelCheck(check.id);
      }
    });

    toast({
      title: "Checks cancelled",
      description: `Successfully cancelled ${eligibleChecks.length} background check(s).`,
    });

    setSelectedRows([]);
  };

  const handleBulkStatusUpdate = (newStatus: BackgroundCheck['status']) => {
    const eligibleChecks = checks.filter(c => selectedRows.includes(c.id));
    
    if (eligibleChecks.length === 0) {
      toast({
        title: "No checks selected",
        description: "Please select at least one check to update.",
        variant: "destructive",
      });
      return;
    }

    // Simulate bulk status update
    toast({
      title: "Status updated",
      description: `Updated status for ${eligibleChecks.length} check(s) to '${newStatus}'.`,
    });

    setSelectedRows([]);
  };

  const clearSelection = () => {
    setSelectedRows([]);
  };
  
  const getStatusBadge = (status: BackgroundCheck['status']) => {
    const variants: Record<BackgroundCheck['status'], any> = {
      'not-started': 'outline',
      'pending-consent': 'secondary',
      'in-progress': 'default',
      'completed': 'default',
      'issues-found': 'destructive',
      'cancelled': 'outline',
    };

    const colors: Record<BackgroundCheck['status'], string> = {
      'not-started': '',
      'pending-consent': 'bg-yellow-500 text-yellow-50',
      'in-progress': 'bg-blue-500 text-blue-50',
      'completed': 'bg-green-600 text-green-50',
      'issues-found': '',
      'cancelled': '',
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.replace(/-/g, ' ')}
      </Badge>
    );
  };

  const getOverallResultBadge = (result?: string) => {
    if (!result) return null;

    const variants: Record<string, any> = {
      clear: 'default',
      conditional: 'secondary',
      'not-clear': 'destructive',
    };

    const colors: Record<string, string> = {
      clear: 'bg-green-600 text-green-50',
      conditional: 'bg-yellow-500 text-yellow-50',
      'not-clear': 'bg-red-600 text-red-50',
    };

    return (
      <Badge variant={variants[result]} className={colors[result]}>
        {result === 'clear' ? 'Clear' : result === 'conditional' ? 'Conditional' : 'Not Clear'}
      </Badge>
    );
  };

  const selectedCount = selectedRows.length;
  const allSelected = checks.length > 0 && selectedRows.length === checks.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < checks.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/5 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                {selectedCount} {selectedCount === 1 ? 'check' : 'checks'} selected
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkSendReminders}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send Reminders
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export Reports
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Change Status To</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate('in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate('issues-found')}>
                  Issues Found
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleBulkCancel}
                  className="text-destructive"
                >
                  Cancel Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[35%]">Candidate</TableHead>
              <TableHead className="w-[18%]">Check Types</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%]">Progress</TableHead>
              <TableHead className="w-[8%]">Result</TableHead>
              <TableHead className="w-[10%]">Initiated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 opacity-50" />
                    <p className="font-medium">No background checks found</p>
                    <p className="text-sm">Try adjusting your filters or initiate a new check</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              checks.map((check) => (
                <TableRow 
                  key={check.id}
                  className={selectedRows.includes(check.id) ? 'bg-muted/50' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(check.id)}
                      onCheckedChange={(checked) => handleSelectRow(check.id, checked as boolean)}
                      aria-label={`Select ${check.candidateName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <EntityAvatar
                        name={check.employerName || 'Unknown'}
                        src={check.employerLogo}
                        type="logo"
                      />
                      <div className="min-w-0 flex-1">
                        <Link to={`/candidates/${check.candidateId}`}>
                          <p className="font-semibold text-base hover:underline cursor-pointer line-clamp-1 block transition-colors duration-500">
                            {check.candidateName}
                          </p>
                        </Link>
                        {check.jobTitle && (
                          <Link to={`/jobs/${check.jobId}`}>
                            <p className="text-sm text-muted-foreground hover:text-foreground hover:underline line-clamp-1 block transition-colors">
                              {check.jobTitle}
                            </p>
                          </Link>
                        )}
                        {check.employerName && (
                          <Link to={`/employers/${check.employerId}`}>
                            <p className="text-xs text-muted-foreground hover:text-foreground hover:underline line-clamp-1 block transition-colors">
                              {check.employerName}
                            </p>
                          </Link>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {check.checkTypes.map((ct, idx) => {
                        const CheckIcon = getCheckTypeIcon(ct.type as BackgroundCheckType);
                        return (
                          <Badge key={idx} variant="outline" className="text-xs gap-1">
                            <CheckIcon className="h-3 w-3" />
                            {ct.type === 'reference' ? 'Reference' :
                             ct.type === 'criminal' ? 'Criminal' :
                             ct.type === 'identity' ? 'Identity' :
                             ct.type === 'education' ? 'Qualification' :
                             ct.type.charAt(0).toUpperCase() + ct.type.slice(1)}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(check.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={getCheckProgress(check)} className="h-2 w-20" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {getCheckProgress(check)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {check.status === 'completed' && getOverallResultBadge(check.overallStatus)}
                    {check.status !== 'completed' && (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{check.initiatedByName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(check.initiatedDate), { addSuffix: true })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(check.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewConsent?.(check.id)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Consent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewReferees?.(check.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Referees
                      </DropdownMenuItem>
                      {check.status === 'completed' && (
                        <DropdownMenuItem onClick={() => onDownloadReport?.(check.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </DropdownMenuItem>
                      )}
                      {check.status === 'pending-consent' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onSendReminder?.(check.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                        </>
                      )}
                      {check.status !== 'completed' && check.status !== 'cancelled' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onCancelCheck?.(check.id)}
                            className="text-destructive"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Cancel Check
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
