import React from 'react';
import { deleteNotification, deleteReadNotifications, getNotification, getNotifications, markAllNotificationsRead, markNotificationRead, markSelectedNotificationsRead } from '../../../api/notificationApi';
import { useNotifications } from '../../../hooks/useNotifications';
import PageHeader from '../../../components/common/PageHeader';
import ApiState from '../../../components/common/ApiState';
import NotificationList from '../../../components/notifications/NotificationList';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import { formatDateTime } from '../../../utils/dateUtils';
import { PAGE_SIZE } from '../../../utils/constants';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
export default function NotificationsPage() {
  const { refreshUnread } = useNotifications(); const [page, setPage] = React.useState(0); const [unreadOnly, setUnreadOnly] = React.useState(false); const [payload, setPayload] = React.useState(null); const [error, setError] = React.useState(null); const [busy, setBusy] = React.useState(false); const [detail, setDetail] = React.useState(null); const [remove, setRemove] = React.useState(null);
  const load = React.useCallback(async () => { try { setError(null); const response = await getNotifications({ unreadOnly: unreadOnly || undefined, page, size: PAGE_SIZE }); setPayload(response.data); } catch (e) { setError(e); } }, [unreadOnly, page]);
  React.useEffect(() => { load(); }, [load]);
  const pageData = payload?.notifications || {}; const items = pageData.content || [];
  async function mutate(fn) { setBusy(true); setError(null); try { await fn(); await load(); await refreshUnread(); } catch (e) { setError(e); } finally { setBusy(false); } }
  async function open(item) { try { const response = await getNotification(item.id); setDetail(response.data); } catch (e) { setError(e); } }
  return <><PageHeader eyebrow="Tài khoản" title="Thông báo" description={payload ? (payload.unreadCount + ' chưa đọc') : 'Thông báo tài khoản'} actions={<><Button variant="secondary" loading={busy} onClick={() => mutate(markAllNotificationsRead)}>Đánh dấu tất cả đã đọc</Button><Button variant="danger" loading={busy} onClick={() => mutate(deleteReadNotifications)}>Xóa thông báo đã đọc</Button></>} />
    <section className="panel"><label className="checkbox-field"><input type="checkbox" checked={unreadOnly} onChange={(e) => { setUnreadOnly(e.target.checked); setPage(0); }} /> Chỉ xem chưa đọc</label>
      <ApiState loading={!payload && !error} error={error} empty={Boolean(payload && !items.length)} onRetry={load} emptyTitle={unreadOnly ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo'}>
        <NotificationList items={items} onOpen={open} onRead={(item) => mutate(() => markNotificationRead(item.id))} onDelete={setRemove} />
        {items.some((item) => !item.read) && <div className="actions" style={{ marginTop: 12 }}><Button variant="secondary" loading={busy} onClick={() => mutate(() => markSelectedNotificationsRead(items.filter((item) => !item.read).map((item) => item.id)))}>Đánh dấu danh sách này đã đọc</Button></div>}
      </ApiState>
      {payload && <Pagination page={pageData.page ?? page} totalPages={pageData.totalPages || 0} onChange={setPage} />}
    </section>
    <ConfirmDialog open={Boolean(remove)} title="Xóa thông báo" message={'Xóa thông báo "' + (remove?.title || '') + '"?'} busy={busy} onCancel={() => setRemove(null)} onConfirm={() => mutate(async () => { await deleteNotification(remove.id); setRemove(null); })} confirmLabel="Xóa thông báo" />
    <Modal open={Boolean(detail)} title={detail?.title || 'Thông báo'} onClose={() => setDetail(null)}><div className="modal-body"><p>{detail?.message}</p><small>{formatDateTime(detail?.createdAt)}</small></div></Modal>
  </>;
}
