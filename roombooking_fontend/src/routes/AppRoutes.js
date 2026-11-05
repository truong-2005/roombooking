import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import AdminAuthLayout from '../layouts/AdminAuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ClientLayout from '../layouts/ClientLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';
import AdminRegisterRoute from '../components/auth/AdminRegisterRoute';
import GuestRoute from '../components/auth/GuestRoute';
import LoginPage from '../pages/auth/LoginPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import AdminRoutes from './AdminRoutes';
import ClientRoutes from './ClientRoutes';
import NotFoundPage from '../pages/NotFoundPage';
import { useAuth } from '../hooks/useAuth';

function ClientHomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <ClientRoutes.Home /> : <Navigate to="/rooms" replace />;
}

export default function AppRoutes() {
  return <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
    </Route>
    <Route element={<AdminAuthLayout />}>
      <Route path="/admin/login" element={<GuestRoute><AdminLoginPage /></GuestRoute>} />
      <Route path="/admin/register" element={<AdminRegisterRoute><RegisterPage admin /></AdminRegisterRoute>} />
      <Route path="/admin/forgot-password" element={<GuestRoute><ForgotPasswordPage routePrefix="/admin" /></GuestRoute>} />
      <Route path="/admin/reset-password" element={<GuestRoute><ResetPasswordPage routePrefix="/admin" /></GuestRoute>} />
    </Route>

    {/* Khu vực Admin - Bắt buộc Đăng nhập và có quyền ROLE_ADMIN */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminRoutes.Dashboard />} />
          <Route path="users" element={<AdminRoutes.Users />} />
          <Route path="users/new" element={<AdminRoutes.UserCreate />} />
          <Route path="users/:id" element={<AdminRoutes.UserDetail />} />
          <Route path="users/:id/edit" element={<AdminRoutes.UserEdit />} />
          <Route path="roles" element={<AdminRoutes.Roles />} />
          <Route path="roles/new" element={<AdminRoutes.RoleCreate />} />
          <Route path="roles/:id/edit" element={<AdminRoutes.RoleEdit />} />
          <Route path="rooms" element={<AdminRoutes.Rooms />} />
          <Route path="rooms/new" element={<AdminRoutes.RoomCreate />} />
          <Route path="rooms/:id" element={<AdminRoutes.RoomDetail />} />
          <Route path="rooms/:id/edit" element={<AdminRoutes.RoomEdit />} />
          <Route path="bookings" element={<AdminRoutes.Bookings />} />
          <Route path="bookings/pending" element={<AdminRoutes.Pending />} />
          <Route path="bookings/:id" element={<AdminRoutes.BookingDetail />} />
          <Route path="bookings/:id/edit" element={<AdminRoutes.BookingEdit />} />
          <Route path="bookings/:id/history" element={<AdminRoutes.BookingHistory />} />
          <Route path="schedule" element={<AdminRoutes.Schedule />} />
          <Route path="statistics/bookings" element={<AdminRoutes.BookingStatistics />} />
          <Route path="statistics/rooms" element={<AdminRoutes.RoomUsage />} />
          <Route path="profile" element={<AdminRoutes.Profile />} />
          <Route path="profile/edit" element={<AdminRoutes.EditProfile />} />
          <Route path="profile/password" element={<AdminRoutes.ChangePassword />} />
        </Route>
      </Route>
    </Route>

    {/* Khu vực Client */}
    <Route element={<ClientLayout />}>
      {/* Route công khai: Khách chưa đăng nhập được xem tự do */}
      <Route index element={<ClientHomeRoute />} />
      <Route path="rooms" element={<ClientRoutes.RoomSearch />} />
      <Route path="rooms/available" element={<ClientRoutes.AvailableRooms />} />
      <Route path="rooms/:id" element={<ClientRoutes.RoomDetail />} />
      <Route path="schedule" element={<ClientRoutes.Schedule />} />

      {/* Route yêu cầu đăng nhập: Tạo/quản lý đặt phòng, hồ sơ cá nhân */}
      <Route element={<ProtectedRoute />}>
        <Route path="bookings/new" element={<ClientRoutes.CreateBooking />} />
        <Route path="bookings" element={<ClientRoutes.MyBookings />} />
        <Route path="bookings/:id" element={<ClientRoutes.BookingDetail />} />
        <Route path="bookings/:id/edit" element={<ClientRoutes.EditBooking />} />
        <Route path="bookings/:id/reschedule" element={<ClientRoutes.Reschedule />} />
        <Route path="schedule/mine" element={<ClientRoutes.MySchedule />} />
        <Route path="notifications" element={<ClientRoutes.Notifications />} />
        <Route path="profile" element={<ClientRoutes.Profile />} />
        <Route path="profile/edit" element={<ClientRoutes.EditProfile />} />
        <Route path="profile/password" element={<ClientRoutes.ChangePassword />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
