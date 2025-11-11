import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import type { BackgroundCheck } from '@/types/backgroundCheck';

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
    return <Badge variant={variants[status]}>{status.replace(/-/g, ' ')}</Badge>;
  };

  const getProgress = (check: BackgroundCheck): number => {
    if (check.status === 'completed') return 100;
    if (check.status === 'in-progress') return 60;
    if (check.status === 'pending-consent') return 25;
    if (check.status === 'cancelled') return 0;
    return 10;
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
              <TableHead>Candidate</TableHead>
              <TableHead>Check Types</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Initiated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No background checks found
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
                  <div>
                    <p className="font-medium">{check.candidateName}</p>
                    <p className="text-sm text-muted-foreground">{check.candidateId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {check.checkTypes.slice(0, 2).map((ct, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {ct.type.split('-')[0]}
                      </Badge>
                    ))}
                    {check.checkTypes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{check.checkTypes.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{check.provider}</TableCell>
                <TableCell>{getStatusBadge(check.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={getProgress(check)} className="h-2 w-20" />
                    <span className="text-xs text-muted-foreground">{getProgress(check)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{check.initiatedByName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(check.initiatedDate), { addSuffix: true })}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
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
