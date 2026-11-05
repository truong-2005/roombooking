import React from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { validateImageFile } from '../../utils/fileUtils';
import { ROOM_TYPES, ROOM_TYPE_LABELS } from '../../utils/constants';
import RoomImage from './RoomImage';
import useObjectUrl from '../../hooks/useObjectUrl';
export default function RoomForm({ initial = {}, onSubmit, loading, error, submitLabel = 'Lưu phòng' }) {
  const [values, setValues] = React.useState({ code: '', name: '', type: 'ROOM', capacity: '', location: '', description: '', amenities: '', active: true, ...initial, imageUrl: initial.imageSource === 'LINK' ? initial.imageUrl || '' : '' });
  const [imageFile, setImageFile] = React.useState(null);
  const imageFilePreview = useObjectUrl(imageFile);
  const [validationError, setValidationError] = React.useState(null);
  const change = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const imagePreview = values.removeImage
    ? { name: values.name, imageSource: 'NONE' }
    : imageFile && imageFilePreview
      ? { name: values.name, imageSource: 'LINK', imageUrl: imageFilePreview }
      : values.imageUrl
        ? { name: values.name, imageSource: 'LINK', imageUrl: values.imageUrl }
        : initial;
  return <form className="form-grid" onSubmit={(event) => { event.preventDefault(); const imageError = validateImageFile(imageFile); if (imageError || (values.imageUrl && imageFile) || (values.removeImage && (values.imageUrl || imageFile))) { setValidationError(imageError || 'Chỉ chọn một thao tác ảnh: giữ nguyên, URL, tệp hoặc gỡ ảnh.'); return; } setValidationError(null); onSubmit({ code: values.code, name: values.name, type: values.type, capacity: Number(values.capacity), location: values.location || undefined, description: values.description || undefined, amenities: values.amenities || undefined, imageUrl: values.imageUrl || undefined, imageFile: imageFile || undefined, removeImage: values.removeImage || undefined, active: values.active }); }}>
    <Input label="Mã phòng" name="code" value={values.code} onChange={change('code')} required maxLength="30" />
    <Input label="Tên phòng" name="name" value={values.name} onChange={change('name')} required maxLength="100" />
    <Select label="Loại phòng" name="type" value={values.type} onChange={change('type')} options={ROOM_TYPES.map((value) => ({ value, label: ROOM_TYPE_LABELS[value] }))} required />
    <Input label="Sức chứa" name="capacity" type="number" min="1" max="10000" value={values.capacity} onChange={change('capacity')} required />
    <Input label="Vị trí" name="location" value={values.location || ''} onChange={change('location')} />
    <Input label="Đường dẫn ảnh" name="imageUrl" type="url" value={values.imageUrl || ''} onChange={change('imageUrl')} hint="Chỉ nhập URL hoặc chọn tệp ảnh." />
    <FileUpload label="Tệp ảnh phòng" accept="image/*" onChange={setImageFile} name="imageFile" />
    <div className="form-wide image-preview"><span>Ảnh phòng xem trước</span><RoomImage room={imagePreview} className="room-image-preview" /></div>
    <TextArea label="Mô tả" name="description" value={values.description || ''} onChange={change('description')} maxLength="1000" />
    <TextArea label="Tiện nghi" name="amenities" value={values.amenities || ''} onChange={change('amenities')} maxLength="500" />
    {initial.id && <label className="checkbox-field"><input type="checkbox" checked={Boolean(values.active)} onChange={change('active')} /> Đang hoạt động</label>}
    {initial.id && initial.imageSource !== 'NONE' && <label className="checkbox-field"><input type="checkbox" checked={Boolean(values.removeImage)} onChange={change('removeImage')} /> Gỡ ảnh hiện tại</label>}
    {validationError && <p className="field-error form-wide">{validationError}</p>}
    {error && <div className="form-wide"><ErrorMessage error={error} /></div>}
    <div className="form-wide actions"><Button type="submit" loading={loading}>{submitLabel}</Button></div>
  </form>;
}
