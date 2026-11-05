import React from 'react';
export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Tìm kiếm…' }) {
  return <form className="search-bar" onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}>
    <input aria-label="Từ khóa tìm kiếm" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    <button className="button button-secondary" type="submit">Tìm</button>
  </form>;
}
