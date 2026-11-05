import React from 'react';
import { getWeeklySchedule } from '../../../api/bookingScheduleApi';
import { searchRooms } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import WeeklyCalendar from '../../../components/schedule/WeeklyCalendar';
import { startOfWeek } from '../../../utils/dateUtils';
export default function AdminWeeklySchedulePage() {
  const [date, setDate] = React.useState(startOfWeek()); const [roomId, setRoomId] = React.useState(''); const [rooms, setRooms] = React.useState([]); const [schedule, setSchedule] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { searchRooms({ page: 0, size: 100, sortBy: 'name', sortDir: 'asc' }).then((r) => setRooms(r.data?.content || [])).catch(setError); }, []);
  const load = React.useCallback(async (params = { date, roomId: roomId || undefined }) => { setBusy(true); setError(null); try { const response = await getWeeklySchedule(params); setSchedule(response.data); } catch (e) { setError(e); } finally { setBusy(false); } }, [date, roomId]);
  React.useEffect(() => { load(); }, [load]);
  return <><PageHeader eyebrow="Lịch phòng" title="Lịch tuần chung" description="Lịch tuần từ API; bộ lọc phòng là tùy chọn theo contract." /><section className="panel"><form className="filter-row" onSubmit={(e) => { e.preventDefault(); load({ date, roomId: roomId || undefined }); }}><Input label="Tuần bắt đầu" type="date" required value={date} onChange={(e) => setDate(e.target.value)} /><Select label="Phòng" value={roomId} placeholder="Tất cả phòng" options={rooms.map((room) => ({ value: room.id, label: room.code + ' · ' + room.name }))} onChange={(e) => setRoomId(e.target.value)} /><Button type="submit" loading={busy}>Tải lịch</Button></form>
    <ApiState loading={busy && !schedule} error={error} onRetry={() => load()}>{schedule && <><p className="muted">{schedule.weekStart} – {schedule.weekEnd}{schedule.roomName ? ' · ' + schedule.roomName : ''}</p><WeeklyCalendar schedule={schedule} date={schedule.weekStart} /></>}</ApiState>
  </section></>;
}
