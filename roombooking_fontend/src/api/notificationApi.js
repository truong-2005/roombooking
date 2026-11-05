import client from './axiosClient';
export const getNotifications = (params) => client.get('/api/notifications', { params });
export const getUnreadCount = () => client.get('/api/notifications/unread-count');
export const getNotification = (id) => client.get('/api/notifications/' + encodeURIComponent(id));
export const markNotificationRead = (id) => client.patch('/api/notifications/' + encodeURIComponent(id) + '/read');
export const markSelectedNotificationsRead = (ids) => client.patch('/api/notifications/read', ids);
export const markAllNotificationsRead = () => client.patch('/api/notifications/read-all');
export const deleteNotification = (id) => client.delete('/api/notifications/' + encodeURIComponent(id));
export const deleteReadNotifications = () => client.delete('/api/notifications/read');
