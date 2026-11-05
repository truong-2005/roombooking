import React from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../../api/profileApi';
import PageHeader from '../../../components/common/PageHeader';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { validatePassword } from '../../../utils/validationUtils';

export default function AdminChangePasswordPage() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  async function submit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validatePassword(values.newPassword)) {
      setError('Mật khẩu mới cần tối thiểu 8 ký tự, có chữ cái và chữ số.');
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (values.newPassword === values.currentPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại.');
      return;
    }
    setBusy(true);
    try {
      const response = await changePassword(values);
      setSuccess(response.data?.message || 'Mật khẩu đã được thay đổi.');
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (requestError) {
      setError(requestError);
    } finally {
      setBusy(false);
    }
  }

  return <>
    <PageHeader eyebrow="Quản trị · Tài khoản" title="Đổi mật khẩu" />
    <section className="panel"><form className="form-grid" onSubmit={submit}>
      <Input label="Mật khẩu hiện tại" type="password" required autoComplete="current-password" value={values.currentPassword} onChange={(event) => setValues({ ...values, currentPassword: event.target.value })} />
      <Input label="Mật khẩu mới" type="password" required autoComplete="new-password" value={values.newPassword} onChange={(event) => setValues({ ...values, newPassword: event.target.value })} />
      <Input label="Xác nhận mật khẩu mới" type="password" required autoComplete="new-password" value={values.confirmPassword} onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })} />
      {error && <div className="form-wide"><ErrorMessage error={error} /></div>}
      {success && <p className="success-message form-wide">{success}</p>}
      <div className="form-wide"><Button type="submit" loading={busy}>Cập nhật mật khẩu</Button></div>
    </form><button className="text-button" style={{ marginTop: 15 }} onClick={() => navigate('/admin/profile')}>Quay lại hồ sơ</button></section>
  </>;
}
