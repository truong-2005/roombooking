import React from 'react';
import { Link } from 'react-router-dom';
import { getUserDashboard } from '../../../api/dashboardApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import StatCard from '../../../components/dashboard/StatCard';
import BookingTable from '../../../components/bookings/BookingTable';
import EmptyState from '../../../components/common/EmptyState';
export default function HomePage() {
  const [data, setData] = React.useState(null); const [error, setError] = React.useState(null);
  const load = React.useCallback(async () => { try { setError(null); const response = await getUserDashboard(); setData(response.data); } catch (e) { setError(e); } }, []);
  React.useEffect(() => { load(); }, [load]);
  return <><PageHeader eyebrow="Không gian của bạn" title="Tổng quan" description="Thông tin tài khoản được tổng hợp từ dịch vụ đặt phòng." actions={<Link className="button button-primary" to="/bookings/new">Đặt phòng</Link>} />
    <ApiState loading={!data && !error} error={error} onRetry={load}>{data && <><div className="stat-grid"><StatCard label="Tổng lượt đặt" value={data.totalBookings} /><StatCard label="Chờ duyệt" value={data.pendingBookings} /><StatCard label="Đã duyệt" value={data.approvedBookings} /><StatCard label="Thông báo chưa đọc" value={data.unreadNotifications} /></div>
      <section className="panel"><div className="row-between"><h2>Lịch đặt sắp tới</h2><Link className="text-button" to="/bookings">Tất cả đặt phòng</Link></div>{data.upcomingBookings?.length ? <BookingTable rows={data.upcomingBookings} actions={(booking) => <Link className="button button-secondary" to={'/bookings/' + booking.id}>Chi tiết</Link>} /> : <EmptyState title="Chưa có lịch đặt sắp tới" />}</section>
      <section className="actions"><Link className="button button-secondary" to="/rooms">Tìm phòng</Link><Link className="button button-secondary" to="/schedule/mine">Lịch tuần của tôi</Link><Link className="button button-secondary" to="/profile">Hồ sơ</Link></section>
    </>}</ApiState>
  </>;
}
