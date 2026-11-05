import React from 'react';
import { publicAvatarFileUrl } from '../../api/fileApi';
export default function Avatar({ user, size = 'md' }) {
  const source = user?.avatarSource;
  const url = source === 'FILE' && user?.avatarUrl ? publicAvatarFileUrl(user.avatarUrl) : source === 'LINK' ? user?.avatarUrl : '';
  const [failedUrl, setFailedUrl] = React.useState('');
  if (url && failedUrl !== url) return <img className={'avatar avatar-' + size} src={url} alt={user?.fullName || 'Ảnh đại diện'} onError={() => setFailedUrl(url)} />;
  const initials = String(user?.fullName || user?.username || '?').split(/\s+/).slice(-2).map((word) => word[0]).join('').toUpperCase();
  return <span className={'avatar avatar-fallback avatar-' + size} role="img" aria-label={'Ảnh đại diện ' + (user?.fullName || user?.username || 'tài khoản')}>{initials}</span>;
}
