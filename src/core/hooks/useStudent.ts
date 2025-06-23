import { fetchStudentsByAssists, Student } from "containers/students/services/studentService"
import React, { useEffect, useState, useCallback } from 'react';
import { Category, Subcategoria } from "types";

export function useStudent(
  category: Category,
  subcategoria: Subcategoria,
  date: string,
  showOnlyPresent: boolean,
  sortOrder: 'asc' | 'desc'
) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [planillaId, setPlanillaId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const load = useCallback(
    async (pageToLoad: number, reset = false) => {
      if (reset) {
        setHasMore(true);
        setStudents([]);
      }

      if (!hasMore && !reset) return;

      if (reset) setLoading(true);
      else setLoadingMore(true);

      try {
        console.log('fetchStudentsByAssists params:', {
  page: pageToLoad,
  category,
  subcategoria,
  date,
  showOnlyPresent,
  sortOrder,
  query,
});
        const res = await fetchStudentsByAssists(
          pageToLoad,
          category,
          subcategoria,
          date,
          showOnlyPresent ? 'true' : 'false',
          sortOrder,
          query
        );

        if (reset) setStudents(res.list_rep);
        else setStudents((prev) => [...prev, ...res.list_rep]);

        setHasMore(res.list_rep.length > 0);
        setPlanillaId(res.planilla_id);
        setError(null);
      } catch (e: any) {
        setError(e.message ?? 'Error al cargar estudiantes');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, subcategoria, date, showOnlyPresent, sortOrder, hasMore, query]
  );

  useEffect(() => {
    setPage(1);
    load(1, true);
  }, [category, subcategoria, date, showOnlyPresent, sortOrder, query]);

  useEffect(() => {
    if (page === 1) return;
    load(page);
  }, [page]);

  const reload = () => {
    setPage(1);
    load(1, true);
  };

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    students,
    loading,
    loadingMore,
    error,
    loadMore,
    reload,
    setStudents,
    planillaId,
    updateQuery,
  };
}
