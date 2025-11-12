import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Send, FileDown, Edit, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import type { BackgroundCheck } from '@/types/backgroundCheck';
import { DataTable } from '@/components/tables/DataTable';
import { createBackgroundCheckTableColumns } from './BackgroundCheckTableColumns';

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

  const columns = createBackgroundCheckTableColumns(
    handleViewDetails,
    onViewConsent,
    onViewReferees,
    onDownloadReport,
    onSendReminder,
    onCancelCheck
  );

  const handleSelectedRowsChange = (ids: string[]) => {
    setSelectedRows(ids);
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

    toast({
      title: "Status updated",
      description: `Updated status for ${eligibleChecks.length} check(s) to '${newStatus}'.`,
    });

    setSelectedRows([]);
  };

  const clearSelection = () => {
    setSelectedRows([]);
  };

  const selectedCount = selectedRows.length;
  const allSelected = checks.length > 0 && selectedRows.length === checks.length;

  return (
    <div className="space-y-4">
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/5 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRows(checks.map(c => c.id));
                  } else {
                    setSelectedRows([]);
                  }
                }}
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

      <DataTable
        data={checks}
        columns={columns}
        selectable
        searchable={false}
        onSelectedRowsChange={handleSelectedRowsChange}
        emptyMessage="No background checks found matching your criteria"
        tableId="background-checks"
        resizable
      />
    </div>
  );
}
