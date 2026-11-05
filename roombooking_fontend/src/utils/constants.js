export function resolveApiBaseUrl(nodeEnv, configuredBase) {
  const configured = (configuredBase || '').trim().replace(/\/+$/, '');
  const localBackend = /^https?:\/\/(localhost|127\.0\.0\.1):8086$/i.test(configured);

  // CRA's dev-server proxy keeps local API calls same-origin on any frontend port.
  if (nodeEnv === 'development' && (!configured || localBackend)) return '';
  return configured || 'http://localhost:8086';
}

export const API_BASE_URL = resolveApiBaseUrl(process.env.NODE_ENV, process.env.REACT_APP_API_BASE_URL);
export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_USER = 'ROLE_USER';
export const ROOM_TYPES = ['ROOM', 'CLASSROOM', 'LAB', 'HALL'];
export const BOOKING_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
export const PAGE_SIZE = 10;
export const ROOM_TYPE_LABELS = { ROOM: 'Phòng họp', CLASSROOM: 'Phòng học', LAB: 'Phòng thí nghiệm', HALL: 'Hội trường' };
export const BOOKING_STATUS_LABELS = { PENDING: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối', CANCELLED: 'Đã hủy' };
