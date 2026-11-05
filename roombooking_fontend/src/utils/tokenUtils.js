const SESSION_KEYS = {
  admin: 'roombooking.admin.session.v1',
  client: 'roombooking.client.session.v1',
};
const inBrowser = typeof window !== 'undefined';
if (inBrowser) {
  try { window.sessionStorage.removeItem('roombooking.session.v1'); } catch (_) { /* Ignore disabled browser storage. */ }
}

export function getPortalForPath(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/') ? 'admin' : 'client';
}

export function getActivePortal() {
  return inBrowser ? getPortalForPath(window.location.pathname) : 'client';
}

function getSessionKey(portal = getActivePortal()) {
  return SESSION_KEYS[portal] || SESSION_KEYS.client;
}

export function readSession(portal = getActivePortal()) {
  if (!inBrowser) return null;
  try {
    const value = window.sessionStorage.getItem(getSessionKey(portal));
    return value ? JSON.parse(value) : null;
  } catch (_) {
    return null;
  }
}

export function writeSession(tokens, portal = getActivePortal()) {
  if (!inBrowser) return;
  const accessToken = tokens && tokens.accessToken;
  const refreshToken = tokens && tokens.refreshToken;
  if (!accessToken || !refreshToken) throw new Error('API chưa trả đủ accessToken và refreshToken.');
  window.sessionStorage.setItem(getSessionKey(portal), JSON.stringify({ accessToken, refreshToken }));
}

export function clearSession(portal = getActivePortal()) {
  if (inBrowser) window.sessionStorage.removeItem(getSessionKey(portal));
}

export function getAccessToken(portal = getActivePortal()) {
  return readSession(portal)?.accessToken || null;
}

export function getRefreshToken(portal = getActivePortal()) {
  return readSession(portal)?.refreshToken || null;
}
