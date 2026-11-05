import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBookingHistory } from '../../../api/bookingApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import BookingHistory from '../../../components/bookings/BookingHistory';
export default function BookingHistoryPage() {
  const { id } = useParams(); const [data, setData] = React.useState(null); const [error, setError] = React.useState(null);
  const load = React.useCallback(async () => { try { const response = await getBookingHistory(id); setData(response.data); setError(null); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  return <><PageHeader eyebrow="Quản trị · Đặt phòng" title="Lịch sử trạng thái" actions={<Link className="button button-secondary" to={'/admin/bookings/' + id}>Chi tiết đặt phòng</Link>} /><ApiState loading={!data && !error} error={error} empty={Boolean(data && !data.length)} onRetry={load}><section className="panel"><BookingHistory history={data || []} /></section></ApiState></>;
}
