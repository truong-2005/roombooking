import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { clearSession, getAccessToken, getActivePortal, getRefreshToken, readSession, writeSession } from '../utils/tokenUtils';

const client = axios.create({ baseURL: API_BASE_URL, timeout: 20000, headers: { Accept: 'application/json' } });
const refreshRequests = new Map();

function emitSessionExpired(portal) {
  clearSession(portal);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('roombooking:session-expired', { detail: { portal } }));
}

function tokenExpiresSoon(token) {
  if (typeof window === 'undefined' || !token) return false;
  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return false;
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')));
    return Number.isFinite(payload.exp) && payload.exp * 1000 <= Date.now() + 30000;
  } catch (_) {
    return false;
  }
}

client.interceptors.request.use(async (config) => {
  config._portal = config._portal || getActivePortal();
  if (!config._skipAuth) {
    let token = getAccessToken(config._portal);
    if (token && getRefreshToken(config._portal) && tokenExpiresSoon(token)) {
      token = await refreshTokens(config._portal);
    }
    if (token) config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

function refreshTokens(portal) {
  if (refreshRequests.has(portal)) return refreshRequests.get(portal);
  const refreshToken = getRefreshToken(portal);
  if (!refreshToken) return Promise.reject(new Error('Phiên đăng nhập đã hết hạn.'));
  const refreshRequest = axios.post(API_BASE_URL + '/api/auth/refresh-token', { refreshToken }, {
    timeout: 20000, headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  }).then((response) => {
    const current = readSession(portal) || {};
    const next = { accessToken: response.data?.accessToken, refreshToken: response.data?.refreshToken || current.refreshToken };
    writeSession(next, portal);
    return next.accessToken;
  }).catch((error) => {
    emitSessionExpired(portal);
    throw error;
  }).finally(() => { refreshRequests.delete(portal); });
  refreshRequests.set(portal, refreshRequest);
  return refreshRequest;
}

client.interceptors.response.use((response) => response, async (error) => {
  const config = error.config;
  if (error.response?.status !== 401 || !config || config._retry || config._skipAuthRefresh ||
      String(config.url || '').includes('/api/auth/refresh-token')) return Promise.reject(error);
  const portal = config._portal || getActivePortal();
  if (!getRefreshToken(portal)) {
    emitSessionExpired(portal);
    return Promise.reject(error);
  }
  config._retry = true;
  try {
    const token = await refreshTokens(portal);
    config.headers = config.headers || {};
    config.headers.Authorization = 'Bearer ' + token;
    return client(config);
  } catch (refreshError) {
    return Promise.reject(refreshError);
  }
});

export function normalizeApiError(error) {
  const response = error?.response;
  const data = response?.data || {};
  const status = response?.status;
  const retryHeader = response?.headers?.['retry-after'];
  const errors = data.fieldErrors || data.errors || data.violations || {};
  const fieldErrors = Array.isArray(errors)
    ? errors.reduce((result, item) => { if (item.field) result[item.field] = item.message; return result; }, {})
    : errors;
  let message = data.message || data.detail || data.error || data.title;
  if (typeof message !== 'string') message = '';
  if (!message) {
    if (!response) message = 'Không kết nối được máy chủ. Kiểm tra backend và cấu hình CORS rồi thử lại.';
    else if (status === 400) message = 'Thông tin gửi lên không hợp lệ. Vui lòng kiểm tra lại.';
    else if (status === 401) message = 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.';
    else if (status === 403) message = 'Tài khoản không có quyền thực hiện thao tác này.';
    else if (status === 404) message = 'Không tìm thấy dữ liệu yêu cầu.';
    else if (status === 409) message = 'Dữ liệu bị trùng hoặc lịch bị xung đột.';
    else if (status === 429) message = 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.';
    else if (status >= 500) message = 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';
    else message = 'Không thể hoàn thành yêu cầu.';
  }
  return { status, message, fieldErrors, retryAfter: retryHeader ? Number(retryHeader) : null, raw: data };
}

export default client;
