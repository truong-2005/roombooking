import client from './axiosClient';
export const listPendingBookings = ({ signal, ...params } = {}) => client.get('/api/bookings/pending', { params, signal });
export const approveBooking = (bookingId) => client.post('/api/bookings/' + encodeURIComponent(bookingId) + '/approve');
export const rejectBooking = (bookingId, reason) => client.post('/api/bookings/' + encodeURIComponent(bookingId) + '/reject', null, { params: { reason } });
export const decideBooking = (bookingId, payload) => client.post('/api/bookings/' + encodeURIComponent(bookingId) + '/decision', payload);
