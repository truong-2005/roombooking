import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_ADMIN } from '../../utils/constants';
import Loading from '../common/Loading';
export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loading label="Đang xác minh quyền quản trị…" />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin || !(user.roles || []).includes(ROLE_ADMIN)) return <Navigate to="/admin/login" replace />;
  return children || <Outlet />;
}
