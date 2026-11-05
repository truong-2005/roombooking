import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRoom } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import RoomAvailability from '../../../components/rooms/RoomAvailability';
import { ROOM_TYPE_LABELS } from '../../../utils/constants';
import { publicRoomFileUrl } from '../../../api/fileApi';
export default function RoomDetailPage() {
  const { id } = useParams(); const [room, setRoom] = React.useState(null); const [error, setError] = React.useState(null);
  const load = React.useCallback(async () => { try { const response = await getRoom(id); setRoom(response.data); setError(null); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  const image = room?.imageSource === 'FILE' ? publicRoomFileUrl(room.imageUrl) : room?.imageSource === 'LINK' ? room.imageUrl : '';
  return <><PageHeader eyebrow="Phòng họp" title={room?.name || 'Chi tiết phòng'} actions={room && <Link className="button button-primary" to={'/bookings/new?roomId=' + room.id}>Tạo đặt phòng</Link>} />
    <ApiState loading={!room && !error} error={error} onRetry={load}>{room && <><section className="panel">{image && <img className="room-detail-image" src={image} alt={room.name} />}<div className="detail-grid">{[['Mã phòng', room.code], ['Loại phòng', ROOM_TYPE_LABELS[room.type] || room.type], ['Sức chứa', room.capacity], ['Vị trí', room.location], ['Mô tả', room.description], ['Tiện nghi', room.amenities], ['Hoạt động', room.active ? 'Có' : 'Không']].map(([k, v]) => <div key={k}><span>{k}</span><strong>{v || '—'}</strong></div>)}</div></section><RoomAvailability roomId={id} /></>}</ApiState>
  </>;
}
