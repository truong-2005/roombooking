import React from 'react';
export default function useApiResource(loader, dependencies = []) {
  const [state, setState] = React.useState({ data: null, loading: true, error: null });
  const load = React.useCallback(async (signal) => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const response = await loader(signal);
      setState({ data: response?.data ?? response, loading: false, error: null });
      return response?.data ?? response;
    } catch (error) {
      if (error.code !== 'ERR_CANCELED' && error.name !== 'CanceledError') setState({ data: null, loading: false, error });
      throw error;
    }
  // loader identity/dependencies are deliberately controlled by the caller.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  return { ...state, load, setData: (data) => setState({ data, loading: false, error: null }) };
}
