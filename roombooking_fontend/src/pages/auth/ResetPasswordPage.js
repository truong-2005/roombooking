import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPassword, verifyResetToken } from '../../api/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validatePassword } from '../../utils/validationUtils';
export default function ResetPasswordPage({ routePrefix = '' }) {
  const [params] = useSearchParams(); const [token, setToken] = React.useState(params.get('token') || ''); const [verified, setVerified] = React.useState(false); const [busy, setBusy] = React.useState(false); const [error, setError] = React.useState(null); const [message, setMessage] = React.useState(null);
  const [password, setPassword] = React.useState(''); const [confirmPassword, setConfirm] = React.useState('');
  async function verify(event) { event.preventDefault(); setBusy(true); setError(null); try { await verifyResetToken({ token }); setVerified(true); setMessage('Mã đặt lại còn hiệu lực.'); } catch (e) { setError(e); setVerified(false); } finally { setBusy(false); } }
  async function submit(event) { event.preventDefault(); setError(null); if (!validatePassword(password)) { setError('Mật khẩu cần ít nhất 8 ký tự, một chữ cái và một chữ số.'); return; } if (password !== confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); return; } setBusy(true); try { const response = await resetPassword({ token, newPassword: password, confirmPassword }); setMessage(response.data?.message || 'Mật khẩu đã được cập nhật.'); setVerified(false); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <section className="auth-card"><span className="eyebrow">Khôi phục tài khoản</span><h1>Đặt lại mật khẩu</h1><p>Xác minh mã nhận qua email trước khi nhập mật khẩu mới.</p>
    {!verified && <form className="auth-form" onSubmit={verify}>{error && <ErrorMessage error={error} />}{message && <p className="success-message">{message}</p>}<Input label="Mã đặt lại" required value={token} onChange={(e) => setToken(e.target.value)} /><Button type="submit" loading={busy}>Xác minh mã</Button></form>}
    {verified && <form className="auth-form" onSubmit={submit}>{error && <ErrorMessage error={error} />}{message && <p className="success-message">{message}</p>}<Input label="Mật khẩu mới" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /><Input label="Xác nhận mật khẩu mới" type="password" required autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirm(e.target.value)} /><Button type="submit" loading={busy}>Cập nhật mật khẩu</Button></form>}
    <div className="auth-links"><Link to={routePrefix ? '/admin/login' : '/login'}>Quay lại đăng nhập</Link></div>
  </section>;
}
