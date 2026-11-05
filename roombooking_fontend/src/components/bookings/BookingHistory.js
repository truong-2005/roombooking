import React from 'react';
import { formatDateTime } from '../../utils/dateUtils';
import { titleCase } from '../../utils/formatUtils';
export default function BookingHistory({ history = [] }) {
  if (!history.length) return <p className="muted">Chưa có lịch sử trạng thái.</p>;
  return <ol className="timeline">{history.map((item, index) => <li key={item.id || item.bookingId + '-' + index}><strong>{titleCase(item.status || item.action)}</strong><span>{item.actorName || ''}</span><time>{formatDateTime(item.occurredAt)}</time>{item.note && <p>{item.note}</p>}</li>)}</ol>;
}
