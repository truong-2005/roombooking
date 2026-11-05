import React from 'react';
export default function BookingConflictWarning({ result }) {
  if (!result?.hasConflict) return null;
  return <div className="notice notice-error" role="alert"><strong>Lịch bị xung đột.</strong> {result.message}{Array.isArray(result.conflicts) && result.conflicts.map((item) => <div key={item.id || item.startTime}>{item.title || item.roomName} · {item.startTime} – {item.endTime}</div>)}</div>;
}
