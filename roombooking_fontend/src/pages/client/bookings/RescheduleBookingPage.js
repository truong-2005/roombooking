import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBooking } from '../../../api/bookingApi';
import { rescheduleBooking } from '../../../api/bookingScheduleApi';
import { listActiveRooms } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import TextArea from '../../../components/common/TextArea';
import Button from '../../../components/common/Button';
import BookingConflictWarning from '../../../components/bookings/BookingConflictWarning';
import { toApiLocalDateTime } from '../../../utils/dateUtils';
import { checkBookingConflicts } from '../../../api/bookingApi';
export default function RescheduleBookingPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const [booking, setBooking] = React.useState(null); const [rooms, setRooms] = React.useState([]); const [values, setValues] = React.useState({ newRoomId: '', newStartTime: '', newEndTime: '', reason: '' }); const [error, setError] = React.useState(null); const [conflict, setConflict] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async () => { try { const [b, r] = await Promise.all([getBooking(id), listActiveRooms()]); setBooking(b.data); setRooms(r.data || []); setValues({ newRoomId: b.data.roomId, newStartTime: String(b.data.startTime).slice(0, 16), newEndTime: String(b.data.endTime).slice(0, 16), reason: '' }); setError(null); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  async function submit(event) { event.preventDefault(); setBusy(true); setError(null); setConflict(null);
    try {
      const check = await checkBookingConflicts({ roomId: Number(values.newRoomId || booking.roomId), startTime: toApiLocalDateTime(values.newStartTime), endTime: toApiLocalDateTime(values.newEndTime), excludeBookingId: Number(id) });
      setConflict(check.data); if (check.data?.hasConflict) return;
      await rescheduleBooking(id, { newRoomId: values.newRoomId ? Number(values.newRoomId) : undefined, newStartTime: toApiLocalDateTime(values.newStartTime), newEndTime: toApiLocalDateTime(values.newEndTime), reason: values.reason || undefined });
      navigate('/bookings/' + id, { replace: true });
    } catch (e) { setError(e); } finally { setBusy(false); }
  }
  return <><PageHeader eyebrow="Đặt phòng" title="Dời lịch đặt phòng" description="Yêu cầu dời lịch sẽ chờ backend duyệt lại." /><ApiState loading={!booking && !error} error={error} onRetry={load}>{booking && <section className="panel"><form className="form-grid" onSubmit={submit}><Select label="Phòng mới" value={values.newRoomId} onChange={(e) => setValues({ ...values, newRoomId: e.target.value })} options={rooms.map((room) => ({ value: room.id, label: room.code + ' · ' + room.name }))} /><Input label="Bắt đầu mới" type="datetime-local" required value={values.newStartTime} onChange={(e) => setValues({ ...values, newStartTime: e.target.value })} /><Input label="Kết thúc mới" type="datetime-local" required value={values.newEndTime} onChange={(e) => setValues({ ...values, newEndTime: e.target.value })} /><TextArea label="Lý do dời lịch" maxLength="500" value={values.reason} onChange={(e) => setValues({ ...values, reason: e.target.value })} />{error && <p className="field-error form-wide">{error.message || error}</p>}<BookingConflictWarning result={conflict} /><div className="form-wide"><Button type="submit" loading={busy}>Gửi yêu cầu dời lịch</Button></div></form></section>}</ApiState></>;
}
