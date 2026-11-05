import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../common/Loading';
export default function GuestRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  return children || <Outlet />;
}
