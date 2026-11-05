import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  return <Link className="notification-link" to="/notifications" aria-label={'Thông báo, ' + unreadCount + ' chưa đọc'}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
    {unreadCount > 0 && <span>{unreadCount}</span>}
  </Link>;
}
