import React from 'react';
import Button from './Button';
export default function Pagination({ page = 0, totalPages = 0, onChange }) {
  if (totalPages <= 1) return null;
  return <nav className="pagination" aria-label="Phân trang">
    <Button variant="secondary" disabled={page <= 0} onClick={() => onChange(page - 1)}>Trước</Button>
    <span>Trang {page + 1} / {totalPages}</span>
    <Button variant="secondary" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>Sau</Button>
  </nav>;
}
