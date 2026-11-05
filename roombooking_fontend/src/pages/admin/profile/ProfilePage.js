import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile } from '../../../api/profileApi';
import { logoutAll } from '../../../api/authApi';
import { clearSession } from '../../../utils/tokenUtils';
import { useAuth } from '../../../hooks/useAuth';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import Avatar from '../../../components/common/Avatar';
import Button from '../../../components/common/Button';
import { formatDateTime } from '../../../utils/dateUtils';

export default function AdminProfilePage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      setError(null);
      const response = await getProfile();
      setData(response.data);
    } catch (requestError) {
      setError(requestError);
    }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  async function logoutEverywhere() {
    if (!window.confirm('Đăng xuất tất cả thiết bị? Phiên hiện tại cũng sẽ kết thúc.')) return;
    setBusy(true);
    setError(null);
    try {
      await logoutAll();
    } catch (requestError) {
      setError(requestError);
    } finally {
      clearSession('admin');
      await signOut(false);
      navigate('/admin/login', { replace: true });
      setBusy(false);
    }
  }

  return <>
    <PageHeader eyebrow="Quản trị · Tài khoản" title="Hồ sơ" description="Thông tin lấy từ API hồ sơ." actions={<><Link className="button button-primary" to="/admin/profile/edit">Chỉnh sửa hồ sơ</Link><Link className="button button-secondary" to="/admin/profile/password">Đổi mật khẩu</Link></>} />
    <ApiState loading={!data && !error} error={error} onRetry={load}>{data && <section className="panel">
      <Avatar user={data} size="lg" />
      {data.avatarSource === 'NONE' && <p className="field-hint">Chưa có ảnh đại diện. <Link to="/admin/profile/edit">Tải ảnh lên</Link></p>}
      <div className="detail-grid" style={{ marginTop: 20 }}>{[['Tên đăng nhập', data.username], ['Họ tên', data.fullName], ['Email', data.email], ['Điện thoại', data.phone], ['Đơn vị', data.department], ['Vai trò', data.roles], ['Đăng nhập gần nhất', formatDateTime(data.lastLoginAt)], ['Tạo tài khoản', formatDateTime(data.createdAt)]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{Array.isArray(value) ? value.join(', ') : value || '—'}</strong></div>)}</div>
      <div className="actions" style={{ marginTop: 20 }}><Button variant="danger" loading={busy} onClick={logoutEverywhere}>Đăng xuất mọi thiết bị</Button></div>
    </section>}</ApiState>
  </>;
}
