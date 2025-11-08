/**
 * Export utilities for downloading data in various formats
 */

export function downloadJSON(data: any[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
}

export function downloadCSV(data: any[], filename: string, headers?: string[]) {
  if (!data.length) return;
  
  const keys = headers || Object.keys(data[0]);
  const csvContent = [
    keys.join(','),
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        // Handle complex values
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportConsultantsToCSV(consultants: any[]) {
  const headers = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'type',
    'status',
    'employmentType',
    'location',
    'specialization',
    'yearsOfExperience',
    'totalPlacements',
    'totalRevenue',
    'successRate',
  ];
  
  const exportData = consultants.map(c => ({
    ...c,
    specialization: Array.isArray(c.specialization) ? c.specialization.join('; ') : c.specialization,
  }));
  
  downloadCSV(exportData, 'consultants_export', headers);
}

export function exportEmployersToCSV(employers: any[]) {
  const headers = [
    'name',
    'industry',
    'location',
    'status',
    'accountType',
    'subscriptionTier',
    'email',
    'website',
    'companySize',
    'activeJobs',
    'currentUsers',
    'monthlySubscriptionFee',
  ];
  
  downloadCSV(employers, 'employers_export', headers);
}
