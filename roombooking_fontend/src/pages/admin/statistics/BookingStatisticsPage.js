import React from 'react';
import { getBookingStatistics } from '../../../api/dashboardApi';
import PageHeader from '../../../components/common/PageHeader';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import BookingStatistics from '../../../components/dashboard/BookingStatistics';
import ApiState from '../../../components/common/ApiState';
export default function BookingStatisticsPage() {
  const [from, setFrom] = React.useState(''); const [to, setTo] = React.useState(''); const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async (params = {}) => { setBusy(true); setError(null); try { const response = await getBookingStatistics(params); setData(response.data); } catch (e) { setError(e); } finally { setBusy(false); } }, []);
  React.useEffect(() => { load(); }, [load]);
  return <><PageHeader eyebrow="Thống kê" title="Thống kê đặt phòng" description="Số liệu được trả trực tiếp từ backend." /><section className="panel"><form className="filter-row" onSubmit={(e) => { e.preventDefault(); load({ from: from || undefined, to: to || undefined }); }}><Input label="Từ ngày" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /><Input label="Đến ngày" type="date" value={to} onChange={(e) => setTo(e.target.value)} /><Button type="submit" loading={busy}>Lọc</Button></form><ApiState loading={busy && !data} error={error} empty={Boolean(data && !Object.keys(data).length)} onRetry={() => load()}><BookingStatistics data={data} /></ApiState></section></>;
}
