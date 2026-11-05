import React from 'react';
import ScheduleBookingItem from './ScheduleBookingItem';
export default function ScheduleDay({ day, bookings = [] }) {
  return <section className="schedule-day"><h3>{day}</h3>{bookings.length ? bookings.map((booking) => <ScheduleBookingItem key={booking.id} booking={booking} />) : <p className="muted">Không có lịch đặt.</p>}</section>;
}
