import React, { useState } from 'react'
import { useStudent } from '../../../../src/core/hooks/useStudent'
import { StudentListBase } from '../../../../src/core/components/StudentListBase'
import { formatDateToYYYYMMDD } from 'helpers/dateHelper'
import { Category, Subcategoria } from 'types'

type Props = {
  category: Category,
  subcategoria: Subcategoria
}

export const StudentListScreen: React.FC<Props> = ({ category, subcategoria }) => {
  const [searchText, setSearchText] = useState('')

  const today = formatDateToYYYYMMDD(new Date())
  const showOnlyPresent = false
  const sortOrder: 'asc' | 'desc' = 'asc'
  const {
    students,
    loading,
    loadingMore,
    error,
    loadMore,
    reload,
  } = useStudent(category, subcategoria, today, showOnlyPresent, sortOrder)

  return (
    <>
      {/* Podés poner un buscador aquí también si querés */}

      <StudentListBase
        students={students}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        loadMore={loadMore}
        reload={reload}
        showCheckbox={false}
        searchText={searchText}
        onSearchTextChange={setSearchText}
      />
    </>
  )
}
