import React from 'react';
export default function Select({ label, error, options = [], id, className = '', ...props }) {
  const inputId = id || props.name;
  return <div className={'field ' + className}>
    {label && <label htmlFor={inputId}>{label}{props.required ? ' *' : ''}</label>}
    <select id={inputId} aria-invalid={Boolean(error)} {...props}>
      {props.placeholder && <option value="">{props.placeholder}</option>}
      {options.map((option) => typeof option === 'string'
        ? <option key={option} value={option}>{option}</option>
        : <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {error && <small className="field-error">{error}</small>}
  </div>;
}
