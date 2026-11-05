import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../common/Loading';
export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin, portal } = useAuth();
  const location = useLocation();
  if (loading) return <Loading label="Đang xác minh phiên đăng nhập…" />;
  const loginPath = portal === 'admin' ? '/admin/login' : '/login';
  if (!user || (portal === 'admin' && !isAdmin) || (portal === 'client' && isAdmin)) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }
  return children || <Outlet />;
}
