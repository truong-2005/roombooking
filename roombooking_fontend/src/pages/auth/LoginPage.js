import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCaptcha } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { normalizeApiError } from '../../api/axiosClient';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
export default function LoginPage({ admin = false }) {
  const { signIn } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [captcha, setCaptcha] = React.useState(null); const [captchaError, setCaptchaError] = React.useState(null);
  const [values, setValues] = React.useState({ usernameOrEmail: '', password: '', captchaAnswer: '' });
  const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const loadCaptcha = React.useCallback(async () => { setCaptcha(null); setCaptchaError(null); try { const response = await getCaptcha(); setCaptcha(response.data); } catch (e) { setCaptchaError(e); } }, []);
  React.useEffect(() => { loadCaptcha(); }, [loadCaptcha]);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(null);
    try {
      if (!captcha?.captchaId) throw new Error('Chưa tải được CAPTCHA. Vui lòng tải lại.');
      await signIn({ usernameOrEmail: values.usernameOrEmail, password: values.password, captchaId: captcha.captchaId, captchaAnswer: values.captchaAnswer }, admin);
      const requestedPath = location.state?.from?.pathname;
      const destination = admin
        ? (requestedPath === '/admin' || requestedPath?.startsWith('/admin/') ? requestedPath : '/admin')
        : (requestedPath && requestedPath !== '/admin' && !requestedPath.startsWith('/admin/') ? requestedPath : '/');
      navigate(destination, { replace: true });
    } catch (e) { setError(e); setValues((current) => ({ ...current, captchaAnswer: '' })); await loadCaptcha(); }
    finally { setBusy(false); }
  }
  const normalized = error?.response ? normalizeApiError(error) : null;
  return <section className="auth-card">
    <span className="eyebrow">{admin ? 'Khu vực quản trị' : 'Dành cho thành viên'}</span><h1>{admin ? 'Đăng nhập quản trị' : 'Chào mừng trở lại'}</h1>
    <p>{admin ? 'Đăng nhập bằng tài khoản có vai trò quản trị viên.' : 'Đăng nhập để tìm phòng và quản lý lịch đặt của bạn.'}</p>
    <form className="auth-form" onSubmit={submit}>
      {error && <ErrorMessage error={error} />}
      {normalized?.status === 429 && normalized.retryAfter && <p className="muted">Thử lại sau khoảng {normalized.retryAfter} giây.</p>}
      <Input label="Tên đăng nhập hoặc email" required autoComplete="username" value={values.usernameOrEmail} onChange={(e) => setValues({ ...values, usernameOrEmail: e.target.value })} />
      <Input label="Mật khẩu" type="password" required autoComplete="current-password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
      <div className="captcha-box"><div className="row-between"><span className="captcha-prompt">{captcha?.question || 'Đang tải CAPTCHA…'}</span><button className="text-button" type="button" onClick={loadCaptcha}>Tải câu hỏi khác</button></div>
        {captchaError && <ErrorMessage error={captchaError} onRetry={loadCaptcha} />}
        <Input label="Đáp án CAPTCHA" required value={values.captchaAnswer} onChange={(e) => setValues({ ...values, captchaAnswer: e.target.value })} />
      </div>
      <Button type="submit" loading={busy || !captcha}>Đăng nhập</Button>
    </form>
    <div className="auth-links"><Link to={admin ? '/admin/forgot-password' : '/forgot-password'}>Quên mật khẩu?</Link>{admin ? <Link to="/admin/register">Đăng ký quản trị</Link> : <Link to="/register">Tạo tài khoản</Link>}</div>
  </section>;
}
