import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBooking, getBookingHistory } from '../../../api/bookingApi';
import { decideBooking } from '../../../api/bookingApprovalApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import BookingDetail from '../../../components/bookings/BookingDetail';
import BookingHistory from '../../../components/bookings/BookingHistory';
import BookingAttachments from '../../../components/bookings/BookingAttachments';
import BookingDecisionSelect from '../../../components/bookings/BookingDecisionSelect';
export default function BookingDetailPage() {
  const { id } = useParams(); const [booking, setBooking] = React.useState(null); const [history, setHistory] = React.useState([]); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async () => { try { const [b, h] = await Promise.all([getBooking(id), getBookingHistory(id)]); setBooking(b.data); setHistory(h.data || []); setError(null); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  async function decision(status) { if (!['APPROVED', 'REJECTED'].includes(status)) return; setBusy(true); try { const approved = status === 'APPROVED'; let reason; if (!approved) { reason = window.prompt('Nhập lý do từ chối (bắt buộc):'); if (!reason?.trim()) return; } await decideBooking(id, { approved, ...(reason ? { reason: reason.trim() } : {}) }); await load(); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị · Đặt phòng" title={booking?.title || 'Chi tiết đặt phòng'} actions={<>{booking?.status === 'PENDING' && <Link className="button button-secondary" to={'/admin/bookings/' + id + '/edit'}>Sửa yêu cầu</Link>}<Link className="button button-secondary" to={'/admin/bookings/' + id + '/history'}>Xem lịch sử</Link></>} />
    <ApiState loading={!booking && !error} error={error} onRetry={load}>{booking && <><section className="panel"><BookingDetail booking={booking} />{booking.status === 'PENDING' && <div className="actions" style={{ marginTop: 17 }}><BookingDecisionSelect bookingId={id} disabled={busy} onDecision={decision} /></div>}</section><section className="panel"><h2>Lịch sử trạng thái</h2><BookingHistory history={history} /></section><BookingAttachments bookingId={id} /></>}</ApiState>
  </>;
}
