import React from 'react';
export default function StatCard({ label, value, detail }) {
  return <article className="stat-card"><span>{label}</span><strong>{value === null || value === undefined ? '—' : value}</strong>{detail && <small>{detail}</small>}</article>;
}
