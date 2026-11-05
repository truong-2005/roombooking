import React from 'react';
import Modal from './Modal';
import Button from './Button';
export default function ConfirmDialog({ open, title = 'Xác nhận thao tác', message, busy, onCancel, onConfirm, confirmLabel = 'Xác nhận' }) {
  return <Modal open={open} title={title} onClose={onCancel}>
    <div className="modal-body"><p>{message}</p><div className="actions">
      <Button variant="secondary" onClick={onCancel}>Quay lại</Button>
      <Button variant="danger" loading={busy} onClick={onConfirm}>{confirmLabel}</Button>
    </div></div>
  </Modal>;
}
