import React from 'react';
import NotificationItem from './NotificationItem';
export default function NotificationList({ items = [], onRead, onDelete, onOpen }) {
  return <div className="notification-list">{items.map((item) => <NotificationItem key={item.id} item={item} onRead={onRead} onDelete={onDelete} onOpen={onOpen} />)}</div>;
}
