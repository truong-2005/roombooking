import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../common/Loading';
import { readSession } from '../../utils/tokenUtils';

export default function AdminRegisterRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loading label="Đang xác minh quyền quản trị…" />;
  if ((user && !isAdmin) || (!user && readSession('client')?.accessToken)) return <Navigate to="/login" replace />;
  return children;
}
