import React from 'react';
import { Link, Outlet } from 'react-router-dom';
export default function AuthLayout() {
  return <main className="auth-shell"><section className="auth-brand"><Link to="/" className="brand-mark">RB</Link><span>Room Booking</span><p>Quản lý và sử dụng không gian họp tập trung.</p></section><section className="auth-content"><Outlet /></section></main>;
}
