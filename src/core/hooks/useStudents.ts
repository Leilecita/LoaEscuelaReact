import { useState, useCallback, useEffect } from 'react'
import { Category, Subcategoria } from 'types'
import { fetchStudentsByAssists, ReportStudent } from 'containers/students/services/studentService'
import { usePaginatedFetch } from './usePaginatedFetch'

export function useStudents(
  category: Category,
  subcategoria: Subcategoria,
  date: string,
  showOnlyPresent: boolean,
  sortOrder: 'alf' | ''
) {
  const [query, setQuery] = useState('')
  const [planillaId, setPlanillaId] = useState<number | null>(null)

  // Guardamos la última respuesta para obtener planillaId
  const [lastResponse, setLastResponse] = useState<{ planilla_id: number | null }>({ planilla_id: null })

  const fetchFn = useCallback(async (page: number) => {
    const res = await fetchStudentsByAssists(
      page,
      category,
      subcategoria,
      date,
      showOnlyPresent ? 'true' : 'false',
      sortOrder,
      query
    )
    //console.log('📥 Respuesta del backend:', JSON.stringify(res.list_rep,null,2))
    setLastResponse({ planilla_id: res.planilla_id })
    return res.list_rep
  }, [category, subcategoria, date, showOnlyPresent, sortOrder, query])

  const {
    data: students,
    loading,
    loadingMore,
    error,
    loadMore,
    reload,
    setData: setStudents,
  } = usePaginatedFetch<ReportStudent>(fetchFn, [fetchFn])

  // Actualizamos planillaId cuando cambia la respuesta del fetch
  useEffect(() => {
    setPlanillaId(lastResponse.planilla_id)
  }, [lastResponse.planilla_id])

  return {
    students,
    loading,
    loadingMore,
    error,
    loadMore,
    reload,
    setStudents,
    planillaId,
    updateQuery: setQuery,
  }
}
