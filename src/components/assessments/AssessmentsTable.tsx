import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Download, XCircle } from 'lucide-react';
import type { Assessment } from '@/types/assessment';
import { DataTable } from '@/components/tables/DataTable';
import { createAssessmentTableColumns } from './AssessmentTableColumns';

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

  const columns = createAssessmentTableColumns(
    onViewDetails,
    onSendReminder,
    onDownloadReport,
    onCancelAssessment
  );

  const handleSelectedRowsChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

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

      <DataTable
        data={assessments}
        columns={columns}
        selectable
        searchable={false}
        onSelectedRowsChange={handleSelectedRowsChange}
        emptyMessage="No assessments found matching your criteria"
        tableId="assessments"
        resizable
      />
    </div>
  );
}
