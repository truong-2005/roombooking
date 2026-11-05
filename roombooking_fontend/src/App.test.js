import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders the not-found route for an unknown URL', async () => {
  window.history.replaceState({}, '', '/unknown-route');
  render(<App />);
  expect(await screen.findByRole('heading', { name: /không tìm thấy trang/i })).toBeInTheDocument();
  await waitFor(() => expect(window.location.pathname).toBe('/unknown-route'));
});
