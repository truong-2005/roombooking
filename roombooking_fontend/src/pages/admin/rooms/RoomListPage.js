import React from 'react';
import { Link } from 'react-router-dom';
import { deleteRoom, searchRooms, updateRoomStatus } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import RoomFilter from '../../../components/rooms/RoomFilter';
import RoomTable from '../../../components/rooms/RoomTable';
import Pagination from '../../../components/common/Pagination';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Button from '../../../components/common/Button';
import { PAGE_SIZE } from '../../../utils/constants';
import { getPageData } from '../../../utils/formatUtils';
export default function RoomListPage() {
  const [filters, setFilters] = React.useState({ keyword: '', type: '', minCapacity: '', active: '' }); const [page, setPage] = React.useState(0);
  const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [remove, setRemove] = React.useState(null);
  const load = React.useCallback(async (signal) => { try { setError(null); const response = await searchRooms({ ...filters, minCapacity: filters.minCapacity || undefined, keyword: filters.keyword || undefined, type: filters.type || undefined, active: filters.active === '' ? undefined : filters.active === 'true', page, size: PAGE_SIZE, sortBy: 'name', sortDir: 'asc', signal }); setData(getPageData(response)); } catch (e) { if (e.code !== 'ERR_CANCELED') setError(e); } }, [filters, page]);
  React.useEffect(() => { const c = new AbortController(); load(c.signal); return () => c.abort(); }, [load]);
  async function toggle(room) { try { await updateRoomStatus(room.id, !room.active); await load(); } catch (e) { setError(e); } }
  async function removeRoom() { try { await deleteRoom(remove.id); setRemove(null); await load(); } catch (e) { setError(e); } }
  return <><PageHeader eyebrow="Quản trị" title="Phòng họp" description="Quản lý danh mục và trạng thái phòng." actions={<Link className="button button-primary" to="/admin/rooms/new">Thêm phòng</Link>} />
    <section className="panel"><RoomFilter includeStatus values={filters} onChange={(key, value) => { setFilters((old) => ({ ...old, [key]: value })); setPage(0); }} />
      <ApiState loading={!data && !error} error={error} empty={Boolean(data && !data.content.length)} onRetry={load} emptyTitle="Không có phòng phù hợp"><RoomTable rows={data?.content || []} actions={(room) => <><Link className="button button-secondary" to={'/admin/rooms/' + room.id}>Chi tiết</Link><Link className="button button-secondary" to={'/admin/rooms/' + room.id + '/edit'}>Sửa</Link><Button variant="quiet" onClick={() => toggle(room)}>{room.active ? 'Ngừng hoạt động' : 'Kích hoạt'}</Button><Button variant="danger" onClick={() => setRemove(room)}>Xóa</Button></>} /></ApiState>
      {data && <Pagination page={data.page ?? page} totalPages={data.totalPages} onChange={setPage} />}
    </section><ConfirmDialog open={Boolean(remove)} title="Xóa phòng" message={'Xóa phòng ' + (remove?.name || '') + '?'} onCancel={() => setRemove(null)} onConfirm={removeRoom} confirmLabel="Xóa phòng" />
  </>;
}
