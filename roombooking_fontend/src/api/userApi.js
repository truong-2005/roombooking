import client from './axiosClient';
import { toFormData } from '../utils/fileUtils';

export const searchUsers = ({ signal, ...params } = {}) => client.get('/api/users', { params, signal });
export const createUser = (payload) => client.post('/api/users', toFormData(payload));
export const getUser = (id) => client.get('/api/users/' + encodeURIComponent(id));
export const updateUser = (id, payload) => client.put('/api/users/' + encodeURIComponent(id), toFormData(payload));
export const deleteUser = (id) => client.delete('/api/users/' + encodeURIComponent(id));
export const assignUserRoles = (id, roles) => client.put('/api/users/' + encodeURIComponent(id) + '/roles', { roles });
export const updateUserStatus = (id, enabled) => client.patch('/api/users/' + encodeURIComponent(id) + '/status', { enabled });
export const changeUserPassword = (id, payload) => client.patch('/api/users/' + encodeURIComponent(id) + '/password', payload);
