import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole } from '../../../api/roleApi';
import PageHeader from '../../../components/common/PageHeader';
import RoleForm from '../../../components/roles/RoleForm';
export default function RoleCreatePage() {
  const navigate = useNavigate(); const [busy, setBusy] = React.useState(false); const [error, setError] = React.useState(null);
  async function submit(payload) { setBusy(true); setError(null); try { await createRole(payload); navigate('/admin/roles'); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị · Vai trò" title="Tạo vai trò" /><section className="panel"><RoleForm onSubmit={submit} busy={busy} error={error} /></section></>;
}
