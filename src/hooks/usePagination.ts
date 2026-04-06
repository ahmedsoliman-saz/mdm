import { useState, useCallback, useMemo } from 'react';

export function usePagination(totalItems: number, defaultPageSize: number = 25) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(defaultPageSize);

  const safePage = useMemo(() => {
    const maxPage = Math.max(1, Math.ceil(totalItems / pageSize));
    return Math.min(currentPage, maxPage);
  }, [currentPage, totalItems, pageSize]);

  const paginatedSlice = useCallback(
    <T,>(items: T[]): T[] => {
      const start = (safePage - 1) * pageSize;
      return items.slice(start, start + pageSize);
    },
    [safePage, pageSize]
  );

  return {
    currentPage: safePage,
    pageSize,
    totalItems,
    setCurrentPage,
    paginatedSlice,
  };
}
