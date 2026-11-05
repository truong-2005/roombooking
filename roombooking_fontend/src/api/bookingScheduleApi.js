import client from './axiosClient';
export const getWeeklySchedule = (params) => client.get('/api/bookings/schedule/weekly', { params });
export const getMyWeeklySchedule = (params) => client.get('/api/bookings/schedule/my-weekly', { params });
export const rescheduleBooking = (bookingId, payload) => client.patch('/api/bookings/' + encodeURIComponent(bookingId) + '/reschedule', payload);
