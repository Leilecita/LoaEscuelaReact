import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { fetchIncomesByStudent, Income } from '../services/incomeService';

type UseIncomesByStudentProps = {
  studentId: number;
};

export function useIncomesByStudent({ studentId }: UseIncomesByStudentProps) {
  const fetchFn = useCallback(
    (page: number) => fetchIncomesByStudent(studentId, page),
    [studentId]
  );

  const { data, loading, loadingMore, error, loadMore, reload } =
    usePaginatedFetch<Income>(fetchFn, [studentId]);

  return { incomes: data, loading, loadingMore, error, loadMore, reload };
}
