import React from 'react'
import { View, Text, Linking, StyleSheet, TouchableOpacity } from 'react-native'
import { Checkbox, IconButton } from 'react-native-paper'
import type { ReportStudent } from '../services/studentService'
import { ContactRow } from '../../../core/components/ContactRow'
import { InformationRow } from '../../../core/components/InformationRow'
import { InitialAvatar } from '../../../core/components/InitialAvatar'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'types'
import { COLORS } from 'core/constants'
import { useNavigation } from '@react-navigation/native'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'InformationStudent'>
type Props = {
  student: ReportStudent
  isExpanded: boolean
  onToggleExpand: () => void
  togglePresente: (student: ReportStudent) => void
  eliminarPresente: (student: ReportStudent) => void
  selectedDate: Date
}

export const ItemStudentAssistView: React.FC<Props> = ({
  student,
  isExpanded,
  onToggleExpand,
  togglePresente,
  eliminarPresente,
  selectedDate
  
}) => {
  const navigation = useNavigation<NavigationProp>()

  const totalClasesTomadas = student.taken_classes?.[0]?.cant_presents || 0
  const isToday = selectedDate.toDateString() === new Date().toDateString()
  return (
    <View style={styles.itemContainer_check}>
      <View style={styles.row}>
       <InitialAvatar letra={student.nombre.charAt(0)} />

        <View style={styles.infoContainer}>
          <Text style={styles.name} onPress={onToggleExpand}>
            {student.nombre} {student.apellido}
          </Text>
          <Text style={styles.dni}>{student.dni}</Text>
           {student.student_observation?.trim() !== '' && (
            <Text style={[styles.dni, { color: '#6a1b9a', marginTop: 2 }]}>{student.student_observation}</Text>
            )}
        </View>
        <Text style={{ marginRight: 8, color: '#666', fontSize: 12 }}>
          {totalClasesTomadas}
        </Text>
        
          <TouchableOpacity
            onPress={() => {
              if (!isToday) return;
              student.presente === 'si'
                ? eliminarPresente(student)
                : togglePresente(student);
            }}
            style={[
              styles.checkbox,
              student.presente === 'si' && styles.checked,
              { borderColor: COLORS.button, backgroundColor: student.presente === 'si' ? COLORS.button : 'transparent' },
            ]}
            disabled={!isToday}
          >
            {student.presente === 'si' && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>

             {/* Línea separadora 
        <View style={[
            styles.rightBox,
            {
              backgroundColor: isToday ? '#fff' : ' #f3e5f5',      
              borderColor: isToday ? ' #000' : ' #b39ddb',         
              borderWidth: 1,
              opacity: isToday ? 1 : 0.8,                        
            },
          ]}
        >
          <Checkbox
            status={student.presente === 'si' ? 'checked' : 'unchecked'}
            onPress={() => {
              if (!isToday) return
              student.presente === 'si'
                ? eliminarPresente(student)
                : togglePresente(student)
            }}
            
            color={isToday ? 'black' : '#b39ddb'} // violeta suave
            uncheckedColor="transparent"
            disabled={!isToday}
          /> 
        </View>*/}
      </View>

      {isExpanded && (
        <View style={styles.extraInfo}>
          <View style={styles.infoSection}>
            <InformationRow texto="clases tomadas" numero={`${student.taken_classes[0].cant_presents ?? 0} de ${student.taken_classes[0].cant_buyed_classes ?? 0}`}/>
            <InformationRow texto="deuda" numero={`$ ${ (student.taken_classes[0].tot_amount ?? 0) - (student.taken_classes[0].tot_paid_amount ?? 0) }`} />
          </View>
  
            {/* Línea separadora */}
            <View style={styles.separator} />
           {student.tel_adulto && (
            <ContactRow name={student.nombre} phone={student.tel_adulto} />
          )}
          {student.nombre_mama && (
            <ContactRow name={student.nombre_mama} phone={student.tel_mama} />
          )}

          {student.nombre_papa && (
            <ContactRow name={student.nombre_papa} phone={student.tel_papa} />
          )}
           

           <TouchableOpacity
              onPress={() =>
                navigation.navigate('InformationStudent', {  studentId: student.student_id,
                  firstName: student.nombre,   
                  lastName: student.apellido,
                  category: student.category,
                  sub_category: student.sub_category })
              }
            >
              <Text style={styles.masInfoText}>+ info</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  )
}



const styles = StyleSheet.create({
  itemContainer_check: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 2,
    paddingLeft: 10,
    paddingRight: 16,
    paddingTop:8,
    paddingBottom:8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // para Android
  },
  itemContainer_checkw: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  rightBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  name: {
    fontFamily:'OpenSans-Regular',
    color: COLORS.darkLetter,
    fontSize: 18,
  },
  dni: {
    fontFamily:'OpenSans-Light',
    color: COLORS.darkLetter,
    fontSize: 16,
  },
  extraInfo: {
    marginTop: 10,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  infoSection: {
    marginBottom: 8, // espacio antes de la línea
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  masInfoText: {
    marginTop: 8,
    marginBottom:6,
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    marginRight: 14,
    color: COLORS.buttonClearLetter, 
    textDecorationLine: 'none', // 👈 sin subrayado
    textAlign: 'right',          // 👈 alineado a la izquierda
  },
  checkbox: {
    width: 44,        
    height: 38,       
    borderWidth: 4,
    borderColor: COLORS.button,
    borderRadius: 6,   
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 24,      // antes 18
    fontWeight: 'bold',
  },
  
  checked: {
    // relleno cuando está seleccionado
  },
 
  
})
