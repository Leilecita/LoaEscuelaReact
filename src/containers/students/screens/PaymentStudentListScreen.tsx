import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Button } from 'react-native'
import { useAllStudents } from '../../../core/hooks/useAllStudents'
import { FilterBar } from 'core/components/FilterToolbar'
import { Category, Subcategoria } from 'types'
import { ItemStudentAddPaymentView } from '../components/ItemStudentAddPaymentView'
import { FAB } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'types'

type PaymentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ListaDeAlumnos'
>

type Props = {
  category: Category
  subcategoria: Subcategoria
}

export const PaymentStudentListScreen: React.FC<Props> = ({ category, subcategoria }) => {
  const [searchInput, setSearchInput] = useState('')
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null)

  const navigation = useNavigation<PaymentScreenNavigationProp>()

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

  useEffect(() => {
    const handler = setTimeout(() => {
      updateQuery(searchInput.toLowerCase())
    }, 400)

    return () => clearTimeout(handler)
  }, [searchInput])

  const toggleExpand = (id: number) => {
    setExpandedStudentId((prev) => (prev === id ? null : id))
  }

  return (
    <View style={{ flex: 1,backgroundColor: 'rgb(239, 241, 202)'}}>
      <FilterBar
        searchText={searchInput}
        onSearchTextChange={setSearchInput}
        onRefresh={reload}
      />

      {loading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ marginBottom: 10 }}>{error}</Text>
          <Button title="Reintentar" onPress={reload} />
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item, index) => `${item.student_id}-${index}`}
          keyboardShouldPersistTaps="handled"
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 10 }} /> : null}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <ItemStudentAddPaymentView
              student={item}
              isExpanded={expandedStudentId === item.id}
              onToggleExpand={() => toggleExpand(item.id)}
              planilla_id={planillaId ?? undefined} 
            />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
})
