import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../../api/userApi';
import { listRoles } from '../../../api/roleApi';
import UserForm from '../../../components/users/UserForm';
import PageHeader from '../../../components/common/PageHeader';
import ErrorMessage from '../../../components/common/ErrorMessage';
export default function UserCreatePage() {
  const navigate = useNavigate();
  const [roles, setRoles] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);
  React.useEffect(() => { let active = true; listRoles().then((r) => { if (active) setRoles(r.data || []); }).catch((e) => { if (active) setError(e); }); return () => { active = false; }; }, []);
  async function submit(payload) { setBusy(true); setError(null); try { await createUser(payload); navigate('/admin/users', { replace: true }); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị · Người dùng" title="Tạo người dùng" description="Thông tin được gửi đến API quản lý tài khoản." /><section className="panel">
    {error && !error.response?.status && <ErrorMessage error={error} onRetry={() => listRoles().then((r) => setRoles(r.data || []))} />}
    <UserForm create roles={roles} onSubmit={submit} busy={busy} error={error} />
  </section></>;
}
