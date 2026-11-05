import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../../api/profileApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import Input from '../../../components/common/Input';
import FileUpload from '../../../components/common/FileUpload';
import Button from '../../../components/common/Button';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { validateEmail } from '../../../utils/validationUtils';
import { validateImageFile } from '../../../utils/fileUtils';
import { useAuth } from '../../../hooks/useAuth';
import Avatar from '../../../components/common/Avatar';
import useObjectUrl from '../../../hooks/useObjectUrl';
export default function EditProfilePage() {
  const navigate = useNavigate(); const location = useLocation(); const uploadWarning = location.state?.avatarUploadWarning || ''; const { refreshUser } = useAuth(); const [profile, setProfile] = React.useState(null); const [values, setValues] = React.useState({}); const [file, setFile] = React.useState(null); const filePreview = useObjectUrl(file); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false); const [removeAvatar, setRemoveAvatar] = React.useState(false);
  const load = React.useCallback(async () => { try { const response = await getProfile(); setProfile(response.data); setValues({ fullName: response.data.fullName || '', email: response.data.email || '', phone: response.data.phone || '', department: response.data.department || '', avatarUrl: response.data.avatarSource === 'LINK' ? response.data.avatarUrl || '' : '' }); setError(null); } catch (e) { setError(e); } }, []);
  React.useEffect(() => { load(); }, [load]);
  async function submit(event) { event.preventDefault(); if (!validateEmail(values.email) || !values.fullName?.trim()) { setError('Họ tên và email hợp lệ là bắt buộc.'); return; } if (file && values.avatarUrl) { setError('Chỉ chọn URL ảnh hoặc tải tệp ảnh.'); return; } if (validateImageFile(file)) { setError(validateImageFile(file)); return; } setBusy(true); setError(null);
    try {
      const response = await updateProfile({ ...values, avatarUrl: values.avatarUrl || undefined, avatarFile: file || undefined, removeAvatar: removeAvatar || undefined });
      if (response.data?.profile) setProfile(response.data.profile);
      try { await refreshUser(); }
      catch (_) { setError('Hồ sơ đã được lưu nhưng chưa làm mới được ảnh trên thanh điều hướng. Hãy tải lại trang.'); return; }
      navigate('/profile', { replace: true });
    } catch (e) { setError(e); } finally { setBusy(false); }
  }
  const previewUser = removeAvatar
    ? { ...profile, avatarSource: 'NONE', avatarUrl: '' }
    : file && filePreview
      ? { ...profile, fullName: values.fullName, avatarSource: 'LINK', avatarUrl: filePreview }
      : values.avatarUrl
        ? { ...profile, fullName: values.fullName, avatarSource: 'LINK', avatarUrl: values.avatarUrl }
        : profile;
  return <><PageHeader eyebrow="Tài khoản" title="Chỉnh sửa hồ sơ" /><ApiState loading={!profile && !error} error={error} onRetry={load}>{profile && <section className="panel">{uploadWarning && <p className="notice notice-error" role="alert">{uploadWarning}</p>}<form className="form-grid" onSubmit={submit}>
    <div className="form-wide image-preview"><span>Ảnh đại diện hiện tại / xem trước</span><Avatar user={previewUser} size="lg" /></div>
    <Input label="Họ và tên" required value={values.fullName} onChange={(e) => setValues({ ...values, fullName: e.target.value })} />
    <Input label="Email" type="email" required value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
    <Input label="Điện thoại" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
    <Input label="Đơn vị" value={values.department} onChange={(e) => setValues({ ...values, department: e.target.value })} />
    <Input label="URL ảnh đại diện" type="url" value={values.avatarUrl} onChange={(e) => setValues({ ...values, avatarUrl: e.target.value })} />
    <FileUpload label="Tệp ảnh đại diện" accept="image/jpeg,image/png,image/webp,image/gif" name="avatarFile" onChange={setFile} />
    {profile.avatarSource !== 'NONE' && <label className="checkbox-field form-wide"><input type="checkbox" checked={removeAvatar} onChange={(e) => setRemoveAvatar(e.target.checked)} /> Gỡ ảnh đại diện hiện tại</label>}
    {error && <div className="form-wide"><ErrorMessage error={error} /></div>}
    <div className="form-wide"><Button type="submit" loading={busy}>Lưu hồ sơ</Button></div>
  </form></section>}</ApiState></>;
}
