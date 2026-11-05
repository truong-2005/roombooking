export function validateRequired(values, fields) {
  const errors = {};
  fields.forEach((field) => {
    if (values[field] === undefined || values[field] === null || String(values[field]).trim() === '') errors[field] = 'Trường này không được để trống.';
  });
  return errors;
}

export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
}

export function validatePassword(value) {
  return typeof value === 'string' && value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}
