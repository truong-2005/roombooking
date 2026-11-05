import React from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { validateEmail, validatePassword } from '../../utils/validationUtils';
import { validateImageFile } from '../../utils/fileUtils';
import Avatar from '../common/Avatar';
import useObjectUrl from '../../hooks/useObjectUrl';

export default function UserForm({ initial = {}, roles = [], create = false, onSubmit, busy, error }) {
  const [values, setValues] = React.useState({ username: '', email: '', fullName: '', password: '', phone: '', department: '', enabled: true, ...initial, avatarUrl: initial.avatarSource === 'LINK' ? initial.avatarUrl || '' : '' });
  const [selectedRoles, setRoles] = React.useState(initial.roles || []);
  const [avatarFile, setAvatar] = React.useState(null);
  const avatarFilePreview = useObjectUrl(avatarFile);
  const [removeAvatar, setRemoveAvatar] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const change = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));
  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!values.username.trim()) next.username = 'Vui lòng nhập tên đăng nhập.';
    if (!validateEmail(values.email)) next.email = 'Email không đúng định dạng.';
    if (!values.fullName.trim()) next.fullName = 'Vui lòng nhập họ tên.';
    if (create && !validatePassword(values.password)) next.password = 'Mật khẩu cần tối thiểu 8 ký tự, có chữ cái và chữ số.';
    if ((values.avatarUrl && avatarFile) || (removeAvatar && (values.avatarUrl || avatarFile))) next.avatarUrl = 'Chỉ chọn một thao tác cho ảnh đại diện.';
    if (validateImageFile(avatarFile)) next.avatarFile = validateImageFile(avatarFile);
    setErrors(next);
    if (Object.keys(next).length) return;
    const payload = { username: values.username, email: values.email, fullName: values.fullName, phone: values.phone || undefined, department: values.department || undefined, avatarUrl: values.avatarUrl || undefined, avatarFile: avatarFile || undefined, removeAvatar: removeAvatar || undefined };
    if (create) Object.assign(payload, { password: values.password, enabled: values.enabled, roles: selectedRoles });
    else if (values.newPassword) payload.newPassword = values.newPassword;
    onSubmit(payload, selectedRoles);
  }
  const avatarPreview = removeAvatar
    ? { fullName: values.fullName, username: values.username, avatarSource: 'NONE' }
    : avatarFile && avatarFilePreview
      ? { fullName: values.fullName, username: values.username, avatarSource: 'LINK', avatarUrl: avatarFilePreview }
      : values.avatarUrl
        ? { fullName: values.fullName, username: values.username, avatarSource: 'LINK', avatarUrl: values.avatarUrl }
        : initial;
  return <form className="form-grid" onSubmit={submit}>
    <Input label="Tên đăng nhập" required maxLength="50" minLength="3" value={values.username} onChange={change('username')} error={errors.username} />
    <Input label="Email" type="email" required maxLength="100" value={values.email} onChange={change('email')} error={errors.email} />
    <Input label="Họ và tên" required maxLength="100" value={values.fullName} onChange={change('fullName')} error={errors.fullName} />
    {create && <Input label="Mật khẩu" type="password" required autoComplete="new-password" value={values.password} onChange={change('password')} error={errors.password} />}
    {!create && <Input label="Mật khẩu mới (để trống nếu giữ nguyên)" type="password" autoComplete="new-password" value={values.newPassword || ''} onChange={change('newPassword')} />}
    <Input label="Số điện thoại" value={values.phone || ''} onChange={change('phone')} />
    <Input label="Đơn vị" value={values.department || ''} onChange={change('department')} />
    <Input label="URL ảnh đại diện" type="url" value={values.avatarUrl || ''} onChange={change('avatarUrl')} error={errors.avatarUrl} />
    <FileUpload label="Tệp ảnh đại diện" name="avatarFile" accept="image/jpeg,image/png,image/webp,image/gif" onChange={setAvatar} />
    <div className="form-wide image-preview"><span>Ảnh đại diện xem trước</span><Avatar user={avatarPreview} size="lg" /></div>
    {errors.avatarFile && <small className="field-error">{errors.avatarFile}</small>}
    {!create && initial.avatarSource !== 'NONE' && <label className="checkbox-field"><input type="checkbox" checked={removeAvatar} onChange={(event) => setRemoveAvatar(event.target.checked)} /> Gỡ ảnh hiện tại</label>}
    {create && <Select label="Vai trò" multiple value={selectedRoles} onChange={(event) => setRoles(Array.from(event.target.selectedOptions).map((option) => option.value))} options={roles.map((role) => ({ value: role.name, label: role.name }))} />}
    {create && <label className="checkbox-field"><input type="checkbox" checked={Boolean(values.enabled)} onChange={(event) => setValues((current) => ({ ...current, enabled: event.target.checked }))} /> Tài khoản được kích hoạt</label>}
    {error && <div className="form-wide"><ErrorMessage error={error} /></div>}
    <div className="form-wide"><Button type="submit" loading={busy}>{create ? 'Tạo người dùng' : 'Lưu thay đổi'}</Button></div>
  </form>;
}
