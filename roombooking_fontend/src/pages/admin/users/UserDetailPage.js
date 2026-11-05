import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { changeUserPassword, getUser } from '../../../api/userApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import Avatar from '../../../components/common/Avatar';
import { formatDateTime } from '../../../utils/dateUtils';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import ErrorMessage from '../../../components/common/ErrorMessage';
export default function UserDetailPage() {
  const { id } = useParams(); const [user, setUser] = React.useState(null); const [error, setError] = React.useState(null); const [password, setPassword] = React.useState({ newPassword: '', confirmPassword: '' }); const [busy, setBusy] = React.useState(false); const [message, setMessage] = React.useState(null);
  const load = React.useCallback(async () => { try { setError(null); const response = await getUser(id); setUser(response.data); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  async function resetPassword(event) { event.preventDefault(); if (password.newPassword.length < 8 || !/[A-Za-z]/.test(password.newPassword) || !/\d/.test(password.newPassword)) { setError('Mật khẩu cần tối thiểu 8 ký tự, có chữ cái và chữ số.'); return; } if (password.newPassword !== password.confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); return; } setBusy(true); setError(null); setMessage(null); try { const response = await changeUserPassword(id, password); setMessage(response.data?.message || 'Đã đặt lại mật khẩu. Các phiên khác đã được thu hồi theo backend.'); setPassword({ newPassword: '', confirmPassword: '' }); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị · Người dùng" title="Chi tiết người dùng" actions={<Link className="button button-primary" to={'/admin/users/' + id + '/edit'}>Chỉnh sửa</Link>} />
    <ApiState loading={!user && !error} error={error} onRetry={load}>{user && <><section className="panel"><Avatar user={user} size="lg" /><div className="detail-grid" style={{ marginTop: 20 }}>{[['ID', user.id], ['Tài khoản', user.username], ['Họ tên', user.fullName], ['Email', user.email], ['Điện thoại', user.phone], ['Đơn vị', user.department], ['Vai trò', user.roles], ['Kích hoạt', user.enabled ? 'Có' : 'Không'], ['Số lượt đặt', user.totalBookings], ['Đăng nhập gần nhất', formatDateTime(user.lastLoginAt)], ['Tạo lúc', formatDateTime(user.createdAt)]].map(([k, v]) => <div key={k}><span>{k}</span><strong>{Array.isArray(v) ? v.join(', ') : v ?? '—'}</strong></div>)}</div></section>
      <section className="panel"><h2>Đặt lại mật khẩu</h2><p className="muted">Chỉ quản trị viên được phép đặt mật khẩu mới cho tài khoản khác.</p>{message && <p className="success-message">{message}</p>}{error && <ErrorMessage error={error} />}<form className="form-grid" onSubmit={resetPassword}><Input label="Mật khẩu mới" type="password" required autoComplete="new-password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} /><Input label="Xác nhận mật khẩu" type="password" required autoComplete="new-password" value={password.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} /><div className="form-wide"><Button type="submit" loading={busy}>Đặt lại mật khẩu</Button></div></form></section>
    </>}</ApiState></>;
}
