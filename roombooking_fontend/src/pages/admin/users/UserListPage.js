import React from 'react';
import { Link } from 'react-router-dom';
import { searchUsers, updateUserStatus, deleteUser } from '../../../api/userApi';
import PageHeader from '../../../components/common/PageHeader';
import SearchBar from '../../../components/common/SearchBar';
import DataTable from '../../../components/common/DataTable';
import ApiState from '../../../components/common/ApiState';
import Pagination from '../../../components/common/Pagination';
import Button from '../../../components/common/Button';
import StatusBadge from '../../../components/common/StatusBadge';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { getPageData } from '../../../utils/formatUtils';
import { PAGE_SIZE } from '../../../utils/constants';
import Select from '../../../components/common/Select';
import { listRoles } from '../../../api/roleApi';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Avatar from '../../../components/common/Avatar';
export default function UserListPage() {
  const [query, setQuery] = React.useState(''); const [enabled, setEnabled] = React.useState(''); const [role, setRole] = React.useState(''); const [roles, setRoles] = React.useState([]); const [rolesError, setRolesError] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [confirm, setConfirm] = React.useState(null);
  React.useEffect(() => { let active = true; listRoles().then((response) => { if (active) { setRoles(response.data || []); setRolesError(null); } }).catch((e) => { if (active) setRolesError(e); }); return () => { active = false; }; }, []);
  const load = React.useCallback(async (signal) => { try { setError(null); const response = await searchUsers({ keyword: query || undefined, enabled: enabled === '' ? undefined : enabled === 'true', role: role || undefined, page, size: PAGE_SIZE, sortBy: 'id', sortDir: 'desc', signal }); setData(getPageData(response)); } catch (e) { if (e.code !== 'ERR_CANCELED') setError(e); } }, [query, enabled, role, page]);
  React.useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, [load]);
  async function action(fn) { setBusy(true); try { await fn(); setConfirm(null); await load(); } catch (e) { setError(e); } finally { setBusy(false); } }
  const rows = data?.content || [];
  return <><PageHeader eyebrow="Quản trị" title="Người dùng" description="Tìm kiếm và quản lý tài khoản." actions={<Link className="button button-primary" to="/admin/users/new">Tạo người dùng</Link>} />
    <section className="panel"><SearchBar value={query} onChange={(value) => setQuery(value)} onSubmit={() => setPage(0)} placeholder="Tên, email hoặc từ khóa" />{rolesError && <ErrorMessage error={rolesError} onRetry={() => listRoles().then((response) => { setRoles(response.data || []); setRolesError(null); }).catch(setRolesError)} />}<div className="filter-row"><Select label="Trạng thái tài khoản" value={enabled} placeholder="Mọi trạng thái" options={[{ value: 'true', label: 'Đang hoạt động' }, { value: 'false', label: 'Đã khóa' }]} onChange={(e) => { setEnabled(e.target.value); setPage(0); }} /><Select label="Vai trò" value={role} placeholder="Mọi vai trò" options={roles.map((item) => ({ value: item.name, label: item.name }))} onChange={(e) => { setRole(e.target.value); setPage(0); }} /></div>
      <ApiState loading={!data && !error} error={error} empty={Boolean(data && !rows.length)} onRetry={load} emptyTitle="Không tìm thấy người dùng">
        <DataTable rows={rows} columns={[{ key: 'avatarPreview', label: 'Ảnh đại diện', render: (_, row) => <Avatar user={row} size="sm" /> }, { key: 'id', label: 'ID' }, { key: 'fullName', label: 'Họ tên' }, { key: 'username', label: 'Tài khoản' }, { key: 'email', label: 'Email' }, { key: 'roles', label: 'Vai trò' }, { key: 'enabled', label: 'Trạng thái', render: (v) => <StatusBadge value={v ? 'ACTIVE' : 'INACTIVE'} /> }]} actions={(row) => <><Link className="button button-secondary" to={'/admin/users/' + row.id}>Xem</Link><Link className="button button-secondary" to={'/admin/users/' + row.id + '/edit'}>Sửa</Link><Button variant="quiet" onClick={() => action(() => updateUserStatus(row.id, !row.enabled))}>{row.enabled ? 'Khóa' : 'Mở khóa'}</Button><Button variant="danger" onClick={() => setConfirm(row)}>Xóa</Button></>} />
      </ApiState>
      {data && <Pagination page={data.page ?? page} totalPages={data.totalPages || 0} onChange={setPage} />}
    </section>
    <ConfirmDialog open={Boolean(confirm)} title="Xóa người dùng" message={'Xóa tài khoản ' + (confirm?.username || '') + '? Thao tác này không thể hoàn tác.'} busy={busy} onCancel={() => setConfirm(null)} onConfirm={() => action(() => deleteUser(confirm.id))} confirmLabel="Xóa người dùng" />
  </>;
}
