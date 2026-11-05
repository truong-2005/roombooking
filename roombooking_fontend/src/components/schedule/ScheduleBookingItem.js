import React from 'react';
import { formatDateTime } from '../../utils/dateUtils';
import StatusBadge from '../common/StatusBadge';
export default function ScheduleBookingItem({ booking }) {
  return <article className="schedule-item"><strong>{booking.title || booking.roomName}</strong><span>{formatDateTime(booking.startTime)} – {formatDateTime(booking.endTime)}</span><span>{booking.roomName || booking.roomCode || '—'}</span><StatusBadge value={booking.status} /></article>;
}
