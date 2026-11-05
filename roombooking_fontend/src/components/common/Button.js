import React from 'react';
export default function Button({ children, variant = 'primary', loading = false, disabled, type = 'button', className = '', ...props }) {
  return <button type={type} className={'button button-' + variant + ' ' + className} disabled={disabled || loading} {...props}>
    {loading ? 'Đang xử lý…' : children}
  </button>;
}
