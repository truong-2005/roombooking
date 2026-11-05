import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BookingForm from '../components/bookings/BookingForm';

test('submits booking fields using the backend DTO names and types', () => {
  const onSubmit = jest.fn();
  const start = new Date();
  start.setDate(start.getDate() + 2);
  start.setHours(9, 0, 0, 0);
  const end = new Date(start);
  end.setHours(10, 0, 0, 0);
  const toLocalValue = (date) => {
    const pad = (part) => String(part).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  };
  const startValue = toLocalValue(start);
  const endValue = toLocalValue(end);
  render(<BookingForm rooms={[{ id: 7, code: 'A-7', name: 'Meeting room', capacity: 8 }]} onSubmit={onSubmit} />);
  fireEvent.change(screen.getByLabelText(/Phòng/), { target: { value: '7' } });
  fireEvent.change(screen.getByLabelText(/Tiêu đề/), { target: { value: 'Planning session' } });
  fireEvent.change(screen.getByLabelText(/Số người tham dự/), { target: { value: '4' } });
  fireEvent.change(screen.getByLabelText(/Bắt đầu/), { target: { value: startValue } });
  fireEvent.change(screen.getByLabelText(/Kết thúc/), { target: { value: endValue } });
  fireEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu đặt phòng' }));
  expect(onSubmit).toHaveBeenCalledWith({
    roomId: 7, title: 'Planning session', purpose: undefined, attendees: 4,
    startTime: startValue + ':00', endTime: endValue + ':00',
  });
});
