import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCaptcha } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validateEmail, validatePassword } from '../../utils/validationUtils';
import { validateImageFile } from '../../utils/fileUtils';
import { updateProfile } from '../../api/profileApi';
import { normalizeApiError } from '../../api/axiosClient';
import FileUpload from '../../components/common/FileUpload';
import Avatar from '../../components/common/Avatar';
import useObjectUrl from '../../hooks/useObjectUrl';
export default function RegisterPage({ admin = false }) {
  const { signUp, refreshUser } = useAuth(); const navigate = useNavigate();
  const [captcha, setCaptcha] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false); const [errors, setErrors] = React.useState({});
  const [values, setValues] = React.useState({ username: '', email: '', password: '', confirmPassword: '', fullName: '', phone: '', department: '', captchaAnswer: '' });
  const [avatarFile, setAvatarFile] = React.useState(null);
  const avatarPreview = useObjectUrl(avatarFile);
  const loadCaptcha = React.useCallback(async () => { setCaptcha(null); try { const response = await getCaptcha(); setCaptcha(response.data); } catch (e) { setError(e); } }, []);
  React.useEffect(() => { loadCaptcha(); }, [loadCaptcha]);
  async function submit(event) {
    event.preventDefault(); const next = {};
    if (!/^[a-zA-Z0-9._-]{3,50}$/.test(values.username)) next.username = 'Dùng 3–50 chữ cái, số, dấu chấm, gạch dưới hoặc gạch ngang.';
    if (!validateEmail(values.email)) next.email = 'Email không đúng định dạng.';
    if (!validatePassword(values.password)) next.password = 'Mật khẩu cần ít nhất 8 ký tự, một chữ cái và một chữ số.';
    if (values.password !== values.confirmPassword) next.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    if (!values.fullName.trim()) next.fullName = 'Vui lòng nhập họ tên.';
    if (!captcha?.captchaId) next.captchaAnswer = 'Chưa tải được CAPTCHA.';
    if (validateImageFile(avatarFile)) next.avatarFile = validateImageFile(avatarFile);
    setErrors(next); if (Object.keys(next).length) return;
    setBusy(true); setError(null);
    try {
      await signUp({ username: values.username, email: values.email, password: values.password, confirmPassword: values.confirmPassword, fullName: values.fullName, phone: values.phone || undefined, department: values.department || undefined, captchaId: captcha.captchaId, captchaAnswer: values.captchaAnswer }, admin);
      if (avatarFile) {
        let avatarSaved = false;
        try {
          await updateProfile({ fullName: values.fullName, email: values.email, phone: values.phone || undefined, department: values.department || undefined, avatarFile });
          avatarSaved = true;
          await refreshUser();
        } catch (uploadError) {
          const message = avatarSaved
            ? 'Tài khoản đã được tạo và ảnh đã tải lên. Không thể làm mới hồ sơ ngay lúc này.'
            : 'Tài khoản đã được tạo nhưng chưa tải được ảnh đại diện: ' + normalizeApiError(uploadError).message;
          navigate(admin ? '/admin/profile/edit' : '/profile/edit', { replace: true, state: { avatarUploadWarning: message } });
          return;
        }
      }
      navigate(admin ? '/admin' : '/', { replace: true });
    } catch (e) { setError(e); setValues((old) => ({ ...old, captchaAnswer: '' })); await loadCaptcha(); }
    finally { setBusy(false); }
  }
  return <section className="auth-card"><span className="eyebrow">{admin ? 'Quản trị' : 'Tài khoản thành viên'}</span><h1>{admin ? 'Đăng ký quản trị' : 'Tạo tài khoản'}</h1>
    <p>{admin ? 'Backend chỉ cho phép tạo admin đầu tiên khi chưa có admin; các lần tiếp theo cần quyền quản trị.' : 'Đăng ký tài khoản người dùng. Vai trò được endpoint backend tự gán.'}</p>
    <form className="auth-form" onSubmit={submit}>{error && <ErrorMessage error={error} />}
      <Input label="Tên đăng nhập" required minLength="3" maxLength="50" value={values.username} onChange={(e) => setValues({ ...values, username: e.target.value })} error={errors.username} />
      <Input label="Email" type="email" required value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} error={errors.email} />
      <Input label="Họ và tên" required value={values.fullName} onChange={(e) => setValues({ ...values, fullName: e.target.value })} error={errors.fullName} />
      <Input label="Mật khẩu" type="password" required autoComplete="new-password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} error={errors.password} />
      <Input label="Xác nhận mật khẩu" type="password" required autoComplete="new-password" value={values.confirmPassword} onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} error={errors.confirmPassword} />
      <Input label="Số điện thoại" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
      <Input label="Đơn vị" value={values.department} onChange={(e) => setValues({ ...values, department: e.target.value })} />
      <FileUpload label="Ảnh đại diện (không bắt buộc)" name="avatarFile" accept="image/jpeg,image/png,image/webp,image/gif" onChange={setAvatarFile} />
      {errors.avatarFile && <small className="field-error">{errors.avatarFile}</small>}
      <div className="image-preview"><span>Xem trước ảnh đại diện</span><Avatar user={{ fullName: values.fullName, username: values.username, avatarSource: avatarPreview ? 'LINK' : 'NONE', avatarUrl: avatarPreview }} size="lg" /></div>
      <div className="captcha-box"><div className="row-between"><span className="captcha-prompt">{captcha?.question || 'Đang tải CAPTCHA…'}</span><button className="text-button" type="button" onClick={loadCaptcha}>Tải lại</button></div><Input label="Đáp án CAPTCHA" required value={values.captchaAnswer} onChange={(e) => setValues({ ...values, captchaAnswer: e.target.value })} error={errors.captchaAnswer} /></div>
      <Button type="submit" loading={busy || !captcha}>Đăng ký</Button>
    </form><div className="auth-links"><Link to={admin ? '/admin/login' : '/login'}>Quay lại đăng nhập</Link></div>
  </section>;
}
