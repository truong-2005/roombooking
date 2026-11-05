import React from 'react';
import { formatDateTime } from '../../utils/dateUtils';
import { displayValue } from '../../utils/formatUtils';
import StatusBadge from './BookingStatus';
export default function BookingDetail({ booking }) {
  if (!booking) return null;
  const fields = [['Mã đặt phòng', booking.id], ['Tiêu đề', booking.title], ['Phòng', booking.roomName], ['Mã phòng', booking.roomCode], ['Người đặt', booking.userFullName], ['Email', booking.userEmail], ['Bắt đầu', formatDateTime(booking.startTime)], ['Kết thúc', formatDateTime(booking.endTime)], ['Số người', booking.attendees], ['Mục đích', booking.purpose], ['Lý do từ chối', booking.rejectReason], ['Lý do hủy', booking.cancelReason]];
  return <div className="detail-grid">{fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{displayValue(value)}</strong></div>)}<div><span>Trạng thái</span><StatusBadge status={booking.status} /></div></div>;
}
