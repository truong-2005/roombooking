import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminAuthLayout() {
  return <main className="auth-shell admin-auth-shell">
    <section className="auth-brand">
      <Link to="/admin/login" className="brand-mark">RB</Link>
      <span>Room Booking · Admin</span>
      <p>Cổng quản trị dành riêng cho tài khoản có quyền Admin.</p>
    </section>
    <section className="auth-content"><Outlet /></section>
  </main>;
}
