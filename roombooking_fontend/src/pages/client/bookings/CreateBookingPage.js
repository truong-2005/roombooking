import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createBooking, checkBookingConflicts } from '../../../api/bookingApi';
import { listActiveRooms } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import BookingForm from '../../../components/bookings/BookingForm';
import BookingConflictWarning from '../../../components/bookings/BookingConflictWarning';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { toApiLocalDateTime } from '../../../utils/dateUtils';
export default function CreateBookingPage() {
  const navigate = useNavigate(); const [query] = useSearchParams();
  const [rooms, setRooms] = React.useState([]); const [roomsError, setRoomsError] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const [conflict, setConflict] = React.useState(null);
  React.useEffect(() => { let alive = true; listActiveRooms().then((response) => { if (alive) setRooms(response.data || []); }).catch((e) => { if (alive) setRoomsError(e); }); return () => { alive = false; }; }, []);
  async function submit(payload) { setBusy(true); setError(null); setConflict(null);
    try {
      const result = await checkBookingConflicts({ roomId: payload.roomId, startTime: toApiLocalDateTime(payload.startTime), endTime: toApiLocalDateTime(payload.endTime) });
      setConflict(result.data);
      if (result.data?.hasConflict) { setBusy(false); return; }
      const response = await createBooking(payload);
      navigate('/bookings/' + response.data.id, { replace: true, state: { created: true } });
    } catch (e) { setError(e); } finally { setBusy(false); }
  }
  return <><PageHeader eyebrow="Đặt phòng" title="Tạo yêu cầu đặt phòng" description="Thời gian phải trong tương lai và trong cùng ngày theo quy tắc backend." />
    {roomsError && <ErrorMessage error={roomsError} onRetry={() => listActiveRooms().then((r) => setRooms(r.data || [])).catch(setRoomsError)} />}
    <BookingConflictWarning result={conflict} />
    {conflict && !conflict.hasConflict && <div className="notice notice-success">Kiểm tra hiện tại không phát hiện xung đột. Backend vẫn xác nhận lại khi lưu.</div>}
    <section className="panel"><BookingForm rooms={rooms} initial={{ roomId: query.get('roomId') || '' }} onSubmit={submit} loading={busy} error={error} /></section>
  </>;
}
