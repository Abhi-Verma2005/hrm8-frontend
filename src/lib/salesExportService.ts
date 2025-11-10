import { SalesOpportunity } from "@/types/salesOpportunity";
import { SalesCommission } from "@/types/salesCommission";
import * as XLSX from "xlsx";

export type SalesExportFormat = "csv" | "excel";

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

// Export Sales Opportunities
export function exportOpportunities(
  opportunities: SalesOpportunity[],
  format: SalesExportFormat,
  filename: string = "sales-opportunities"
) {
  const data = opportunities.map((opp) => ({
    "Opportunity Name": opp.name,
    "Employer": opp.employerName,
    "Sales Agent": opp.salesAgentName,
    "Type": opp.type,
    "Product Type": opp.productType,
    "Estimated Value": formatCurrency(opp.estimatedValue),
    "Probability": `${opp.probability}%`,
    "Stage": opp.stage,
    "Priority": opp.priority,
    "Lead Source": opp.leadSource,
    "Expected Close Date": formatDate(opp.expectedCloseDate),
    "Created Date": formatDate(opp.createdAt),
    "Next Steps": opp.nextSteps || "N/A",
    "Notes": opp.notes || "N/A",
  }));

  if (format === "csv") {
    exportToCSV(data, filename);
  } else {
    exportToExcel(data, filename, "Opportunities");
  }
}

// Export Sales Commissions
export function exportCommissions(
  commissions: SalesCommission[],
  format: SalesExportFormat,
  filename: string = "sales-commissions"
) {
  const data = commissions.map((comm) => ({
    "Sales Agent": comm.salesAgentName,
    "Opportunity": comm.opportunityName,
    "Employer": comm.employerName,
    "Deal Value": formatCurrency(comm.dealValue),
    "Commission Rate": `${comm.commissionRate}%`,
    "Commission Amount": formatCurrency(comm.commissionAmount),
    "Status": comm.status,
    "Calculated At": formatDate(comm.calculatedAt),
    "Approved At": comm.approvedAt ? formatDate(comm.approvedAt) : "N/A",
    "Paid At": comm.paidAt ? formatDate(comm.paidAt) : "N/A",
    "Payment Method": comm.paymentMethod || "N/A",
    "Notes": comm.notes || "N/A",
  }));

  if (format === "csv") {
    exportToCSV(data, filename);
  } else {
    exportToExcel(data, filename, "Commissions");
  }
}

// Export Forecast Data
export function exportForecast(
  opportunities: SalesOpportunity[],
  format: SalesExportFormat,
  filename: string = "sales-forecast"
) {
  const data = opportunities.map((opp) => ({
    "Opportunity": opp.name,
    "Employer": opp.employerName,
    "Sales Agent": opp.salesAgentName,
    "Estimated Value": formatCurrency(opp.estimatedValue),
    "Weighted Value": formatCurrency(opp.estimatedValue * (opp.probability / 100)),
    "Probability": `${opp.probability}%`,
    "Stage": opp.stage,
    "Expected Close": formatDate(opp.expectedCloseDate),
    "Priority": opp.priority,
  }));

  if (format === "csv") {
    exportToCSV(data, filename);
  } else {
    exportToExcel(data, filename, "Forecast");
  }
}

// Generic CSV Export
function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Handle values that contain commas
        if (typeof value === "string" && (value.includes(",") || value.includes("\n"))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    ),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

// Generic Excel Export
function exportToExcel(data: any[], filename: string, sheetName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-size columns
  const maxWidth = 50;
  const cols = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
  worksheet["!cols"] = cols;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// Helper function to download files
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
