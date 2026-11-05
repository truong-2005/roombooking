import client from './axiosClient';
export const listRoles = () => client.get('/api/roles');
export const createRole = (payload) => client.post('/api/roles', payload);
export const getRole = (id) => client.get('/api/roles/' + encodeURIComponent(id));
export const updateRole = (id, payload) => client.put('/api/roles/' + encodeURIComponent(id), payload);
export const deleteRole = (id) => client.delete('/api/roles/' + encodeURIComponent(id));
