import React from 'react';
import { displayValue } from '../../utils/formatUtils';
export default function RoomUsageChart({ data }) {
  if (!Array.isArray(data) || !data.length) return <p className="muted">API chưa trả về dữ liệu sử dụng phòng.</p>;
  const numericKey = 'utilizationPercent';
  const max = Math.max(1, ...data.map((item) => Number(item[numericKey]) || 0));
  return <div className="usage-list">{data.map((item, index) => <article className="usage-row" key={item.roomId || item.id || index}>
    <div className="row-between"><strong>{item.roomName || item.roomCode || ('Phòng ' + displayValue(item.roomId))}</strong><span>{displayValue(item[numericKey])}% · {displayValue(item.totalBookings)} lượt đặt</span></div>
    <div className="bar-track"><span style={{ width: (Math.max(0, Number(item[numericKey]) || 0) / max * 100) + '%' }} /></div>
  </article>)}</div>;
}
