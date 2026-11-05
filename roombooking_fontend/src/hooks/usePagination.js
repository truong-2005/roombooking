import React from 'react';
import { PAGE_SIZE } from '../utils/constants';
export default function usePagination(initialSize = PAGE_SIZE) {
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(initialSize);
  return { page, size, setPage, setSize, reset: () => setPage(0) };
}
