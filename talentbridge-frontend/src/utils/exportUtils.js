// src/utils/exportUtils.js
export const exportToCSV = (data, filename = 'talentbridge_export.csv') => {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }

  const keys = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(keys.join(','));

  // Add data rows
  for (const row of data) {
    const values = keys.map(key => {
      const val = row[key] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  // Create download link
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};