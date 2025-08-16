// src/features/incomes/hooks/useIncomes.ts
import { useCallback } from 'react'
import { Income, fetchIncomes } from '../services/incomeService'
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch'

export function useIncomes(payment_place: string) {
  const fetchFn = useCallback(
    (page: number) => fetchIncomes(page, payment_place),
    [payment_place]
  )

  const {
    data: incomes,
    loading,
    loadingMore,
    error,
    loadMore,
    refreshing,
    reload,
    setData,
  } = usePaginatedFetch<Income>(fetchFn, [fetchFn])

  return {
    incomes,
    loading,
    loadingMore,
    error,
    loadMore,
    refreshing,
    reload,
    setData,
  }
}
