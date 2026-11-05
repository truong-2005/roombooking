import React from 'react';
import { BOOKING_STATUS_LABELS } from '../../utils/constants';
export default function StatusBadge({ value }) {
  const key = String(value || '').toLowerCase();
  return <span className={'status-badge status-' + key}>{BOOKING_STATUS_LABELS[value] || (value === 'ACTIVE' ? 'Đang hoạt động' : value === 'INACTIVE' ? 'Ngừng hoạt động' : value || '—')}</span>;
}
