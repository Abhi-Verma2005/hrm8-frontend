import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import type { Commission, CommissionPayment } from "@/types/commission";
import { format } from "date-fns";

interface PaymentHistoryExportProps {
  commissions: Commission[];
  payments?: CommissionPayment[];
  consultantName?: string;
}

export function PaymentHistoryExport({ 
  commissions, 
  payments = [],
  consultantName = "Consultant" 
}: PaymentHistoryExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      // Prepare CSV data
      const headers = [
        'Date',
        'Description',
        'Entity Type',
        'Entity Name',
        'Base Amount',
        'Commission Rate',
        'Commission Amount',
        'Status',
        'Payment Date',
        'Payment Method',
        'Payment Reference',
      ];

      const rows = commissions.map(commission => [
        format(new Date(commission.earnedDate), 'yyyy-MM-dd'),
        commission.description || '',
        commission.entityType,
        commission.entityName || '',
        commission.baseAmount.toFixed(2),
        `${commission.commissionRate}%`,
        commission.commissionAmount.toFixed(2),
        commission.status,
        commission.paymentDate ? format(new Date(commission.paymentDate), 'yyyy-MM-dd') : '',
        commission.paymentMethod || '',
        commission.paymentReference || '',
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${consultantName.replace(/\s+/g, '_')}_commissions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();

      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const data = {
        exportDate: new Date().toISOString(),
        consultantName,
        summary: {
          totalCommissions: commissions.length,
          totalEarned: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
          totalPaid: commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0),
          pending: commissions.filter(c => c.status === 'pending').length,
          approved: commissions.filter(c => c.status === 'approved').length,
        },
        commissions: commissions.map(c => ({
          ...c,
          earnedDate: format(new Date(c.earnedDate), 'yyyy-MM-dd'),
          paymentDate: c.paymentDate ? format(new Date(c.paymentDate), 'yyyy-MM-dd') : null,
        })),
        payments: payments.map(p => ({
          ...p,
          paymentDate: format(new Date(p.paymentDate), 'yyyy-MM-dd'),
        })),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${consultantName.replace(/\s+/g, '_')}_commissions_${format(new Date(), 'yyyy-MM-dd')}.json`;
      link.click();

      toast.success("JSON exported successfully");
    } catch (error) {
      toast.error("Failed to export JSON");
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportDetailedReport = () => {
    setIsExporting(true);
    try {
      // Create a detailed text report
      const report = `
COMMISSION REPORT
Generated: ${format(new Date(), 'PPP p')}
Consultant: ${consultantName}

==============================================
SUMMARY
==============================================
Total Commissions: ${commissions.length}
Total Earned: $${commissions.reduce((sum, c) => sum + c.commissionAmount, 0).toLocaleString()}
Total Paid: $${commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0).toLocaleString()}
Pending: ${commissions.filter(c => c.status === 'pending').length}
Approved: ${commissions.filter(c => c.status === 'approved').length}
Disputed: ${commissions.filter(c => c.status === 'disputed').length}

==============================================
COMMISSION DETAILS
==============================================
${commissions.map((c, i) => `
${i + 1}. ${c.description || c.entityName || 'Commission'}
   Date: ${format(new Date(c.earnedDate), 'PPP')}
   Type: ${c.entityType}
   Base Amount: $${c.baseAmount.toLocaleString()}
   Commission Rate: ${c.commissionRate}%
   Commission Amount: $${c.commissionAmount.toLocaleString()}
   Status: ${c.status.toUpperCase()}
   ${c.paymentDate ? `Payment Date: ${format(new Date(c.paymentDate), 'PPP')}` : ''}
   ${c.paymentReference ? `Payment Reference: ${c.paymentReference}` : ''}
   ${c.notes ? `Notes: ${c.notes}` : ''}
`).join('\n')}

==============================================
PAYMENT HISTORY
==============================================
${payments.length > 0 ? payments.map((p, i) => `
${i + 1}. Payment #${p.id}
   Date: ${format(new Date(p.paymentDate), 'PPP')}
   Amount: $${p.amount.toLocaleString()}
   Method: ${p.method}
   Reference: ${p.reference}
   Status: ${p.status.toUpperCase()}
   Commissions Included: ${p.commissionIds.length}
`).join('\n') : 'No payments recorded'}
`;

      const blob = new Blob([report], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${consultantName.replace(/\s+/g, '_')}_report_${format(new Date(), 'yyyy-MM-dd')}.txt`;
      link.click();

      toast.success("Detailed report exported");
    } catch (error) {
      toast.error("Failed to export report");
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting || commissions.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV}>
          <Table className="mr-2 h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Export as JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportDetailedReport}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Detailed Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
