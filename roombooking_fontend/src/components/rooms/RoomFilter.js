import React from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import { ROOM_TYPES, ROOM_TYPE_LABELS } from '../../utils/constants';
export default function RoomFilter({ values, onChange, includeStatus = false }) {
  return <div className="filter-row"><Input label="Từ khóa" value={values.keyword || ''} onChange={(event) => onChange('keyword', event.target.value)} />
    <Select label="Loại phòng" value={values.type || ''} placeholder="Tất cả loại" options={ROOM_TYPES.map((value) => ({ value, label: ROOM_TYPE_LABELS[value] }))} onChange={(event) => onChange('type', event.target.value)} />
    <Input label="Sức chứa tối thiểu" type="number" min="1" value={values.minCapacity || ''} onChange={(event) => onChange('minCapacity', event.target.value)} />
    {includeStatus && <Select label="Trạng thái" value={values.active ?? ''} placeholder="Mọi trạng thái" options={[{ value: 'true', label: 'Đang hoạt động' }, { value: 'false', label: 'Ngừng hoạt động' }]} onChange={(event) => onChange('active', event.target.value)} />}
  </div>;
}
