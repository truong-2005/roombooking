import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from '../components/notifications/NotificationBell';
import Avatar from '../components/common/Avatar';

const links = [
  ['/admin', 'Tổng quan', true], ['/admin/users', 'Người dùng'], ['/admin/roles', 'Vai trò'],
  ['/admin/rooms', 'Phòng họp'], ['/admin/bookings', 'Đặt phòng'], ['/admin/bookings/pending', 'Chờ duyệt'],
  ['/admin/schedule', 'Lịch tuần'], ['/admin/statistics/bookings', 'Thống kê đặt phòng'], ['/admin/statistics/rooms', 'Sử dụng phòng'],
];
export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  async function logout() { try { await signOut(false); } finally { navigate('/admin/login', { replace: true }); } }
  return <div className="app-shell admin-shell">
    <aside className={'sidebar ' + (open ? 'sidebar-open' : '')}><div className="sidebar-brand"><span className="brand-mark">RB</span><span>Room Booking</span></div>
      <p className="nav-caption">QUẢN TRỊ</p><nav>{links.map(([to, label, exact]) => <NavLink key={to} to={to} end={exact} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav>
      <div className="sidebar-footer"><NavLink to="/admin/profile">Hồ sơ của tôi</NavLink><button onClick={logout}>Đăng xuất</button></div>
    </aside>
    <div className="workspace"><header className="topbar"><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Mở menu">☰</button><div><span className="eyebrow">Không gian quản trị</span><strong>Xin chào, {user?.fullName || user?.username}</strong></div><div className="topbar-tools"><NotificationBell /><Avatar user={user} size="sm" /></div></header><main className="page-content"><Outlet /></main></div>
  </div>;
}
