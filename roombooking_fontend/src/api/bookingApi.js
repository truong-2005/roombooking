import client from './axiosClient';
export const searchBookings = ({ signal, ...params } = {}) => client.get('/api/bookings', { params, signal });
export const createBooking = (payload) => client.post('/api/bookings', payload);
export const getBooking = (id) => client.get('/api/bookings/' + encodeURIComponent(id));
export const updateBooking = (id, payload) => client.put('/api/bookings/' + encodeURIComponent(id), payload);
export const deleteBooking = (id) => client.delete('/api/bookings/' + encodeURIComponent(id));
export const cancelBooking = (id, reason) => client.patch('/api/bookings/' + encodeURIComponent(id) + '/cancel', { reason });
export const getBookingHistory = (id) => client.get('/api/bookings/' + encodeURIComponent(id) + '/history');
export const checkBookingConflicts = (params) => client.get('/api/bookings/conflicts', { params });
