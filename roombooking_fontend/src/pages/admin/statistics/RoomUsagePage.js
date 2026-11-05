import React from 'react';
import { getRoomUsage } from '../../../api/dashboardApi';
import PageHeader from '../../../components/common/PageHeader';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import ApiState from '../../../components/common/ApiState';
import RoomUsageChart from '../../../components/dashboard/RoomUsageChart';
import DataTable from '../../../components/common/DataTable';
export default function RoomUsagePage() {
  const [from, setFrom] = React.useState(''); const [to, setTo] = React.useState(''); const [limit, setLimit] = React.useState('10'); const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async (params = {}) => { setBusy(true); setError(null); try { const response = await getRoomUsage(params); setData(response.data); } catch (e) { setError(e); } finally { setBusy(false); } }, []);
  React.useEffect(() => { load({ limit: 10 }); }, [load]);
  return <><PageHeader eyebrow="Thống kê" title="Mức sử dụng phòng" description="Tần suất và thời lượng từ API thống kê." /><section className="panel"><form className="filter-row" onSubmit={(e) => { e.preventDefault(); load({ from: from || undefined, to: to || undefined, limit: limit || undefined }); }}><Input label="Từ ngày" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /><Input label="Đến ngày" type="date" value={to} onChange={(e) => setTo(e.target.value)} /><Input label="Số phòng" type="number" min="1" value={limit} onChange={(e) => setLimit(e.target.value)} /><Button type="submit" loading={busy}>Lọc</Button></form><ApiState loading={busy && !data} error={error} empty={Boolean(data && !data.length)} onRetry={() => load({ limit: limit || undefined })}><><RoomUsageChart data={data || []} /><DataTable rows={data || []} columns={[{ key: 'roomCode', label: 'Mã phòng' }, { key: 'roomName', label: 'Phòng' }, { key: 'totalBookings', label: 'Tổng lượt đặt' }, { key: 'approvedBookings', label: 'Đã duyệt' }, { key: 'totalHoursBooked', label: 'Tổng giờ' }, { key: 'utilizationPercent', label: 'Mức sử dụng %' }]} /></></ApiState></section></>;
}
