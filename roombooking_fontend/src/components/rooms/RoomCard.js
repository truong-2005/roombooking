import React from 'react';
import { ROOM_TYPE_LABELS } from '../../utils/constants';
import RoomImage from './RoomImage';
export default function RoomCard({ room, actions }) {
  return <article className="room-card"><RoomImage room={room} className="room-card-image" />
    <div className="room-card-body"><div className="row-between"><span className="eyebrow">{room.code}</span><span className="status-badge">{ROOM_TYPE_LABELS[room.type] || room.type}</span></div>
      <h3>{room.name}</h3><p>{room.location || 'Chưa có vị trí'}</p><p>Sức chứa: {room.capacity}</p>{room.amenities && <p>{room.amenities}</p>}{actions}
    </div></article>;
}
