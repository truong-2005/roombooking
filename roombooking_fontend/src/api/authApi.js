import client from './axiosClient';

const publicRequest = { _skipAuth: true, _skipAuthRefresh: true };
export const getCaptcha = () => client.get('/api/auth/captcha', publicRequest);
export const login = (payload, admin = false) => client.post(admin ? '/api/auth/admin/login' : '/api/auth/login', payload, publicRequest);
export const register = (payload, admin = false) => client.post(admin ? '/api/auth/admin/register' : '/api/auth/register', payload, { ...publicRequest, _skipAuth: !admin });
export const refreshToken = (refreshTokenValue) => client.post('/api/auth/refresh-token', { refreshToken: refreshTokenValue }, publicRequest);
export const logout = (refreshTokenValue, admin = false) => client.post(admin ? '/api/auth/admin/logout' : '/api/auth/logout', { refreshToken: refreshTokenValue }, { _skipAuthRefresh: true });
export const logoutAll = () => client.post('/api/auth/logout-all');
export const getMe = () => client.get('/api/auth/me');
export const forgotPassword = (payload) => client.post('/api/auth/forgot-password', payload, publicRequest);
export const verifyResetToken = (payload) => client.post('/api/auth/verify-reset-token', payload, publicRequest);
export const resetPassword = (payload) => client.post('/api/auth/reset-password', payload, publicRequest);
