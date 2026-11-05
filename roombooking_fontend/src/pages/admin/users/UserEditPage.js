import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { assignUserRoles, getUser, updateUser } from '../../../api/userApi';
import { listRoles } from '../../../api/roleApi';
import UserForm from '../../../components/users/UserForm';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
export default function UserEditPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const [user, setUser] = React.useState(null); const [roles, setRoles] = React.useState([]); const [selected, setSelected] = React.useState([]);
  const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async () => { try { setError(null); const [u, r] = await Promise.all([getUser(id), listRoles()]); setUser(u.data); setRoles(r.data || []); setSelected(u.data.roles || []); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  async function submit(payload) { setBusy(true); setError(null); try { await updateUser(id, payload); navigate('/admin/users/' + id, { replace: true }); } catch (e) { setError(e); } finally { setBusy(false); } }
  async function saveRoles() { setBusy(true); try { const response = await assignUserRoles(id, selected); setUser(response.data); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị · Người dùng" title="Chỉnh sửa tài khoản" actions={<Link className="button button-secondary" to={'/admin/users/' + id}>Quay lại</Link>} />
    <ApiState loading={!user && !error} error={error} onRetry={load}>{user && <section className="panel"><UserForm initial={user} roles={roles} onSubmit={submit} busy={busy} error={error} />
      <hr /><h2>Gán vai trò</h2><div className="form-grid"><Select label="Vai trò từ API" multiple value={selected} onChange={(event) => setSelected(Array.from(event.target.selectedOptions).map((o) => o.value))} options={roles.map((role) => ({ value: role.name, label: role.name }))} /><Button onClick={saveRoles} loading={busy}>Lưu vai trò</Button></div>
    </section>}</ApiState></>;
}
