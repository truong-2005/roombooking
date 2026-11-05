import React from 'react';
import Button from './Button';
import { normalizeApiError } from '../../api/axiosClient';
export default function ErrorMessage({ error, onRetry }) {
  const normalized = error && typeof error !== 'string' ? normalizeApiError(error) : null;
  const message = typeof error === 'string' ? error : normalized?.message || error?.message;
  const fields = normalized?.fieldErrors && typeof normalized.fieldErrors === 'object' ? Object.entries(normalized.fieldErrors) : [];
  return <div className="state-panel state-error" role="alert"><span>{message || 'Đã xảy ra lỗi.'}</span>{fields.length > 0 && <ul className="field-error-list">{fields.map(([field, detail]) => <li key={field}>{field}: {detail}</li>)}</ul>}{onRetry && <Button variant="secondary" onClick={onRetry}>Thử lại</Button>}</div>;
}
