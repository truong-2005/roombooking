import client from './axiosClient';
import { toFormData } from '../utils/fileUtils';

export const searchRooms = ({ signal, ...params } = {}) => client.get('/api/rooms', { params, signal });
export const createRoom = (payload) => client.post('/api/rooms', toFormData(payload));
export const getRoom = (id) => client.get('/api/rooms/' + encodeURIComponent(id));
export const updateRoom = (id, payload) => client.put('/api/rooms/' + encodeURIComponent(id), toFormData(payload));
export const deleteRoom = (id) => client.delete('/api/rooms/' + encodeURIComponent(id));
export const updateRoomStatus = (id, active) => client.patch('/api/rooms/' + encodeURIComponent(id) + '/status', { active });
export const searchAvailableRooms = ({ signal, ...params } = {}) => client.get('/api/rooms/available', { params, signal });
export const listActiveRooms = () => client.get('/api/rooms/active');
export const checkRoomAvailability = (id, params) => client.get('/api/rooms/' + encodeURIComponent(id) + '/availability', { params });
