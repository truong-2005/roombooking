import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoom, updateRoom } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import RoomForm from '../../../components/rooms/RoomForm';
import ApiState from '../../../components/common/ApiState';
export default function RoomEditPage() {
  const { id } = useParams(); const navigate = useNavigate(); const [room, setRoom] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const load = React.useCallback(async () => { try { setError(null); const response = await getRoom(id); setRoom(response.data); } catch (e) { setError(e); } }, [id]);
  React.useEffect(() => { load(); }, [load]);
  async function submit(payload) { setBusy(true); setError(null); try { await updateRoom(id, payload); navigate('/admin/rooms/' + id); } catch (e) { setError(e); } finally { setBusy(false); } }
  return <><PageHeader eyebrow="Quản trị · Phòng họp" title="Chỉnh sửa phòng" /><ApiState loading={!room && !error} error={error} onRetry={load}>{room && <section className="panel"><RoomForm initial={room} onSubmit={submit} loading={busy} error={error} submitLabel="Lưu thay đổi" /></section>}</ApiState></>;
}
