import { useCallback, useEffect, useState } from 'react'

export function usePaginatedFetch<T>(
  fetchFn: (page: number) => Promise<T[]>,
  deps: any[] = []
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const load = useCallback(
    async (pageToLoad: number, reset = false) => {
      if (reset) {
        setHasMore(true)
        setData([])
      }

      if (!hasMore && !reset) return

      if (reset) setLoading(true)
      else setLoadingMore(true)

      try {
        const result = await fetchFn(pageToLoad)
        if (reset) setData(result)
        else setData(prev => [...prev, ...result])

        setHasMore(result.length > 0)
        setError(null)
      } catch (e: any) {
        setError(e.message ?? 'Error al cargar datos')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [fetchFn, hasMore]
  )

  useEffect(() => {
    setPage(0)
    load(0, true)
  }, [fetchFn, ...deps]) 

  useEffect(() => {
    if (page === 0) return
    load(page)
  }, [page, load])

  const reload = () => {
    setPage(0)
    load(0, true)
  }

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  return {
    data,
    loading,
    loadingMore,
    error,
    reload,
    loadMore,
    setData,
    setPage,
  }
}
