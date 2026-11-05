import React from 'react';
import { getAdminDashboard, getBookingStatistics, getRoomUsage } from '../../../api/dashboardApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import StatCard from '../../../components/dashboard/StatCard';
import BookingStatistics from '../../../components/dashboard/BookingStatistics';
import RoomUsageChart from '../../../components/dashboard/RoomUsageChart';
import BookingTable from '../../../components/bookings/BookingTable';
import EmptyState from '../../../components/common/EmptyState';
import { Link } from 'react-router-dom';
export default function AdminDashboardPage() {
  const [state, setState] = React.useState({ loading: true, error: null, dashboard: null, stats: null, usage: null });
  const load = React.useCallback(async () => { setState((s) => ({ ...s, loading: true, error: null })); try {
    const values = await Promise.all([getAdminDashboard(), getBookingStatistics(), getRoomUsage({ limit: 8 })]);
    setState({ loading: false, error: null, dashboard: values[0].data, stats: values[1].data, usage: values[2].data });
  } catch (error) { setState({ loading: false, error, dashboard: null, stats: null, usage: null }); } }, []);
  React.useEffect(() => { load(); }, [load]);
  const d = state.dashboard;
  return <><PageHeader eyebrow="Tổng quan" title="Bảng điều khiển" description="Dữ liệu tổng hợp từ các endpoint dashboard." />
    <ApiState loading={state.loading} error={state.error} onRetry={load}>{d && <><div className="stat-grid">{[['Tổng người dùng', d.totalUsers], ['Tổng phòng', d.totalRooms], ['Phòng đang hoạt động', d.activeRooms], ['Chờ duyệt', d.pendingApprovals], ['Đặt phòng hôm nay', d.bookingsToday]].map(([label, value]) => <StatCard key={label} label={label} value={value} />)}</div>
      <section className="panel"><h2>Thống kê đặt phòng</h2><BookingStatistics data={state.stats || d.bookingStatistics} /></section>
      <section className="panel"><h2>Mức sử dụng phòng</h2><RoomUsageChart data={state.usage || d.topRooms} /></section>
      <section className="panel"><div className="row-between"><h2>Yêu cầu chờ duyệt gần đây</h2><Link className="text-button" to="/admin/bookings/pending">Xem danh sách</Link></div>{d.recentPendingBookings?.length ? <BookingTable rows={d.recentPendingBookings} actions={(booking) => <Link className="button button-secondary" to={'/admin/bookings/' + booking.id}>Chi tiết</Link>} /> : <EmptyState title="Không có yêu cầu chờ duyệt" />}</section>
    </>}</ApiState>
  </>;
}
