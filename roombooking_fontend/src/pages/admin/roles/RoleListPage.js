import React from 'react';
import { Link } from 'react-router-dom';
import { deleteRole, listRoles } from '../../../api/roleApi';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import ApiState from '../../../components/common/ApiState';
import Button from '../../../components/common/Button';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
export default function RoleListPage() {
  const [roles, setRoles] = React.useState(null); const [error, setError] = React.useState(null); const [remove, setRemove] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async () => { try { setError(null); const response = await listRoles(); setRoles(response.data); } catch (e) { setError(e); } }, []);
  React.useEffect(() => { load(); }, [load]);
  async function confirmDelete() { setBusy(true); try { await deleteRole(remove.id); setRemove(null); await load(); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị" title="Vai trò" description="Vai trò được lấy trực tiếp từ dịch vụ quản lý quyền." actions={<Link className="button button-primary" to="/admin/roles/new">Tạo vai trò</Link>} />
    <section className="panel"><ApiState loading={!roles && !error} error={error} empty={Boolean(roles && !roles.length)} onRetry={load}><DataTable rows={roles || []} columns={[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Tên vai trò' }, { key: 'description', label: 'Mô tả' }]} actions={(role) => <><Link className="button button-secondary" to={'/admin/roles/' + role.id + '/edit'}>Sửa</Link><Button variant="danger" onClick={() => setRemove(role)}>Xóa</Button></>} /></ApiState></section>
    <ConfirmDialog open={Boolean(remove)} title="Xóa vai trò" message={'Xóa vai trò ' + remove?.name + '?'} busy={busy} onCancel={() => setRemove(null)} onConfirm={confirmDelete} confirmLabel="Xóa vai trò" />
  </>;
}
