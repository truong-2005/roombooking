import React from 'react';
export default function TextArea({ label, error, id, ...props }) {
  const inputId = id || props.name;
  return <div className="field">
    {label && <label htmlFor={inputId}>{label}{props.required ? ' *' : ''}</label>}
    <textarea id={inputId} aria-invalid={Boolean(error)} {...props} />
    {error && <small className="field-error">{error}</small>}
  </div>;
}
