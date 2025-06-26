import React, { useState, useMemo, useEffect } from 'react'
import {
  View,
  SectionList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { Category, Subcategoria } from 'types'
import { useAllStudents } from '../../../core/hooks/useAllStudents'
import type { Student } from '../services/studentService'
import { ItemStudentView } from '../../../core/components/ItemStudentView'
import { FilterBar } from 'core/components/FilterToolbar' // ajustá ruta si es necesario

type Props = {
  category: Category | 'Todo'
  subcategoria: Subcategoria | 'Todo'
}

type Section = {
  title: string
  data: Student[]
}

export const StudentListScreen: React.FC<Props> = ({ category, subcategoria }) => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // Aplicar debounce para no filtrar ni hacer fetch en cada letra
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchInput)
    }, 400)

    return () => clearTimeout(handler)
  }, [searchInput])

  const {
    students,
    loading,
    loadingMore,
    error,
    loadMore,
    reload,
  } = useAllStudents({
    category,
    query: debouncedSearchText,
    orderBy: 'created',
  })

  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedStudentId((prev) => (prev === id ? null : id))
  }

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.nombre} ${student.apellido}`.toLowerCase()
      return fullName.includes(debouncedSearchText.toLowerCase())
    })
  }, [students, debouncedSearchText])


  const sections = useMemo(() => {
    return groupStudentsByDate(filteredStudents)
  }, [filteredStudents])

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>{error}</Text>
        <Text onPress={reload} style={{ color: '#007AFF' }}>
          Reintentar
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FilterBar
        searchText={searchInput}            
        onSearchTextChange={setSearchInput} 
        onRefresh={reload}
        countPresentes={students.length}
        enableRefresh={false}
        enableDatePicker={false}
        enablePresentFilter={false}
        enableSortOrder={false}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemStudentView
            student={item}
            isExpanded={expandedStudentId === item.id}
            onToggleExpand={() => toggleExpand(item.id)}
          />
        )}
        
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={true}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 10 }} /> : null}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

function groupStudentsByDate(students: Student[]): Section[] {
  const groups: Record<string, Student[]> = {}

  students.forEach((student) => {
    const date = student.created ? student.created.slice(0, 10) : 'Fecha desconocida'
    if (!groups[date]) groups[date] = []
    groups[date].push(student)
  })

  return Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0])) // orden descendente por fecha
    .map(([title, data]) => ({ title, data }))
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
})
