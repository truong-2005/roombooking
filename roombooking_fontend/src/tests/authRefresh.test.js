import axios from 'axios';
import client from '../api/axiosClient';
import { clearSession, writeSession } from '../utils/tokenUtils';

const defaultAdapter = client.defaults.adapter;

afterEach(() => {
  clearSession();
  client.defaults.adapter = defaultAdapter;
  jest.restoreAllMocks();
});

test('attaches the current Bearer access token', async () => {
  writeSession({ accessToken: 'access-one', refreshToken: 'refresh-one' });
  const adapter = jest.fn(async (config) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config }));
  client.defaults.adapter = adapter;
  await client.get('/api/private');
  expect(adapter.mock.calls[0][0].headers.Authorization).toBe('Bearer access-one');
});

test('shares one refresh for concurrent 401 responses and retries each request once', async () => {
  writeSession({ accessToken: 'expired-access', refreshToken: 'refresh-one' });
  const refresh = jest.spyOn(axios, 'post').mockResolvedValue({ data: { accessToken: 'fresh-access', refreshToken: 'refresh-two' } });
  const calls = [];
  client.defaults.adapter = async (config) => {
    calls.push({ url: config.url, retry: Boolean(config._retry), authorization: config.headers.Authorization });
    if (config.headers.Authorization !== 'Bearer fresh-access') {
      return Promise.reject({ config, response: { status: 401, headers: {}, data: { message: 'expired' } } });
    }
    return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
  };
  const responses = await Promise.all([client.get('/api/one'), client.get('/api/two')]);
  expect(responses).toHaveLength(2);
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(calls).toHaveLength(4);
  expect(calls.filter((call) => call.retry)).toHaveLength(2);
});

test('refreshes a nearly expired JWT before sending the protected request', async () => {
  const payload = window.btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 10 }));
  writeSession({ accessToken: 'header.' + payload + '.signature', refreshToken: 'refresh-one' });
  const refresh = jest.spyOn(axios, 'post').mockResolvedValue({ data: { accessToken: 'fresh-access', refreshToken: 'refresh-two' } });
  const adapter = jest.fn(async (config) => ({ data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config }));
  client.defaults.adapter = adapter;

  await client.get('/api/private');

  expect(refresh).toHaveBeenCalledTimes(1);
  expect(adapter.mock.calls[0][0].headers.Authorization).toBe('Bearer fresh-access');
});
