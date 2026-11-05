import { resolveApiBaseUrl } from '../utils/constants';

test('routes the default local API through the same-origin CRA proxy in development', () => {
  expect(resolveApiBaseUrl('development', undefined)).toBe('');
  expect(resolveApiBaseUrl('development', 'http://localhost:8086/')).toBe('');
  expect(resolveApiBaseUrl('development', 'http://127.0.0.1:8086')).toBe('');
});

test('preserves explicit remote API origins and production defaults', () => {
  expect(resolveApiBaseUrl('development', 'https://api.example.test/')).toBe('https://api.example.test');
  expect(resolveApiBaseUrl('production', undefined)).toBe('http://localhost:8086');
});
