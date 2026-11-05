import React from 'react';
export default function EmptyState({ title = 'Chưa có dữ liệu', description, action }) {
  return <div className="empty-state"><span className="empty-mark" aria-hidden="true">—</span><h3>{title}</h3>{description && <p>{description}</p>}{action}</div>;
}
