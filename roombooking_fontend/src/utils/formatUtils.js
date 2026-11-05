export function displayValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (Array.isArray(value)) return value.join(', ') || '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function titleCase(value) {
  return String(value || '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getPageData(response) {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return { content: data, page: 0, size: data.length, totalElements: data.length, totalPages: 1 };
  if (data && Array.isArray(data.content)) return data;
  if (data && Array.isArray(data.notifications)) return { ...data, content: data.notifications };
  return { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0, raw: data };
}
