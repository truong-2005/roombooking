import React from 'react';
import { Link } from 'react-router-dom';
import { searchAvailableRooms } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import RoomCard from '../../../components/rooms/RoomCard';
import ApiState from '../../../components/common/ApiState';
import { getPageData } from '../../../utils/formatUtils';
import { toApiLocalDateTime } from '../../../utils/dateUtils';
import { PAGE_SIZE } from '../../../utils/constants';
import Pagination from '../../../components/common/Pagination';
export default function AvailableRoomsPage() {
  const [startTime, setStart] = React.useState(''); const [endTime, setEnd] = React.useState(''); const [page, setPage] = React.useState(0);
  const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false);
  async function search(event, nextPage = page) { event?.preventDefault(); setBusy(true); setError(null); setData(null); setPage(nextPage);
    try { const response = await searchAvailableRooms({ startTime: toApiLocalDateTime(startTime), endTime: toApiLocalDateTime(endTime), page: nextPage, size: PAGE_SIZE, sortBy: 'name', sortDir: 'asc' }); setData(getPageData(response)); }
    catch (e) { setError(e); } finally { setBusy(false); }
  }
  return <><PageHeader eyebrow="Khám phá" title="Phòng còn trống" description="Kết quả được kiểm tra bằng API tại khoảng thời gian đã chọn." />
    <section className="panel"><form className="filter-row" onSubmit={search}><Input label="Bắt đầu" type="datetime-local" required value={startTime} onChange={(e) => setStart(e.target.value)} /><Input label="Kết thúc" type="datetime-local" required value={endTime} onChange={(e) => setEnd(e.target.value)} /><Button type="submit" loading={busy}>Tìm phòng</Button></form>
      <ApiState loading={busy} error={error} empty={Boolean(data && !data.content.length)} onRetry={search} emptyTitle="Không có phòng trống trong khoảng này"><div className="room-grid">{(data?.content || []).map((room) => <RoomCard key={room.id} room={room} actions={<Link className="button button-primary" to={'/bookings/new?roomId=' + room.id}>Đặt phòng</Link>} />)}</div></ApiState>
      {data && <Pagination page={data.page ?? page} totalPages={data.totalPages} onChange={(nextPage) => search(null, nextPage)} />}
    </section></>;
}
