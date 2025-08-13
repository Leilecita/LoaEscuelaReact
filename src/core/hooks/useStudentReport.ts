// hooks/useReportStudents.ts
import { useState, useEffect, useCallback } from 'react'
import { fetchStudentsForPayment, ReportStudent } from 'containers/students/services/studentService'


import { Category, Subcategoria } from 'types'
import { usePaginatedFetch } from './usePaginatedFetch'

export function useStudentReport(
  category: Category,
  subcategoria: Subcategoria,
  date: string,
  showOnlyPresent: boolean,
  sortOrder: 'alf' | ''
) {
  const [query, setQuery] = useState('')

  const fetchFn = useCallback(async (page: number) => {
    const res = await fetchStudentsForPayment(
      page,
      category,
      date,
      showOnlyPresent ? 'true' : 'false',
      sortOrder,
      query
    )
    return res.list_rep
  }, [category, date, showOnlyPresent, sortOrder, query])

  const {
    data: students,
    loading,
    loadingMore,
    error,
    loadMore,
    reload,
    setData: setStudents,
  } = usePaginatedFetch<ReportStudent>(fetchFn, [fetchFn])

  return {
    students,
    loading,
    loadingMore,
    error,
    loadMore,
    reload,
    setStudents,
    updateQuery: setQuery,
  }
}
