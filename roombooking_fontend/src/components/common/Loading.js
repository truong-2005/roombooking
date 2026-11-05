import React from 'react';
export default function Loading({ label = 'Đang tải dữ liệu…' }) {
  return <div className="state-panel" role="status"><span className="spinner" />{label}</div>;
}
