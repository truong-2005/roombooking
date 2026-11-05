export function toFormData(values) {
  const form = new FormData();
  Object.entries(values || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((item) => form.append(key, item));
    } else if (value instanceof File || value instanceof Blob) {
      form.append(key, value);
    } else {
      form.append(key, typeof value === 'boolean' ? String(value) : String(value));
    }
  });
  return form;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename || 'tep-tai-xuong';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function filenameFromDisposition(value, fallback) {
  if (!value) return fallback;
  const encoded = value.match(/filename\*=UTF-8''([^;]+)/i);
  const plain = value.match(/filename="?([^";]+)"?/i);
  try { return decodeURIComponent(encoded?.[1] || plain?.[1] || fallback); } catch (_) { return fallback; }
}

export function validateImageFile(file) {
  if (!file) return null;
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) return 'Ảnh phải có định dạng JPEG, PNG, WebP hoặc GIF.';
  if (file.size > 5 * 1024 * 1024) return 'Mỗi ảnh không được vượt quá 5 MB.';
  return null;
}

export function validateAttachmentFiles(files, existingCount = 0) {
  const allowed = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'zip']);
  if (existingCount + files.length > 20) return 'Mỗi đặt phòng được đính kèm tối đa 20 tệp.';
  const invalidSize = files.find((file) => file.size > 20 * 1024 * 1024);
  if (invalidSize) return 'Mỗi tệp đính kèm không được vượt quá 20 MB: ' + invalidSize.name;
  const invalidType = files.find((file) => !allowed.has(file.name.split('.').pop().toLowerCase()));
  if (invalidType) return 'Định dạng tệp không được hỗ trợ: ' + invalidType.name;
  return null;
}
