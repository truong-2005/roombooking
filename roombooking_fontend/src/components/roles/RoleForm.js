import React from 'react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
export default function RoleForm({ initial = {}, edit = false, onSubmit, busy, error }) {
  const [name, setName] = React.useState(initial.name || '');
  const [description, setDescription] = React.useState(initial.description || '');
  return <form className="form-grid" onSubmit={(event) => { event.preventDefault(); onSubmit(edit ? { description } : { name, description }); }}>
    {!edit && <Input label="Tên vai trò" required value={name} onChange={(event) => setName(event.target.value)} maxLength="50" pattern="ROLE_[A-Z0-9_]+" hint="Bắt đầu bằng ROLE_, sau đó dùng chữ in hoa, số hoặc gạch dưới." />}
    {edit && <div className="field"><label>Tên vai trò</label><input value={name} disabled /></div>}
    <TextArea label="Mô tả" value={description} onChange={(event) => setDescription(event.target.value)} maxLength="255" />
    {error && <div className="form-wide"><ErrorMessage error={error} /></div>}
    <div className="form-wide"><Button type="submit" loading={busy}>{edit ? 'Lưu thay đổi' : 'Tạo vai trò'}</Button></div>
  </form>;
}
