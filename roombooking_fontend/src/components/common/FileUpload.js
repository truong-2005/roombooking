import React from 'react';
import Input from './Input';
export default function FileUpload({ label = 'Chọn tệp', multiple = false, accept, onChange, name = 'file' }) {
  return <Input type="file" name={name} label={label} multiple={multiple} accept={accept} onChange={(event) => onChange?.(multiple ? Array.from(event.target.files || []) : event.target.files?.[0] || null)} />;
}
