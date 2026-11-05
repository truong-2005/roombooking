import React from 'react';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/dateUtils';
export default function BookingTable({ rows, actions }) {
  return <DataTable rows={rows} actions={actions} columns={[
    { key: 'id', label: 'Mã' }, { key: 'title', label: 'Tiêu đề' }, { key: 'roomName', label: 'Phòng' },
    { key: 'userFullName', label: 'Người đặt' }, { key: 'startTime', label: 'Bắt đầu', render: (value) => formatDateTime(value) },
    { key: 'endTime', label: 'Kết thúc', render: (value) => formatDateTime(value) }, { key: 'status', label: 'Trạng thái', render: (value) => <StatusBadge value={value} /> },
  ]} />;
}
