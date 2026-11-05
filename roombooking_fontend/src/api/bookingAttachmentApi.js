import client from './axiosClient';
import { toFormData } from '../utils/fileUtils';
export const listAttachments = (bookingId) => client.get('/api/bookings/' + encodeURIComponent(bookingId) + '/attachments');
export const uploadAttachments = (bookingId, files, metadata = {}) => client.post('/api/bookings/' + encodeURIComponent(bookingId) + '/attachments', toFormData({ ...metadata, files }));
export const downloadAttachment = (bookingId, attachmentId) => client.get('/api/bookings/' + encodeURIComponent(bookingId) + '/attachments/' + encodeURIComponent(attachmentId) + '/download', { responseType: 'blob' });
export const deleteAttachment = (bookingId, attachmentId) => client.delete('/api/bookings/' + encodeURIComponent(bookingId) + '/attachments/' + encodeURIComponent(attachmentId));
