import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBooking, getBookingHistory } from '../../../api/bookingApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import BookingDetail from '../../../components/bookings/BookingDetail';
import BookingHistory from '../../../components/bookings/BookingHistory';
import BookingAttachments from '../../../components/bookings/BookingAttachments';
export default function MyBookingDetailPage() {
  const { id } = useParams(); const [data, setData] = React.useState(null); const [history, setHistory] = React.useState([]); const [error, setError] = React.useState(null);
  const load = React.useCallback(async () => { try { setError(null); const [booking, past] = await Promise.all([getBooking(id), getBookingHistory(id)]); setData(booking.data); setHistory(past.data || []); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  return <><PageHeader eyebrow="Đặt phòng" title={data?.title || 'Chi tiết đặt phòng'} actions={data?.status === 'PENDING' && <><Link className="button button-secondary" to={'/bookings/' + id + '/edit'}>Sửa yêu cầu</Link><Link className="button button-secondary" to={'/bookings/' + id + '/reschedule'}>Dời lịch</Link></>} /><ApiState loading={!data && !error} error={error} onRetry={load}>{data && <><section className="panel"><BookingDetail booking={data} /></section><section className="panel"><h2>Lịch sử</h2><BookingHistory history={history} /></section><BookingAttachments bookingId={id} /></>}</ApiState></>;
}
