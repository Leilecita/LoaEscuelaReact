import { useCallback } from 'react'
import { usePaginatedFetch } from '../../../src/core/hooks/usePaginatedFetch'
import { fetchAllStudents, Student } from 'containers/students/services/studentService'

export function useAllStudents(params: {
  category?: string
  query?: string
  orderBy?: 'created' | 'nombre'
}) {
  const { category = 'todos', query = '', orderBy = 'created' } = params

  const fetchFn = useCallback(
    (page: number) => fetchAllStudents(page, category, query, orderBy),
    [category, query, orderBy]
  )

  const {
    data: students,
    loading,
    loadingMore,
    error,
    reload,
    loadMore,
    setData: setStudents,
  } = usePaginatedFetch<Student>(fetchFn, [fetchFn])

  return {
    students,
    loading,
    loadingMore,
    error,
    reload,
    loadMore,
    setStudents,
  }
}
