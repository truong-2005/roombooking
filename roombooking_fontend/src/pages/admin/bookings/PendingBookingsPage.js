import React from 'react';
import { Link } from 'react-router-dom';
import { decideBooking, listPendingBookings } from '../../../api/bookingApprovalApi';
import PageHeader from '../../../components/common/PageHeader';
import BookingTable from '../../../components/bookings/BookingTable';
import BookingDecisionSelect from '../../../components/bookings/BookingDecisionSelect';
import ApiState from '../../../components/common/ApiState';
import Pagination from '../../../components/common/Pagination';
import { getPageData } from '../../../utils/formatUtils';
import { PAGE_SIZE } from '../../../utils/constants';
export default function PendingBookingsPage() {
  const [page, setPage] = React.useState(0); const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [busyId, setBusyId] = React.useState(null);
  const load = React.useCallback(async (signal) => { try { setError(null); const response = await listPendingBookings({ page, size: PAGE_SIZE, sortBy: 'startTime', sortDir: 'asc', signal }); setData(getPageData(response)); } catch (e) { if (e.code !== 'ERR_CANCELED') setError(e); } }, [page]);
  React.useEffect(() => { const c = new AbortController(); load(c.signal); return () => c.abort(); }, [load]);
  async function decide(id, status) { if (!['APPROVED', 'REJECTED'].includes(status)) return; setBusyId(id); setError(null); try {
    const approved = status === 'APPROVED';
    let reason;
    if (!approved) { reason = window.prompt('Nhập lý do từ chối (bắt buộc):'); if (!reason?.trim()) return; }
    await decideBooking(id, { approved, ...(reason ? { reason: reason.trim() } : {}) });
    await load();
  } catch (e) { setError(e); } finally { setBusyId(null); } }
  return <><PageHeader eyebrow="Quản trị" title="Chờ duyệt" description="Duyệt hoặc từ chối sau khi API xác nhận lịch." />
    <section className="panel"><ApiState loading={!data && !error} error={error} empty={Boolean(data && !data.content.length)} onRetry={load} emptyTitle="Không còn yêu cầu chờ duyệt"><BookingTable rows={data?.content || []} actions={(row) => <><Link className="button button-secondary" to={'/admin/bookings/' + row.id}>Chi tiết</Link><BookingDecisionSelect bookingId={row.id} disabled={busyId === row.id} onDecision={(status) => decide(row.id, status)} /></>} /></ApiState>{data && <Pagination page={data.page ?? page} totalPages={data.totalPages} onChange={setPage} />}</section>
  </>;
}
