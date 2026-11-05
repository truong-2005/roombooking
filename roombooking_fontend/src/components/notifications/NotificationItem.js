import React from 'react';
import { formatDateTime } from '../../utils/dateUtils';
export default function NotificationItem({ item, onRead, onDelete, onOpen }) {
  return <article className={'notification-item ' + (item.read ? 'is-read' : 'is-unread')}>
    <div><button className="notification-title" onClick={() => onOpen(item)}>{item.title || item.type || 'Thông báo'}</button><p>{item.message || item.content || ''}</p><time>{formatDateTime(item.createdAt)}</time></div>
    <div className="actions">{!item.read && <button className="text-button" onClick={() => onRead(item)}>Đánh dấu đã đọc</button>}<button className="text-button danger-text" onClick={() => onDelete(item)}>Xóa</button></div>
  </article>;
}
