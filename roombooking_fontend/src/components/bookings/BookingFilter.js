import React from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from '../../utils/constants';
export default function BookingFilter({ values, onChange, adminFilters = false }) {
  return <div className="filter-row">
    <Input label="Từ khóa" value={values.keyword || ''} onChange={(e) => onChange('keyword', e.target.value)} />
    {adminFilters && <Input label="ID phòng" type="number" min="1" value={values.roomId || ''} onChange={(e) => onChange('roomId', e.target.value)} />}
    {adminFilters && <Input label="ID người đặt" type="number" min="1" value={values.userId || ''} onChange={(e) => onChange('userId', e.target.value)} />}
    <Input label="Từ ngày" type="date" value={values.fromDate || ''} onChange={(e) => onChange('fromDate', e.target.value)} />
    <Input label="Đến ngày" type="date" value={values.toDate || ''} onChange={(e) => onChange('toDate', e.target.value)} />
    <Select label="Trạng thái" value={values.status || ''} placeholder="Mọi trạng thái" options={BOOKING_STATUSES.map((value) => ({ value, label: BOOKING_STATUS_LABELS[value] }))} onChange={(e) => onChange('status', e.target.value)} />
  </div>;
}
