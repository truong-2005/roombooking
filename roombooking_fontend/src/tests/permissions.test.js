import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminRoute from '../components/auth/AdminRoute';
import ProtectedRoute from '../components/auth/ProtectedRoute';

jest.mock('../hooks/useAuth', () => ({ useAuth: jest.fn() }));
// eslint-disable-next-line import/first
import { useAuth } from '../hooks/useAuth';

afterEach(() => jest.clearAllMocks());

test('redirects a signed-in user without ROLE_ADMIN to the admin login portal', async () => {
  useAuth.mockReturnValue({ user: { roles: ['ROLE_USER'] }, loading: false, isAdmin: false });
  render(<MemoryRouter initialEntries={['/admin']}><Routes>
    <Route path="/admin" element={<AdminRoute><div>Admin only</div></AdminRoute>} />
    <Route path="/admin/login" element={<div>Admin sign in</div>} />
  </Routes></MemoryRouter>);
  expect(await screen.findByText('Admin sign in')).toBeInTheDocument();
  expect(screen.queryByText('Admin only')).not.toBeInTheDocument();
});

test('redirects guests to the login route', async () => {
  useAuth.mockReturnValue({ user: null, loading: false, isAdmin: false });
  render(<MemoryRouter initialEntries={['/private']}><Routes>
    <Route element={<ProtectedRoute />}><Route path="/private" element={<div>Private data</div>} /></Route>
    <Route path="/login" element={<div>Sign in</div>} />
  </Routes></MemoryRouter>);
  expect(await screen.findByText('Sign in')).toBeInTheDocument();
});

test('ClientLayout hides Admin link for guests and normal users, but shows it for admin', async () => {
  const ClientLayout = require('../layouts/ClientLayout').default;

  // 1. Guest
  useAuth.mockReturnValue({ user: null, loading: false, isAdmin: false, signOut: jest.fn() });
  const { rerender } = render(<MemoryRouter><ClientLayout /></MemoryRouter>);
  expect(screen.queryByText(/Quản trị/i)).not.toBeInTheDocument();
  expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
  expect(screen.getByText('Đăng ký')).toBeInTheDocument();

  // 2. Normal User
  useAuth.mockReturnValue({
    user: { id: 1, username: 'user1', fullName: 'User One', roles: ['ROLE_USER'] },
    loading: false,
    isAdmin: false,
    signOut: jest.fn(),
  });
  rerender(<MemoryRouter><ClientLayout /></MemoryRouter>);
  expect(screen.queryByText(/Quản trị/i)).not.toBeInTheDocument();
  expect(screen.getByText('Đăng xuất')).toBeInTheDocument();

  // 3. Admin User
  useAuth.mockReturnValue({
    user: { id: 2, username: 'admin1', fullName: 'Admin One', roles: ['ROLE_ADMIN'] },
    loading: false,
    isAdmin: true,
    signOut: jest.fn(),
  });
  rerender(<MemoryRouter><ClientLayout /></MemoryRouter>);
  expect(screen.getByText(/Quản trị/i)).toBeInTheDocument();
});
