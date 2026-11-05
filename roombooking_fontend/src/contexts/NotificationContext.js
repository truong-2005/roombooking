import React from 'react';
import { useAuthContext } from './AuthContext';
import { getUnreadCount } from '../api/notificationApi';

const NotificationContext = React.createContext({ unreadCount: 0, refreshUnread: async () => {} });
export function NotificationProvider({ children }) {
  const { user } = useAuthContext();
  const [unreadCount, setUnreadCount] = React.useState(0);
  const refreshUnread = React.useCallback(async () => {
    if (!user) { setUnreadCount(0); return; }
    try { const response = await getUnreadCount(); setUnreadCount(Number(response.data) || 0); }
    catch (_) { /* Keep the last API-confirmed count; page surfaces retryable errors. */ }
  }, [user]);
  React.useEffect(() => {
    if (!user) { setUnreadCount(0); return undefined; }
    refreshUnread();
    const timer = window.setInterval(refreshUnread, 60000);
    return () => window.clearInterval(timer);
  }, [user, refreshUnread]);
  return <NotificationContext.Provider value={{ unreadCount, refreshUnread, setUnreadCount }}>{children}</NotificationContext.Provider>;
}
export function useNotificationContext() { return React.useContext(NotificationContext); }
