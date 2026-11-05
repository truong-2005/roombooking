import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRole, updateRole } from '../../../api/roleApi';
import PageHeader from '../../../components/common/PageHeader';
import RoleForm from '../../../components/roles/RoleForm';
import ApiState from '../../../components/common/ApiState';
export default function RoleEditPage() {
  const { id } = useParams(); const navigate = useNavigate(); const [role, setRole] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async () => { try { const response = await getRole(id); setRole(response.data); setError(null); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  async function submit(payload) { setBusy(true); try { await updateRole(id, payload); navigate('/admin/roles'); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị · Vai trò" title="Sửa mô tả vai trò" /><ApiState loading={!role && !error} error={error} onRetry={load}>{role && <section className="panel"><RoleForm initial={role} edit onSubmit={submit} busy={busy} error={error} /></section>}</ApiState></>;
}
