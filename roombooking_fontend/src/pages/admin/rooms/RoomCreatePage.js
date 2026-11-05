import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import RoomForm from '../../../components/rooms/RoomForm';
export default function RoomCreatePage() {
  const navigate = useNavigate(); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  async function submit(payload) { setBusy(true); setError(null); try { await createRoom(payload); navigate('/admin/rooms'); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị · Phòng họp" title="Thêm phòng" /><section className="panel"><RoomForm onSubmit={submit} loading={busy} error={error} /></section></>;
}
