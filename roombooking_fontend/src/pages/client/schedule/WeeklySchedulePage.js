import React from 'react';
import { getWeeklySchedule } from '../../../api/bookingScheduleApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import WeeklyCalendar from '../../../components/schedule/WeeklyCalendar';
import { startOfWeek } from '../../../utils/dateUtils';
export default function WeeklySchedulePage() {
  const [date, setDate] = React.useState(startOfWeek()); const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async (value = date) => { setBusy(true); setError(null); try { const response = await getWeeklySchedule({ date: value }); setData(response.data); } catch (e) { setError(e); } finally { setBusy(false); } }, [date]);
  React.useEffect(() => { load(); }, [load]);
  return <><PageHeader eyebrow="Lịch phòng" title="Lịch tuần" description="Xem lịch đặt phòng chung do backend trả về." /><section className="panel"><form className="filter-row" onSubmit={(e) => { e.preventDefault(); load(date); }}><Input label="Tuần bắt đầu" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /><Button type="submit" loading={busy}>Tải lịch</Button></form><ApiState loading={busy && !data} error={error} onRetry={() => load()}>{data && <><p className="muted">{data.weekStart} – {data.weekEnd}</p><WeeklyCalendar schedule={data} date={data.weekStart} /></>}</ApiState></section></>;
}
