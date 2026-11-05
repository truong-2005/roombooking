import React from 'react';
export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
    <section className="modal-panel" role="dialog" aria-modal="true" aria-label={title}>
      <header className="modal-header"><h2>{title}</h2><button className="icon-button" aria-label="Đóng" onClick={onClose}>×</button></header>
      {children}
    </section>
  </div>;
}
