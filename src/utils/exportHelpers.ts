export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data: any[], title: string) {
  // This is a placeholder for PDF export functionality
  // In a real implementation, you would use a library like jspdf
  console.log('PDF export requested for:', title, data);
  alert('PDF export functionality requires jspdf library. CSV export is available.');
}

export function formatDataForExport(data: any[], fields: string[]) {
  return data.map(item => {
    const formatted: any = {};
    fields.forEach(field => {
      formatted[field] = item[field];
    });
    return formatted;
  });
}
