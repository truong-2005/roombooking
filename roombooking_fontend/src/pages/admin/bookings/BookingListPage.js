import React from 'react';
import { Link } from 'react-router-dom';
import { deleteBooking, searchBookings } from '../../../api/bookingApi';
import { decideBooking } from '../../../api/bookingApprovalApi';
import PageHeader from '../../../components/common/PageHeader';
import BookingFilter from '../../../components/bookings/BookingFilter';
import BookingTable from '../../../components/bookings/BookingTable';
import BookingDecisionSelect from '../../../components/bookings/BookingDecisionSelect';
import ApiState from '../../../components/common/ApiState';
import Pagination from '../../../components/common/Pagination';
import { PAGE_SIZE } from '../../../utils/constants';
import { getPageData } from '../../../utils/formatUtils';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Button from '../../../components/common/Button';
export default function BookingListPage() {
  const [filters, setFilters] = React.useState({}); const [page, setPage] = React.useState(0); const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [remove, setRemove] = React.useState(null); const [busyId, setBusyId] = React.useState(null);
  const load = React.useCallback(async (signal) => { try { setError(null); const response = await searchBookings({ ...filters, page, size: PAGE_SIZE, sortBy: 'startTime', sortDir: 'desc', signal }); setData(getPageData(response)); } catch (e) { if (e.code !== 'ERR_CANCELED') setError(e); } }, [filters, page]);
  React.useEffect(() => { const c = new AbortController(); load(c.signal); return () => c.abort(); }, [load]);
  async function decide(id, status) {
    if (!['APPROVED', 'REJECTED'].includes(status)) return;
    setBusyId(id); setError(null);
    try {
      const approved = status === 'APPROVED';
      let reason;
      if (!approved) { reason = window.prompt('Nhập lý do từ chối (bắt buộc):'); if (!reason?.trim()) return; }
      await decideBooking(id, { approved, ...(reason ? { reason: reason.trim() } : {}) });
      await load();
    } catch (e) { setError(e); } finally { setBusyId(null); }
  }
  return <><PageHeader eyebrow="Quản trị" title="Đặt phòng" description="Tra cứu các yêu cầu đặt phòng trên hệ thống." actions={<Link className="button button-secondary" to="/admin/bookings/pending">Yêu cầu chờ duyệt</Link>} />
    <section className="panel"><BookingFilter adminFilters values={filters} onChange={(key, value) => { setFilters((old) => ({ ...old, [key]: value || undefined })); setPage(0); }} /><ApiState loading={!data && !error} error={error} empty={Boolean(data && !data.content.length)} onRetry={load} emptyTitle="Không có đặt phòng"><BookingTable rows={data?.content || []} actions={(booking) => <><Link className="button button-secondary" to={'/admin/bookings/' + booking.id}>Chi tiết</Link>{booking.status === 'PENDING' && <BookingDecisionSelect bookingId={booking.id} disabled={busyId === booking.id} onDecision={(status) => decide(booking.id, status)} />}<Button variant="danger" disabled={busyId === booking.id} onClick={() => setRemove(booking)}>Xóa</Button></>} /></ApiState>{data && <Pagination page={data.page ?? page} totalPages={data.totalPages} onChange={setPage} />}</section>
    <ConfirmDialog open={Boolean(remove)} title="Xóa đặt phòng" message={'Xóa yêu cầu "' + remove?.title + '"? Tệp đính kèm liên quan cũng sẽ bị xóa theo backend.'} onCancel={() => setRemove(null)} onConfirm={async () => { try { await deleteBooking(remove.id); setRemove(null); await load(); } catch (e) { setError(e); } }} confirmLabel="Xóa đặt phòng" />
  </>;
}
