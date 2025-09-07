import React, { useState, useMemo, useEffect } from 'react'
import {
  View,
  SectionList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Button, ImageBackground
} from 'react-native'
import { Category, RootStackParamList, Subcategoria } from 'types'
import { useAllStudents } from '../../../core/hooks/useAllStudents'
import type { Student } from '../services/studentService'
import { addStudentToAssist } from '../services/studentService'
import { ItemStudentView } from '../components/ItemStudentView'
import { ItemStudentAddToAssistView } from '../components/ItemStudentAddToAssistView'
import { ItemStudentAddPaymentView } from '../components/ItemStudentAddPaymentView'
import { FilterBar } from 'core/components/FilterToolbar' 
import { FAB } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { COLORS } from '@core'
import { PaymentModal } from '../../../core/components/PaymentModal'
import { DateHeader } from '../../../core/components/DateHeader';
import { SurfPriceBottomSheet } from 'core/components/SurfPriceBottomSheet'
import { SimpleFilterToolbar } from 'core/components/SimpleFilterToolbar'


type StudentListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ListaDeAlumnos'
>

/*type Props = {
  category: Category | 'Todo'
  subcategoria: Subcategoria | 'Todo'
}*/
type Props = {
  route: RouteProp<RootStackParamList, 'ListaDeAlumnos'>
}

type Section = {
  title: string
  data: Student[]
}

export const StudentListScreen: React.FC<Props> = ({ route }) => {
 // const { category, subcategoria } = route.params
  const { category, subcategoria, modo = 'asistencias', planilla_id } = route.params

//export const StudentListScreen: React.FC<Props> = ({ category, subcategoria }) => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  const navigation = useNavigation<StudentListScreenNavigationProp>()
  
  const [showSurfPriceSheet, setShowSurfPriceSheet] = useState(false);

  const handleAgregar = async (alumno_id: number) => {
    if (!planilla_id) {
      console.warn('No se recibió planilla_id para agregar alumno')
      return
    }
  
    try {
      await addStudentToAssist({ planilla_id, alumno_id })
      alert('Alumno agregado a la planilla correctamente')
      reload()  // refresca la lista si querés que se actualice
    } catch (error) {
      alert('Error al agregar alumno a la planilla')
    }
  }

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

  const [modalVisible, setModalVisible] = useState(false)
  //const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const openCargarPagoModal = (student: Student) => {
    
    setSelectedStudent(student)
    setModalVisible(true)
  }

  /*const openCargarPagoModal = (studentId: number) => {
    setSelectedStudentId(studentId)
    setModalVisible(true)
  }*/

  const handleSubmitPago = (data: {
    fecha: Date
    monto: string
    metodo: 'efectivo' | 'transferencia' | 'mp'
    detalle: string
  }) => {
    console.log('Pago guardado para alumno', selectedStudent, data)
    // Aquí llamar al backend para guardar el pago
    setModalVisible(false)
  }


  return (
    <ImageBackground
    source={require('../../../../assets/fondo.png')}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={{ flex: 1}}>
      <SimpleFilterToolbar
        searchText={searchInput}
        onSearchTextChange={setSearchInput}
        onRefresh={reload}
      />

     
  
      {loading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ marginBottom: 10 }}>{error}</Text>
          <Text onPress={reload} style={{ color: '#007AFF' }}>
            Reintentar
          </Text>
        </View>
      ) : (
        <>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              modo === 'asistencias' ? (
                <ItemStudentAddToAssistView
                student={item}
                isExpanded={expandedStudentId === item.id}
                onToggleExpand={() => toggleExpand(item.id)}
                planilla_id={planilla_id ?? undefined}  // si es null, le pasamos undefined
                onAgregar={handleAgregar}
              />
              ) : modo === 'cargarPago' ? (
                <ItemStudentAddPaymentView
                  student={item}
                  isExpanded={expandedStudentId === item.id} // usar student_id
                  onToggleExpand={() => toggleExpand(item.id)}
                  onCargarPago={(studentId: number) => openCargarPagoModal(students.find(s => s.id === studentId)!)}
                  />

              ) : (
                <ItemStudentView
                  student={item}
                  isExpanded={expandedStudentId === item.id}
                  onToggleExpand={() => toggleExpand(item.id)}
                />
              )
            }
            renderSectionHeader={({ section: { title } }) => (
              <View style={{ marginHorizontal: 10 }}>
                <DateHeader date={title} />
              </View>
            )}
            stickySectionHeadersEnabled={true}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 10 }} /> : null}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <PaymentModal
            visible={modalVisible}
            studentId={selectedStudent?.id ?? null}
            firstName={selectedStudent?.nombre ?? ''}
            lastName={selectedStudent?.apellido ?? ''}
            category={selectedStudent?.category ?? ''} 
            sub_category={selectedStudent?.sub_category ?? ''} 
            onClose={() => setModalVisible(false)}
            onSubmit={handleSubmitPago}
          />
          {modo === 'cargarPago' && (
            <SurfPriceBottomSheet
              visible={showSurfPriceSheet}
              onClose={() => setShowSurfPriceSheet(false)}
              price={5000} // o lo que quieras pasar dinámicamente
            />
          )}

          {modo === 'cargarPago' && (
            <TouchableOpacity
              style={styles.surfPriceButton}
              onPress={() => setShowSurfPriceSheet(true)}
            >
              <Text style={styles.surfPriceButtonText}>
                Ver valor de las clases de surf
              </Text>
            </TouchableOpacity>
          )}

  
          <FAB
            icon="plus"
            color= {COLORS.fabTextColor}
            style={{
              position: 'absolute',
              bottom: 30,
              right: 30,
              backgroundColor: COLORS.fabColor
            }}
            onPress={() => navigation.navigate('CreateStudent')}
          />
        </>
      )}
    </View>
    </ImageBackground>
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
    backgroundColor: COLORS.headerDate,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start', // Hace que se ajuste solo al contenido
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
  surfPriceButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // para Android
  },
  surfPriceButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  background: {
    flex: 1,
  },
})
