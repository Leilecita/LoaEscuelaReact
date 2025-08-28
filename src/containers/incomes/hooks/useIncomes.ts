import { useCallback } from 'react';
import { Income, fetchIncomes } from '../services/incomeService';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';

export function useIncomes(
  payment_place: string,
  category: string = '',
  payment_method: string = ''
) {
  const fetchFn = useCallback(
    (page: number) => fetchIncomes(page, payment_place, category, payment_method),
    [payment_place, category, payment_method] // 👈 agregamos los 3 filtros como dependencias
  );

  const {
    data: incomes,
    loading,
    loadingMore,
    error,
    loadMore,
    refreshing,
    reload,
    setData,
  } = usePaginatedFetch<Income>(fetchFn, [fetchFn]);

  return {
    incomes,
    loading,
    loadingMore,
    error,
    loadMore,
    refreshing,
    reload,
    setData,
  };
}
