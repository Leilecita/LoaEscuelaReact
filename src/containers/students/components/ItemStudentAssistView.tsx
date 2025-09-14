import React, { useContext } from 'react';
import { View, Text, Linking, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import { Checkbox, IconButton } from 'react-native-paper'
import type { ReportStudent } from '../services/studentService'
import { ContactRow } from '../../../core/components/ContactRow'
import { InformationRow } from '../../../core/components/InformationRow'
import { InitialAvatar } from '../../../core/components/InitialAvatar'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'types'
import { COLORS } from 'core/constants'
import { useNavigation } from '@react-navigation/native'

import { AuthContext } from '../../../contexts/AuthContext';

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
  const { userRole } = useContext(AuthContext);
  const totalClasesTomadas = student.taken_classes?.[0]?.cant_presents || 0
  const isToday = selectedDate.toDateString() === new Date().toDateString()
  const isAdmin = userRole === 'admin';

  const isEnabled = isAdmin || isToday;

  console.log(isAdmin)

    return (
    <View style={styles.itemContainer_check}>
      <Pressable style={styles.row} onPress={onToggleExpand}>
       <InitialAvatar letra={student.nombre.charAt(0)} category={student.sub_category}  />

        <View style={styles.infoContainer}>
          <Text style={styles.name} onPress={onToggleExpand}>
            {student.nombre} {student.apellido}
          </Text>
          <Text style={styles.dni}>{student.dni}</Text>
           {student.student_observation?.trim() !== '' && (
            <Text style={[styles.dni, { color: COLORS.darkLetter3, marginTop: 2 }]}>{student.student_observation}</Text>
            )}
        </View>
        <Text style={{ marginRight: 8, color: '#666', fontSize: 12 }}>
          {totalClasesTomadas}
        </Text>
        
         <TouchableOpacity
            onPress={() => {
              if (!isEnabled) return; 
             // if (!isToday) return;
              student.presente === 'si'
                ? eliminarPresente(student)
                : togglePresente(student);
            }}
            style={[
              styles.checkbox,
              student.presente === 'si' && styles.checked,
              { borderColor: !isToday
                ? 'gray' // 👈 color distinto si no es hoy
                : COLORS.button,
                backgroundColor: student.presente === 'si' ? COLORS.button : 'transparent' },
            ]}
            disabled={!isEnabled}
          >
            {student.presente === 'si' && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity> 
      </Pressable>

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
              style={{
                alignSelf: 'flex-end',   // se alinea a la derecha
                backgroundColor: COLORS.transparentGreenColor,
                borderRadius: 6,
                marginTop: 8,
                marginBottom: 4,
                paddingVertical : 4,
                paddingHorizontal: 10,   // controla ancho del botón
                justifyContent: 'center', // centra verticalmente
                alignItems: 'center',  
              }}
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
    fontFamily: 'OpenSans-Regular',
    fontSize: 17,
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
