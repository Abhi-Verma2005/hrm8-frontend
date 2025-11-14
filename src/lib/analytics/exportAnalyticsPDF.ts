import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { 
  FunnelMetrics, 
  TimeToHireMetrics, 
  SourceEffectivenessMetrics, 
  TeamPerformanceMetrics 
} from './recruitmentMetrics';

export interface AnalyticsExportData {
  overallMetrics: {
    total: number;
    active: number;
    hired: number;
    rejected: number;
    hireRate: number;
    rejectionRate: number;
    avgAIScore: number;
  };
  funnelMetrics: FunnelMetrics[];
  timeToHireMetrics: TimeToHireMetrics;
  sourceMetrics: SourceEffectivenessMetrics[];
  teamMetrics: TeamPerformanceMetrics[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  selectedJob?: string;
}

export function exportAnalyticsPDF(data: AnalyticsExportData): void {
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text('Recruitment Analytics Report', 105, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 105, yPos, { align: 'center' });
  
  if (data.dateRange?.from && data.dateRange?.to) {
    yPos += 5;
    doc.text(
      `Report Period: ${format(data.dateRange.from, 'MMM dd, yyyy')} - ${format(data.dateRange.to, 'MMM dd, yyyy')}`,
      105,
      yPos,
      { align: 'center' }
    );
  }

  doc.setTextColor(0, 0, 0);
  yPos += 15;

  // Overall Metrics Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Performance Indicators', 20, yPos);
  yPos += 8;

  const kpiData = [
    ['Total Applications', data.overallMetrics.total.toString()],
    ['Hired', data.overallMetrics.hired.toString()],
    ['Rejected', data.overallMetrics.rejected.toString()],
    ['Active Applications', data.overallMetrics.active.toString()],
    ['Hire Rate', `${data.overallMetrics.hireRate.toFixed(1)}%`],
    ['Rejection Rate', `${data.overallMetrics.rejectionRate.toFixed(1)}%`],
    ['Average AI Match Score', `${data.overallMetrics.avgAIScore}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    body: kpiData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 60, halign: 'right' }
    },
    margin: { left: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Recruitment Funnel
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recruitment Funnel Analysis', 20, yPos);
  yPos += 8;

  const funnelTableData = data.funnelMetrics.map(metric => [
    metric.stage,
    metric.count.toString(),
    `${metric.percentage.toFixed(1)}%`,
    `${metric.conversionRate.toFixed(1)}%`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Stage', 'Count', 'Percentage', 'Conversion Rate']],
    body: funnelTableData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
    styles: { fontSize: 9 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Time to Hire Analysis
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Time to Hire Analysis', 20, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Overall Average: ${data.timeToHireMetrics.averageDays} days`, 20, yPos);
  doc.text(`Median: ${data.timeToHireMetrics.medianDays} days`, 120, yPos);
  yPos += 10;

  const timeToHireTableData = data.timeToHireMetrics.byStage.map(stage => [
    stage.stage,
    `${stage.averageDays} days`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Stage', 'Average Duration']],
    body: timeToHireTableData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
    styles: { fontSize: 9 },
    columnStyles: {
      1: { halign: 'right' }
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Source Effectiveness
  doc.addPage();
  yPos = 20;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Source Effectiveness', 20, yPos);
  yPos += 8;

  const sourceTableData = data.sourceMetrics.map(source => [
    source.source,
    source.totalApplications.toString(),
    source.hiredCount.toString(),
    `${source.conversionRate.toFixed(1)}%`,
    `${source.averageTimeToHire} days`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Source', 'Applications', 'Hires', 'Conversion Rate', 'Avg Time to Hire']],
    body: sourceTableData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
    styles: { fontSize: 9 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Team Performance
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Hiring Team Performance', 20, yPos);
  yPos += 8;

  const teamTableData = data.teamMetrics.map(member => [
    member.teamMember,
    member.applicationsReviewed.toString(),
    member.interviewsConducted.toString(),
    member.offersExtended.toString(),
    member.hires.toString(),
    `${member.averageTimeToReview.toFixed(1)} hrs`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Team Member', 'Apps Reviewed', 'Interviews', 'Offers', 'Hires', 'Avg Review Time']],
    body: teamTableData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
    styles: { fontSize: 8 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    },
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
    doc.text('Recruitment Analytics Report - Confidential', 105, 292, { align: 'center' });
  }

  // Download
  const filename = `Recruitment_Analytics_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(filename);
}
