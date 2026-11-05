import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkBookingConflicts, getBooking, updateBooking } from '../../../api/bookingApi';
import { listActiveRooms } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import BookingForm from '../../../components/bookings/BookingForm';
import BookingConflictWarning from '../../../components/bookings/BookingConflictWarning';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { toApiLocalDateTime } from '../../../utils/dateUtils';

export default function BookingEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = React.useState(null);
  const [rooms, setRooms] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [conflict, setConflict] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const [bookingResponse, roomsResponse] = await Promise.all([getBooking(id), listActiveRooms()]);
      setBooking(bookingResponse.data);
      setRooms(roomsResponse.data || []);
      setError(null);
    } catch (requestError) {
      setError(requestError);
    }
  }, [id]);

  React.useEffect(() => { load(); }, [load]);

  async function submit(payload) {
    setBusy(true);
    setError(null);
    setConflict(null);
    try {
      const response = await checkBookingConflicts({
        roomId: payload.roomId,
        startTime: toApiLocalDateTime(payload.startTime),
        endTime: toApiLocalDateTime(payload.endTime),
        excludeBookingId: Number(id),
      });
      setConflict(response.data);
      if (response.data?.hasConflict) return;
      await updateBooking(id, payload);
      navigate('/admin/bookings/' + id, { replace: true });
    } catch (requestError) {
      setError(requestError);
    } finally {
      setBusy(false);
    }
  }

  return <>
    <PageHeader eyebrow="Quản trị · Đặt phòng" title="Chỉnh sửa yêu cầu" description="Chỉ các yêu cầu còn được backend cho phép sửa mới được cập nhật." />
    {error && !booking && <ErrorMessage error={error} onRetry={load} />}
    <ApiState loading={!booking && !error} error={null}>
      {booking && booking.status === 'PENDING' && <section className="panel">
        <BookingConflictWarning result={conflict} />
        {error && <ErrorMessage error={error} />}
        <BookingForm initial={booking} rooms={rooms} onSubmit={submit} loading={busy} error={null} submitLabel="Lưu thay đổi" />
      </section>}
      {booking && booking.status !== 'PENDING' && <div className="notice notice-error">Trạng thái hiện tại không cho phép chỉnh sửa. Backend sẽ quyết định quyền cập nhật cuối cùng.</div>}
    </ApiState>
  </>;
}
