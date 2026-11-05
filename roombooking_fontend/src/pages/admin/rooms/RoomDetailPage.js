import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRoom } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import RoomAvailability from '../../../components/rooms/RoomAvailability';
import RoomImage from '../../../components/rooms/RoomImage';
import { ROOM_TYPE_LABELS } from '../../../utils/constants';
import { formatDateTime } from '../../../utils/dateUtils';
export default function RoomDetailPage() {
  const { id } = useParams(); const [room, setRoom] = React.useState(null); const [error, setError] = React.useState(null);
  const load = React.useCallback(async () => { try { const response = await getRoom(id); setRoom(response.data); setError(null); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  return <><PageHeader eyebrow="Quản trị · Phòng họp" title={room?.name || 'Chi tiết phòng'} actions={<Link className="button button-primary" to={'/admin/rooms/' + id + '/edit'}>Chỉnh sửa</Link>} />
    <ApiState loading={!room && !error} error={error} onRetry={load}>{room && <><section className="panel"><RoomImage room={room} className="room-detail-image" /><div className="detail-grid">{[['Mã phòng', room.code], ['Loại', ROOM_TYPE_LABELS[room.type] || room.type], ['Sức chứa', room.capacity], ['Vị trí', room.location], ['Mô tả', room.description], ['Tiện nghi', room.amenities], ['Hoạt động', room.active ? 'Có' : 'Không'], ['Tạo lúc', formatDateTime(room.createdAt)], ['Cập nhật', formatDateTime(room.updatedAt)]].map(([k, v]) => <div key={k}><span>{k}</span><strong>{v || '—'}</strong></div>)}</div></section><RoomAvailability roomId={id} /></>}</ApiState>
  </>;
}
