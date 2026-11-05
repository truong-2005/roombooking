import React from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
export default function ForgotPasswordPage({ routePrefix = '' }) {
  const [email, setEmail] = React.useState(''); const [busy, setBusy] = React.useState(false); const [error, setError] = React.useState(null); const [message, setMessage] = React.useState(null);
  async function submit(event) { event.preventDefault(); setBusy(true); setError(null); setMessage(null); try { const response = await forgotPassword({ email }); setMessage(response.data?.message || 'Yêu cầu đã được tiếp nhận. Nếu email thuộc tài khoản, hướng dẫn sẽ được gửi đến hộp thư.'); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <section className="auth-card"><span className="eyebrow">Khôi phục tài khoản</span><h1>Quên mật khẩu</h1><p>Nhập địa chỉ email đã dùng để đăng ký.</p><form className="auth-form" onSubmit={submit}>{error && <ErrorMessage error={error} />}{message && <p className="success-message">{message}</p>}<Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /><Button type="submit" loading={busy}>Gửi yêu cầu</Button></form><div className="auth-links"><Link to={routePrefix ? '/admin/login' : '/login'}>Quay lại đăng nhập</Link></div></section>;
}
