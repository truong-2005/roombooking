import axiosClient from '../api/axiosClient';
import { createUser, assignUserRoles } from '../api/userApi';
import { createRoom } from '../api/roomApi';
import { uploadAttachments } from '../api/bookingAttachmentApi';
import { markSelectedNotificationsRead, deleteReadNotifications } from '../api/notificationApi';

afterEach(() => jest.restoreAllMocks());

test('uses the documented multipart and role assignment contracts', async () => {
  const post = jest.spyOn(axiosClient, 'post').mockResolvedValue({ data: {} });
  const put = jest.spyOn(axiosClient, 'put').mockResolvedValue({ data: {} });
  await createUser({ username: 'member', email: 'm@example.test', password: 'Secret123', avatarFile: new File(['x'], 'avatar.png') });
  await createRoom({ code: 'A-7', name: 'Room', type: 'ROOM', capacity: 8, active: true });
  await assignUserRoles(3, ['ROLE_USER']);
  expect(post.mock.calls[0][0]).toBe('/api/users');
  expect(post.mock.calls[0][1]).toBeInstanceOf(FormData);
  expect(post.mock.calls[0][1].get('avatarFile').name).toBe('avatar.png');
  expect(post.mock.calls[1][0]).toBe('/api/rooms');
  expect(post.mock.calls[1][1].get('active')).toBe('true');
  expect(put).toHaveBeenCalledWith('/api/users/3/roles', { roles: ['ROLE_USER'] });
});

test('uses the documented notification methods and multipart repeated files field', async () => {
  const patch = jest.spyOn(axiosClient, 'patch').mockResolvedValue({ data: {} });
  const del = jest.spyOn(axiosClient, 'delete').mockResolvedValue({ data: {} });
  const post = jest.spyOn(axiosClient, 'post').mockResolvedValue({ data: {} });
  await markSelectedNotificationsRead([2, 9]);
  await deleteReadNotifications();
  await uploadAttachments(5, [new File(['one'], 'one.pdf'), new File(['two'], 'two.pdf')]);
  expect(patch).toHaveBeenCalledWith('/api/notifications/read', [2, 9]);
  expect(del).toHaveBeenCalledWith('/api/notifications/read');
  expect(post.mock.calls[0][0]).toBe('/api/bookings/5/attachments');
  expect(post.mock.calls[0][1].getAll('files').map((file) => file.name)).toEqual(['one.pdf', 'two.pdf']);
});
