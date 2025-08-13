import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Button, Alert, Keyboard } from 'react-native'
import { useStudents } from '../../../core/hooks/useStudents'
import type { ReportStudent } from '../services/studentService'
import { savePresent, usePresentCount, removePresent } from '../services/studentService'
import { formatDateToFullDateTime, formatDateToYYYYMMDD } from 'helpers/dateHelper'
import { FilterBar } from 'core/components/FilterToolbar'
import { Category, Subcategoria } from 'types'
import { FlatList } from 'react-native'
import { ItemStudentAssistView } from '../../students/components/ItemStudentAssistView'
import debounce from 'lodash.debounce'
import { FAB } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'types'



type StudentListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ListaDeAlumnos'
>

type Props = {
  category: Category
  subcategoria: Subcategoria
}

export const StudentAssistListScreen: React.FC<Props> = ({ category, subcategoria }) => {
  const [searchInput, setSearchInput] = useState('')
  const [showOnlyPresent, setShowOnlyPresent] = useState(false)
  const [sortOrder, setSortOrder] = useState<'alf' | ''>('alf')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [refreshSignal, setRefreshSignal] = useState(false)
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null)

  const only_date = formatDateToYYYYMMDD(selectedDate)
  const today = formatDateToFullDateTime(selectedDate)
  const navigation = useNavigation<StudentListScreenNavigationProp>()


  const { countPresentes, loading: loadingPresentes } = usePresentCount(
    category,
    subcategoria,
    only_date,
    refreshSignal
  )

  const forzarRefrescoContador = () => {
    setRefreshSignal((prev) => !prev)
  }

  const {
    students,
    loading,
    loadingMore,
    error,
    loadMore,
    reload,
    setStudents,
    planillaId,
    updateQuery,
  } = useStudents(category, subcategoria, only_date, showOnlyPresent, sortOrder)


    useEffect(() => {
      const handler = setTimeout(() => {
        updateQuery(searchInput.toLowerCase())
      }, 400)
  
      return () => clearTimeout(handler)
    }, [searchInput])
  

  const toggleExpand = (id: number) => {
    setExpandedStudentId((prev) => (prev === id ? null : id))
  }

  const handleRefresh = () => {
    reload()
    forzarRefrescoContador()
  }

  const togglePresente = async (student: ReportStudent) => {
    if (!planillaId) {
      return Alert.alert('Error', 'No se pudo determinar la planilla.')
    }

    const nuevoEstado = student.presente !== 'si'

    try {
      const responseData = await savePresent({
        alumno_id: student.student_id,
        planilla_id: planillaId,
        fecha_presente: today,
      })

      const updatedStudent = {
        ...student,
        presente: nuevoEstado ? 'si' : 'no',
        planilla_presente_id: nuevoEstado ? responseData.id || -1 : -1,
        taken_classes: student.taken_classes
          ? student.taken_classes.map((tc, index) =>
              index === 0
                ? { ...tc, cant_presents: tc.cant_presents + (nuevoEstado ? 1 : -1) }
                : tc
            )
          : [],
      }

      forzarRefrescoContador()

      setStudents((prev) =>
        prev.map((s) => (s.student_id === student.student_id ? updatedStudent : s))
      )
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar la asistencia')
    }
  }

  const eliminarPresente = (student: ReportStudent) => {
    Alert.alert(
      'Confirmar',
      `¿Seguro que deseas sacar el presente a ${student.nombre} ${student.apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!student.planilla_presente_id || student.planilla_presente_id === -1) {
                return Alert.alert('Error', 'No hay presente registrado para eliminar.')
              }

              const res = await removePresent(student.planilla_presente_id)
              if (res.result && res.result !== 'success') {
                return Alert.alert('Error', 'No se pudo eliminar el presente.')
              }

              forzarRefrescoContador()

              setStudents((prev) =>
                prev.map((s) => {
                  if (s.student_id !== student.student_id) return s
                  const updatedTakenClasses = [...(s.taken_classes || [])]
                  if (updatedTakenClasses.length > 0 && updatedTakenClasses[0].cant_presents > 0) {
                    updatedTakenClasses[0].cant_presents -= 1
                  }

                  return {
                    ...s,
                    presente: 'no',
                    planilla_presente_id: -1,
                    taken_classes: updatedTakenClasses,
                  }
                })
              )
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar el presente.')
            }
          },
        },
      ]
    )
  }


  return (
    <View style={{ flex: 1, overflow: 'visible' }}>
      <FilterBar
        date={selectedDate}
        onDateChange={setSelectedDate}
        showOnlyPresent={showOnlyPresent}
        onTogglePresent={() => setShowOnlyPresent((prev) => !prev)}
        sortOrder={sortOrder}
        onToggleSortOrder={() => setSortOrder((prev) => (prev === 'alf' ? '' : 'alf'))}
        onRefresh={handleRefresh}
        searchText={searchInput}
        onSearchTextChange={setSearchInput}
        countPresentes={countPresentes}
        enableDatePicker={true}
        enablePresentFilter={true}
        enableSortOrder={true}
        enableRefresh={true}
      />
  
      {loading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ marginBottom: 10 }}>{error}</Text>
          <Button title="Reintentar" onPress={reload} />
        </View>
      ) : (
        <>
          <FlatList
            data={students}
            keyExtractor={(item, index) => `${item.planilla_alumno_id}-${item.student_id}-${index}`}
            keyboardShouldPersistTaps="handled"
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 10 }} /> : null}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <ItemStudentAssistView
                student={item}
                isExpanded={expandedStudentId === item.student_id}
                onToggleExpand={() => toggleExpand(item.student_id)}
                togglePresente={togglePresente}
                eliminarPresente={eliminarPresente}
                selectedDate={selectedDate}
              />
            )}
          />
          
          <FAB
              icon="plus"
              style={{
                position: 'absolute',
                bottom: 30,
                right: 30,
              }}
              onPress={() => navigation.navigate('ListaDeAlumnos', {
                category: 'category',
                subcategoria: 'subcategoria',
                modo: 'asistencias',
                planilla_id: planillaId
              })}
            />
        </>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
})
