import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { FAB, Button, TextInput } from 'react-native-paper'
import { COLORS } from '@core'
import api from '../../core/services/axiosClient'
import { usePaginatedFetch } from '../../core/hooks/usePaginatedFetch'
import Modal from 'react-native-modal';
import { DateHeader } from '../../core/components/DateHeader';

type Planilla = {
  id: number
  categoria: string
  subcategoria: string
  anio: string
  date: string
  created: string
}

type PlanillaPost = {
 categoria: string
 subcategoria: string
 anio: string
 date: string
}

// ----------------------
// API
// ----------------------
async function postPlanilla(payload: Omit<PlanillaPost, 'id'>) {
 const response = await api.post('/planillas.php', { ...payload });

 if (response.data?.result === 'success') {
   return response.data.data;
 } else {
   throw new Error(response.data?.message || 'Error creando planilla');
 }
}


async function fetchPlanillas(page: number): Promise<Planilla[]> {
  const response = await api.get('/planillas.php', {
    params: { 
      method: 'getAll',
      page,
    },
  })

  const dataArray = response.data.data
  if (Array.isArray(dataArray)) return dataArray
  return []
}

export const AttendanceSheetScreen: React.FC = () => {
  const [showModal, setShowModal] = useState(false)

  // Estados de inputs
  const [anio, setAnio] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const [categoria, setCategoria] = useState('')
  const [subcategoria, setSubcategoria] = useState('')

  const categorias = [
    { label: 'Escuela', value: 'escuela' },
    { label: 'Colonia', value: 'colonia' },
    { label: 'Highschool', value: 'highschool' },
  ]

  const subcategorias = [
    { label: 'Intermedios', value: 'intermedios' },
    { label: 'Adultos', value: 'adultos' },
    { label: 'Kids', value: 'kids' },
    { label: 'Mini', value: 'mini' },
    { label: 'Highschool', value: 'highschool' },
  ]

  const fetchPlanillass = useCallback((page: number) => fetchPlanillas(page), [])

  const {
    data: planillas,
    loading,
    loadingMore,
    refreshing,
    reload,
    loadMore,
  } = usePaginatedFetch<Planilla>(fetchPlanillass, [])

  let lastYear = 0

  const renderItem = ({ item }: { item: Planilla }) => {
   const year = getYearFromCreated(item.created)
   const showHeader = year !== lastYear
   lastYear = year
 
   return (
     <View>
       {showHeader && <DateHeader date={item.created} />}
       <View style={styles.item}>
         <Text style={styles.cat}>{item.categoria}</Text>
         <Text>{item.subcategoria}</Text>
         <Text>{item.anio}</Text>
       </View>
     </View>
   )
 }

const [showCatOptions, setShowCatOptions] = useState(false)
const [showSubOptions, setShowSubOptions] = useState(false)

const handleDateChange = (event: any, selectedDate?: Date) => {
 if (!selectedDate) {
   if (Platform.OS === 'android') setShowDatePicker(false)
   return
 }
 setDate(selectedDate)
 if (Platform.OS === 'android') setShowDatePicker(false)
}
const formatDate = (date: Date): string => {
 const year = date.getFullYear()
 const month = String(date.getMonth() + 1).padStart(2, '0')
 const day = String(date.getDate()).padStart(2, '0')
 return `${year}-${month}-${day}`
}

const getYearFromCreated = (created: string) => {
 const date = new Date(created)
 return date.getFullYear()
}

return (
 <View style={styles.container}>

   {/* Lista de planillas */}
   <FlatList
     data={planillas}
     keyExtractor={(item, index) => `${item.id}-${index}`}
     renderItem={renderItem}
     onEndReached={loadMore}
     onEndReachedThreshold={0.5}
     refreshing={refreshing}
     onRefresh={reload}
     ListFooterComponent={
       loadingMore ? <ActivityIndicator style={{ margin: 12 }} /> : null
     }
   />

   {/* FAB para agregar */}
   <FAB icon="plus" style={styles.fab} onPress={() => setShowModal(true)} />

   {/* Modal */}
   {showModal && (
     <View style={styles.modalContent}>
       <Text style={styles.modalTitle}>Nueva Planilla</Text>

       {/* Año */}
       <TextInput
         label="Año"
         value={anio}
         onChangeText={setAnio}
         mode="outlined"
         keyboardType="numeric"
         style={styles.input}
       />
       <Text style={styles.helperText}>
          Ingresar año temporada. Ej. 2026-2027 / 2027-2028
        </Text>

       {/* Fecha */}
       <TouchableOpacity onPress={() => setShowDatePicker(true)}>
         <TextInput
           label="Fecha"
           value={formatDate(date)}
           mode="outlined"
           editable={false}
           pointerEvents="none"
           style={styles.input}
           left={<TextInput.Icon icon="calendar" />}
         />
       </TouchableOpacity>
       {showDatePicker && (
         Platform.OS === 'ios' ? (
           <Modal
             isVisible={showDatePicker}
             onBackdropPress={() => setShowDatePicker(false)}
           >
             <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
               <DateTimePicker
                 value={date}
                 mode="date"
                 display="spinner"
                 onChange={handleDateChange}
               />
               <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                 <TouchableOpacity
                   onPress={() => setShowDatePicker(false)}
                   style={{
                     paddingVertical: 8,
                     paddingHorizontal: 16,
                     borderRadius: 6,
                     backgroundColor: '#eee',
                     marginRight: 12,
                     minWidth: 90,
                     alignItems: 'center',
                   }}
                 >
                   <Text>Cancelar</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   onPress={() => setShowDatePicker(false)}
                   style={{
                     paddingVertical: 8,
                     paddingHorizontal: 16,
                     borderRadius: 6,
                     backgroundColor: COLORS.headerDate,
                     minWidth: 90,
                     alignItems: 'center',
                   }}
                 >
                   <Text style={{ color: '#fff' }}>Aceptar</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </Modal>
         ) : (
           <DateTimePicker
             value={date}
             mode="date"
             display="calendar"
             onChange={handleDateChange}
           />
         )
       )}


       {/* Categoría */}
       <TouchableOpacity onPress={() => setShowCatOptions(!showCatOptions)}>
         <TextInput
           label="Categoría"
           value={categoria}
           mode="outlined"
           editable={false}
           pointerEvents="none"
           style={styles.input}
         />
       </TouchableOpacity>

       {showCatOptions && (
         <View style={styles.dropdown}>
           {categorias.map((c) => (
             <TouchableOpacity
               key={typeof c === 'string' ? c : c.value}  // ✅ clave segura
               style={styles.dropdownItem}
               onPress={() => {
                 setCategoria(typeof c === 'string' ? c : c.value)
                 setShowCatOptions(false)
               }}
             >
               <Text>{typeof c === 'string' ? c : c.label}</Text>
             </TouchableOpacity>
           ))}
         </View>
       )}

       {/* Subcategoría */}
       <TouchableOpacity onPress={() => setShowSubOptions(!showSubOptions)}>
         <TextInput
           label="Subcategoría"
           value={subcategoria}
           mode="outlined"
           editable={false}
           pointerEvents="none"
           style={styles.input}
         />
       </TouchableOpacity>

       {showSubOptions && (
         <View style={styles.dropdown}>
           {subcategorias.map((s) => (
             <TouchableOpacity
               key={typeof s === 'string' ? s : s.value}  // ✅ clave segura
               style={styles.dropdownItem}
               onPress={() => {
                 setSubcategoria(typeof s === 'string' ? s : s.value)
                 setShowSubOptions(false)
               }}
             >
               <Text>{typeof s === 'string' ? s : s.label}</Text>
             </TouchableOpacity>
           ))}
         </View>
       )}

       {/* Botones */}
       <View style={styles.modalActions}>
         <Button onPress={() => setShowModal(false)}>Cancelar</Button>
         <Button
           mode="contained"
           onPress={async () => {
             try {
               await postPlanilla({
                categoria,
                subcategoria,
                anio,
                date: formatDate(date), // ✅ formato correcto
              })
               
               setShowModal(false);
               reload(); // refresca la lista
             } catch (e: any) {
               console.error('Error creando planilla', e.message);
             }
           }}
         >
           Guardar
         </Button>
       </View>
     </View>
   )}
 </View>
)

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cat: {
    fontWeight: 'bold',
    color: COLORS.lightGreenColor,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: COLORS.lightGreenColor,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { marginBottom: 10 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  dropdown: {
   position: 'absolute',
   width: '100%',
   backgroundColor: '#fff',
   borderWidth: 1,
   borderColor: '#ccc',
   borderRadius: 8,
   zIndex: 10,
 },
 dropdownItem: {
   padding: 12,
   borderBottomWidth: 1,
   borderBottomColor: '#eee',
 },
 helperText: {
  fontSize: 12,
  color: '#888', // gris claro
  marginBottom: 10,
  marginLeft: 4,
},
 
})
