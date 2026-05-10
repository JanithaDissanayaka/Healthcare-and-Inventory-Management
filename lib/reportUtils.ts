// lib/reportUtils.ts

export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  // 1. Get headers from the first object keys
  const headers = Object.keys(data[0]);
  
  // 2. Map data to CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => headers.map(header => JSON.stringify(row[header], (_, value) => value === null ? '' : value)).join(','))
  ];

  // 3. Create blob and download
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};