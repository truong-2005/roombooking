import React from 'react';
import { Link } from 'react-router-dom';
import { deleteBooking, searchBookings, cancelBooking } from '../../../api/bookingApi';
import PageHeader from '../../../components/common/PageHeader';
import BookingFilter from '../../../components/bookings/BookingFilter';
import BookingTable from '../../../components/bookings/BookingTable';
import ApiState from '../../../components/common/ApiState';
import Pagination from '../../../components/common/Pagination';
import Button from '../../../components/common/Button';
import { getPageData } from '../../../utils/formatUtils';
import { PAGE_SIZE } from '../../../utils/constants';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
export default function MyBookingsPage() {
  const [filters, setFilters] = React.useState({}); const [page, setPage] = React.useState(0); const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [remove, setRemove] = React.useState(null);
  const load = React.useCallback(async (signal) => { try { setError(null); const response = await searchBookings({ ...filters, page, size: PAGE_SIZE, sortBy: 'startTime', sortDir: 'desc', signal }); setData(getPageData(response)); } catch (e) { if (e.code !== 'ERR_CANCELED') setError(e); } }, [filters, page]);
  React.useEffect(() => { const c = new AbortController(); load(c.signal); return () => c.abort(); }, [load]);
  function onFilter(key, value) { setFilters((old) => ({ ...old, [key]: value || undefined })); setPage(0); }
  async function cancel(row) { const reason = window.prompt('Nhập lý do hủy (bắt buộc):'); if (!reason?.trim()) return; try { await cancelBooking(row.id, reason.trim()); await load(); } catch (e) { setError(e); } }
  return <><PageHeader eyebrow="Đặt phòng" title="Đặt phòng của tôi" description="Danh sách được backend lọc theo tài khoản đang đăng nhập." actions={<Link className="button button-primary" to="/bookings/new">Tạo đặt phòng</Link>} />
    <section className="panel"><BookingFilter values={filters} onChange={onFilter} /><ApiState loading={!data && !error} error={error} empty={Boolean(data && !data.content.length)} onRetry={load} emptyTitle="Bạn chưa có yêu cầu đặt phòng"><BookingTable rows={data?.content || []} actions={(row) => <><Link className="button button-secondary" to={'/bookings/' + row.id}>Chi tiết</Link>{row.status === 'PENDING' && <><Link className="button button-secondary" to={'/bookings/' + row.id + '/edit'}>Sửa</Link><Link className="button button-secondary" to={'/bookings/' + row.id + '/reschedule'}>Dời lịch</Link><Button variant="danger" onClick={() => cancel(row)}>Hủy</Button></>}{row.status !== 'APPROVED' && <Button variant="danger" onClick={() => setRemove(row)}>Xóa</Button>}</>} /></ApiState>
      {data && <Pagination page={data.page ?? page} totalPages={data.totalPages} onChange={setPage} />}
    </section><ConfirmDialog open={Boolean(remove)} title="Xóa yêu cầu đặt phòng" message={'Xóa yêu cầu "' + remove?.title + '"?'} onCancel={() => setRemove(null)} onConfirm={async () => { try { await deleteBooking(remove.id); setRemove(null); await load(); } catch (e) { setError(e); } }} confirmLabel="Xóa yêu cầu" /></>;
}
