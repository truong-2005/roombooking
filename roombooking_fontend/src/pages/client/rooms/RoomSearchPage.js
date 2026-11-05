import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchRooms } from '../../../api/roomApi';
import PageHeader from '../../../components/common/PageHeader';
import RoomFilter from '../../../components/rooms/RoomFilter';
import RoomCard from '../../../components/rooms/RoomCard';
import ApiState from '../../../components/common/ApiState';
import Pagination from '../../../components/common/Pagination';
import { PAGE_SIZE } from '../../../utils/constants';
import { getPageData } from '../../../utils/formatUtils';
export default function RoomSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = React.useState({ keyword: searchParams.get('keyword') || '', type: searchParams.get('type') || '', minCapacity: searchParams.get('minCapacity') || '' });
  const [data, setData] = React.useState(null); const [error, setError] = React.useState(null); const [page, setPage] = React.useState(0);
  const load = React.useCallback(async (signal) => { try { setError(null); const result = await searchRooms({ keyword: filters.keyword || undefined, type: filters.type || undefined, minCapacity: filters.minCapacity || undefined, active: true, page, size: PAGE_SIZE, sortBy: 'name', sortDir: 'asc', signal }); setData(getPageData(result)); } catch (e) { if (e.code !== 'ERR_CANCELED') setError(e); } }, [filters, page]);
  React.useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, [load]);
  function apply() { const next = {}; Object.entries(filters).forEach(([key, value]) => { if (value) next[key] = value; }); setSearchParams(next); setPage(0); }
  return <><PageHeader eyebrow="Khám phá" title="Tìm phòng" description="Lọc phòng theo thông tin được cung cấp bởi hệ thống." actions={<Link className="button button-secondary" to="/rooms/available">Tìm phòng trống theo thời gian</Link>} />
    <section className="panel"><RoomFilter values={filters} onChange={(key, value) => setFilters((old) => ({ ...old, [key]: value }))} /><button className="button button-primary" onClick={apply}>Áp dụng bộ lọc</button>
      <ApiState loading={!data && !error} error={error} empty={Boolean(data && !data.content.length)} onRetry={load} emptyTitle="Không có phòng phù hợp"><div className="room-grid">{(data?.content || []).map((room) => <RoomCard key={room.id} room={room} actions={<Link className="button button-secondary" to={'/rooms/' + room.id}>Xem phòng</Link>} />)}</div></ApiState>
      {data && <Pagination page={data.page ?? page} totalPages={data.totalPages} onChange={setPage} />}
    </section></>;
}
