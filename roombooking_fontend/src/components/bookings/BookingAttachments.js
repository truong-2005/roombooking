import React from 'react';
import { deleteAttachment, downloadAttachment, listAttachments, uploadAttachments } from '../../api/bookingAttachmentApi';
import { downloadBlob, filenameFromDisposition } from '../../utils/fileUtils';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';
import { validateAttachmentFiles } from '../../utils/fileUtils';
export default function BookingAttachments({ bookingId }) {
  const [items, setItems] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [remove, setRemove] = React.useState(null);
  const load = React.useCallback(async () => { setLoading(true); setError(null); try { const response = await listAttachments(bookingId); setItems(Array.isArray(response.data) ? response.data : []); } catch (e) { setError(e); } finally { setLoading(false); } }, [bookingId]);
  React.useEffect(() => { load(); }, [load]);
  async function upload() { if (!files.length) return; const validation = validateAttachmentFiles(files, items.length); if (validation) { setError(validation); return; } setLoading(true); setError(null); try { const response = await uploadAttachments(bookingId, files); setItems(response.data || []); setFiles([]); } catch (e) { setError(e); } finally { setLoading(false); } }
  async function download(item) { try { const response = await downloadAttachment(bookingId, item.id); downloadBlob(response.data, filenameFromDisposition(response.headers['content-disposition'], item.originalFileName)); } catch (e) { setError(e); } }
  async function removeAttachment() { setLoading(true); try { await deleteAttachment(bookingId, remove.id); setRemove(null); await load(); } catch (e) { setError(e); } finally { setLoading(false); } }
  return <section className="panel"><h2>Tệp đính kèm</h2>{error && <ErrorMessage error={error} onRetry={load} />}
    <div className="inline-form"><FileUpload multiple label="Chọn tệp" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.zip" onChange={setFiles} /> <Button onClick={upload} loading={loading} disabled={!files.length}>Tải lên</Button></div>
    {items.length ? <ul className="file-list">{items.map((item) => <li key={item.id}><span>{item.originalFileName}</span><span>{item.fileSize ? Math.ceil(item.fileSize / 1024) + ' KB' : ''}</span><Button variant="secondary" onClick={() => download(item)}>Tải xuống</Button><Button variant="danger" onClick={() => setRemove(item)}>Xóa</Button></li>)}</ul> : !loading && !error && <EmptyState title="Chưa có tệp đính kèm" />}
    <ConfirmDialog open={Boolean(remove)} title="Xóa tệp đính kèm" message={'Xóa tệp ' + (remove?.originalFileName || '') + '?'} busy={loading} onCancel={() => setRemove(null)} onConfirm={removeAttachment} confirmLabel="Xóa tệp" />
  </section>;
}
