import client from './axiosClient';
export const getAdminDashboard = () => client.get('/api/dashboard/admin');
export const getUserDashboard = () => client.get('/api/dashboard/user');
export const getBookingStatistics = (params) => client.get('/api/dashboard/booking-statistics', { params });
export const getRoomUsage = (params) => client.get('/api/dashboard/room-usage', { params });
