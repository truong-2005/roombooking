import client from './axiosClient';
import { toFormData } from '../utils/fileUtils';
export const getProfile = () => client.get('/api/profile');
export const updateProfile = (payload) => client.put('/api/profile', toFormData(payload));
export const changePassword = (payload) => client.patch('/api/profile/password', payload);
