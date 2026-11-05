import React from 'react';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
export default function ApiState({ loading, error, empty, onRetry, children, emptyTitle }) {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  if (empty) return <EmptyState title={emptyTitle} />;
  return children;
}
