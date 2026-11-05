import React from 'react';
import Select from '../common/Select';

const options = [
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Từ chối' },
];

export default function BookingDecisionSelect({ bookingId, disabled = false, onDecision }) {
  return <Select
    className="booking-decision-select"
    id={'booking-decision-' + bookingId}
    name={'booking-decision-' + bookingId}
    aria-label={'Chọn trạng thái xử lý cho đặt phòng ' + bookingId}
    value=""
    placeholder="Chọn trạng thái"
    options={options}
    disabled={disabled}
    onChange={(event) => onDecision(event.target.value)}
  />;
}
