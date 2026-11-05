import React from 'react';
import { addDays } from '../../utils/dateUtils';
import ScheduleDay from './ScheduleDay';
export default function WeeklyCalendar({ date, bookings = [], schedule }) {
  const start = date || new Date().toISOString().slice(0, 10);
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const scheduleDays = schedule?.days || [];
  return <div className="week-grid">{days.map((day) => {
    const apiDay = scheduleDays.find((item) => String(item.date) === day);
    const dayBookings = apiDay ? (apiDay.bookings || []) : bookings.filter((booking) => String(booking.startTime || '').slice(0, 10) === day);
    const dayLabel = apiDay?.dayOfWeek || new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' }).format(new Date(day + 'T00:00:00'));
    return <ScheduleDay key={day} day={dayLabel + ' · ' + day} bookings={dayBookings} />;
  })}</div>;
}
