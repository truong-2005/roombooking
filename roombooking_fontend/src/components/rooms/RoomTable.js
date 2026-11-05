import React from 'react';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { ROOM_TYPE_LABELS } from '../../utils/constants';
import RoomImage from './RoomImage';
export default function RoomTable({ rows, actions }) {
  return <DataTable rows={rows} actions={actions} columns={[
    { key: 'imagePreview', label: 'Ảnh phòng', render: (_, room) => <RoomImage room={room} className="room-image-thumb" /> },
    { key: 'code', label: 'Mã phòng' }, { key: 'name', label: 'Tên phòng' }, { key: 'type', label: 'Loại', render: (value) => ROOM_TYPE_LABELS[value] || value },
    { key: 'capacity', label: 'Sức chứa' }, { key: 'location', label: 'Vị trí' }, { key: 'active', label: 'Trạng thái', render: (value) => <StatusBadge value={value ? 'ACTIVE' : 'INACTIVE'} /> },
  ]} />;
}
