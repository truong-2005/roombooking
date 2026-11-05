import React from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { toApiLocalDateTime } from '../../utils/dateUtils';

function validateBooking(values, rooms) {
  if (!values.title.trim()) return 'Tiêu đề không được để trống.';
  const room = rooms.find((item) => String(item.id) === String(values.roomId));
  if (!room) return 'Vui lòng chọn một phòng đang hoạt động.';

  const start = new Date(values.startTime);
  const end = new Date(values.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Vui lòng nhập thời gian bắt đầu và kết thúc hợp lệ.';
  if (start.getTime() <= Date.now()) return 'Thời gian bắt đầu phải ở tương lai.';
  if (start.getTime() > Date.now() + 365 * 24 * 60 * 60 * 1000) return 'Chỉ được đặt phòng trước tối đa 365 ngày.';
  if (start.toDateString() !== end.toDateString()) return 'Lịch đặt phải bắt đầu và kết thúc trong cùng một ngày.';
  if (end <= start) return 'Thời gian kết thúc phải sau thời gian bắt đầu.';

  const startMinute = start.getHours() * 60 + start.getMinutes();
  const endMinute = end.getHours() * 60 + end.getMinutes();
  if (startMinute < 6 * 60 || endMinute > 22 * 60) return 'Chỉ được đặt phòng trong khung giờ 06:00–22:00.';

  const durationMinutes = (end.getTime() - start.getTime()) / 60000;
  if (durationMinutes < 30) return 'Thời lượng đặt phòng tối thiểu là 30 phút.';
  if (durationMinutes > 12 * 60) return 'Thời lượng đặt phòng tối đa là 12 giờ.';

  if (values.attendees) {
    const attendees = Number(values.attendees);
    if (!Number.isInteger(attendees) || attendees < 1) return 'Số người tham dự phải lớn hơn 0.';
    if (room.capacity != null && attendees > Number(room.capacity)) return 'Số người tham dự vượt quá sức chứa của phòng (' + room.capacity + ' người).';
  }
  return '';
}

export default function BookingForm({ rooms = [], initial = {}, onSubmit, loading, error, submitLabel = 'Gửi yêu cầu đặt phòng' }) {
  const [values, setValues] = React.useState({ roomId: initial.roomId || '', title: initial.title || '', purpose: initial.purpose || '', attendees: initial.attendees || '', startTime: initial.startTime ? String(initial.startTime).slice(0, 16) : '', endTime: initial.endTime ? String(initial.endTime).slice(0, 16) : '' });
  const [validationError, setValidationError] = React.useState('');
  const selectedRoom = rooms.find((room) => String(room.id) === String(values.roomId));
  const change = (key) => (event) => { setValues((current) => ({ ...current, [key]: event.target.value })); setValidationError(''); };
  function submit(event) {
    event.preventDefault();
    const validationMessage = validateBooking(values, rooms);
    if (validationMessage) { setValidationError(validationMessage); return; }
    setValidationError('');
    onSubmit({ roomId: Number(values.roomId), title: values.title, purpose: values.purpose || undefined, attendees: values.attendees ? Number(values.attendees) : undefined, startTime: toApiLocalDateTime(values.startTime), endTime: toApiLocalDateTime(values.endTime) });
  }
  return <form className="form-grid" onSubmit={submit}>
    <Select label="Phòng" name="roomId" required value={values.roomId} onChange={change('roomId')} placeholder="Chọn phòng" options={rooms.map((room) => ({ value: room.id, label: room.code + ' · ' + room.name + ' (sức chứa ' + room.capacity + ')' }))} />
    <Input label="Tiêu đề" name="title" required maxLength="200" value={values.title} onChange={change('title')} />
    <Input label="Số người tham dự" name="attendees" type="number" min="1" max={selectedRoom?.capacity || undefined} value={values.attendees} onChange={change('attendees')} />
    <Input label="Bắt đầu" name="startTime" type="datetime-local" required value={values.startTime} onChange={change('startTime')} />
    <Input label="Kết thúc" name="endTime" type="datetime-local" required value={values.endTime} onChange={change('endTime')} />
    <TextArea label="Mục đích" name="purpose" maxLength="1000" value={values.purpose} onChange={change('purpose')} />
    {validationError && <div className="form-wide"><ErrorMessage error={validationError} /></div>}
    {error && <div className="form-wide"><ErrorMessage error={error} /></div>}
    <div className="form-wide"><Button type="submit" loading={loading}>{submitLabel}</Button></div>
  </form>;
}
