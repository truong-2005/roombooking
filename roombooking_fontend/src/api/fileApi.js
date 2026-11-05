import client from './axiosClient';

function normalizeFileName(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  let path = value.trim();
  if (/^https?:\/\//i.test(path)) {
    try { path = new URL(path).pathname; } catch (_) { /* Keep the supplied path and normalize it below. */ }
  }
  path = path.split(/[?#]/, 1)[0];
  try { path = decodeURIComponent(path); } catch (_) { /* A plain, unescaped filename is also valid. */ }
  return path.split('/').filter(Boolean).pop() || '';
}

function publicFileUrl(kind, value) {
  const fileName = normalizeFileName(value);
  if (!fileName) return '';
  const baseUrl = (client.defaults.baseURL || '').replace(/\/+$/, '');
  return baseUrl + '/api/files/public/' + kind + '/' + encodeURIComponent(fileName);
}

function getPublicFile(kind, value) {
  const fileName = normalizeFileName(value);
  return client.get('/api/files/public/' + kind + '/' + encodeURIComponent(fileName), { responseType: 'blob', _skipAuth: true });
}

export const publicRoomFileUrl = (fileName) => publicFileUrl('rooms', fileName);
export const publicAvatarFileUrl = (fileName) => publicFileUrl('avatars', fileName);
export const getPublicRoomFile = (fileName) => getPublicFile('rooms', fileName);
export const getPublicAvatarFile = (fileName) => getPublicFile('avatars', fileName);
