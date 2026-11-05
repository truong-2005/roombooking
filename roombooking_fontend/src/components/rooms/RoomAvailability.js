import React from 'react';
import { checkRoomAvailability } from '../../api/roomApi';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
export default function RoomAvailability({ roomId }) {
  const [startTime, setStart] = React.useState('');
  const [endTime, setEnd] = React.useState('');
  const [state, setState] = React.useState({ loading: false, error: null, result: null });
  async function check(event) {
    event.preventDefault(); setState({ loading: true, error: null, result: null });
    try { const response = await checkRoomAvailability(roomId, { startTime: startTime + ':00', endTime: endTime + ':00' }); setState({ loading: false, error: null, result: response.data }); }
    catch (error) { setState({ loading: false, error, result: null }); }
  }
  return <section className="panel"><h2>Kiểm tra khả dụng</h2><form className="filter-row" onSubmit={check}>
    <Input label="Bắt đầu" type="datetime-local" required value={startTime} onChange={(e) => setStart(e.target.value)} />
    <Input label="Kết thúc" type="datetime-local" required value={endTime} onChange={(e) => setEnd(e.target.value)} />
    <Button type="submit" loading={state.loading}>Kiểm tra</Button>
  </form>
  {state.error && <ErrorMessage error={state.error} />}
  {state.result && <div className={state.result.available ? 'notice notice-success' : 'notice notice-error'}>{state.result.message || (state.result.available ? 'Phòng còn trống.' : 'Phòng không khả dụng.')}</div>}
  </section>;
}
