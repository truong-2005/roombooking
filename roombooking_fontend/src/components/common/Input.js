import React from 'react';
export default function Input({ label, error, hint, id, className = '', ...props }) {
  const inputId = id || props.name;
  return <div className={'field ' + className}>
    {label && <label htmlFor={inputId}>{label}{props.required ? ' *' : ''}</label>}
    <input id={inputId} aria-invalid={Boolean(error)} aria-describedby={error ? inputId + '-error' : undefined} {...props} />
    {hint && <small className="field-hint">{hint}</small>}
    {error && <small className="field-error" id={inputId + '-error'}>{error}</small>}
  </div>;
}
