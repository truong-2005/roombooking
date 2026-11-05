import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from '../components/notifications/NotificationBell';
import Avatar from '../components/common/Avatar';

export default function ClientLayout() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  async function logout() {
    try {
      await signOut(false);
    } finally {
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="client-shell">
      <header className="client-header">
        <NavLink to="/" className="brand">
          <span className="brand-mark">RB</span>
          <span>Room Booking</span>
        </NavLink>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Mở menu">
          ☰
        </button>
        <nav className={open ? 'client-nav nav-open' : 'client-nav'}>
          {user ? (
            <>
              <NavLink to="/" end onClick={() => setOpen(false)}>Tổng quan</NavLink>
              <NavLink to="/rooms" onClick={() => setOpen(false)}>Tìm phòng</NavLink>
              <NavLink to="/bookings" onClick={() => setOpen(false)}>Đặt phòng của tôi</NavLink>
              <NavLink to="/schedule/mine" onClick={() => setOpen(false)}>Lịch của tôi</NavLink>
              <NavLink to="/notifications" onClick={() => setOpen(false)}>Thông báo</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/rooms" onClick={() => setOpen(false)}>Tìm phòng</NavLink>
              <NavLink to="/schedule" onClick={() => setOpen(false)}>Lịch phòng</NavLink>
            </>
          )}

          {/* CHỈ hiển thị liên kết Quản trị khi người dùng ĐÃ ĐĂNG NHẬP và CÓ QUYỀN ADMIN */}
          {user && isAdmin && (
            <NavLink
              to="/admin"
              className="admin-entry-link font-semibold text-amber-600 hover:text-amber-700"
              onClick={() => setOpen(false)}
            >
              Khu vực Quản trị
            </NavLink>
          )}
        </nav>
        <div className="topbar-tools">
          {user ? (
            <>
              <NotificationBell />
              <NavLink to="/profile" aria-label="Hồ sơ">
                <Avatar user={user} size="sm" />
              </NavLink>
              <button className="text-button" onClick={logout}>Đăng xuất</button>
            </>
          ) : (
            <div className="auth-tools" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <NavLink
                to="/login"
                className="button button-secondary"
                style={{ minHeight: 34, padding: '6px 14px', fontSize: 13 }}
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/register"
                className="button button-primary"
                style={{ minHeight: 34, padding: '6px 14px', fontSize: 13 }}
              >
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>
      </header>
      <main className="client-content">
        <Outlet />
      </main>
      <footer className="client-footer">Room Booking · Quản lý đặt phòng</footer>
    </div>
  );
}
