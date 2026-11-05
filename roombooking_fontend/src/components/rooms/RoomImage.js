import React from 'react';
import { publicRoomFileUrl } from '../../api/fileApi';

export function getRoomImageUrl(room) {
  if (!room?.imageUrl) return '';
  if (room.imageSource === 'FILE') return publicRoomFileUrl(room.imageUrl);
  if (room.imageSource === 'LINK') return room.imageUrl;
  return '';
}

export default function RoomImage({ room, className = 'room-image' }) {
  const url = getRoomImageUrl(room);
  const [failedUrl, setFailedUrl] = React.useState('');

  if (!url || failedUrl === url) {
    return <div className={`${className} room-image-placeholder`} role="img" aria-label={`Ảnh phòng ${room?.name || ''}`}>
      <span aria-hidden="true">▧</span>
      <small>{failedUrl === url && url ? 'Không tải được ảnh' : 'Chưa có ảnh'}</small>
    </div>;
  }

  return <img className={className} src={url} alt={`Ảnh phòng ${room?.name || ''}`} onError={() => setFailedUrl(url)} />;
}
