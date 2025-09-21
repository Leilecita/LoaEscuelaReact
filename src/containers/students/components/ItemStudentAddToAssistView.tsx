import React from 'react'
import { View, Text, Linking, StyleSheet, Pressable } from 'react-native'
import { IconButton } from 'react-native-paper'
import type { Student } from '../services/studentService'
import { COLORS } from 'core/constants'
import { InitialAvatar } from '../../../core/components/InitialAvatar'
import { ContactRow } from '../../../core/components/ContactRow'

type Props = {
  student: Student
  isExpanded: boolean
  onToggleExpand: () => void
  onAgregar: (studentId: number, planillaId: number | undefined) => void
  planilla_id?: number | null
}

export const ItemStudentAddToAssistView: React.FC<Props> = ({
  student,
  isExpanded,
  onToggleExpand,
  onAgregar,
  planilla_id,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.topRow}>
        <InitialAvatar letra={student.nombre.charAt(0)} />
         {/* Bloque 1: Nombre y DNI */}
         <View style={styles.leftColumn}>
           <Text style={styles.name} onPress={onToggleExpand}>
             {student.nombre} {student.apellido}
           </Text>
           <Text style={styles.dni}>{student.dni}</Text>
         </View>

         {/* Bloque 2: Botón */}
         <View style={styles.rightColumn}>
           <Pressable
             style={styles.button}
             onPress={() => onAgregar(student.id, planilla_id ?? undefined)}
           >
             <Text style={styles.buttonText}>asignar a{'\n'}  planilla</Text>
           </Pressable>
         </View>
      </View>
      {isExpanded && (
        <View style={styles.extraInfo}>
          {student.nombre_mama && (
            <ContactRow name={student.nombre_mama} phone={student.tel_mama} />
          )}

          {student.nombre_papa && (
            <ContactRow name={student.nombre_papa} phone={student.tel_papa} />
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
 itemContainer: {
   backgroundColor: '#fff',
   marginHorizontal: 8,
   marginVertical: 2,
   paddingLeft: 10,
   paddingRight: 10,
   paddingTop:6,
   paddingBottom:6,
   borderRadius: 10,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 2, // para Android
 },
 name: {
  fontFamily:'OpenSans-Regular',
  color: COLORS.darkLetter,
  fontSize: 18,
  },
  dni: {
    fontFamily:'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  extraInfo: {
    marginTop: 10,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
 
  button: {
   backgroundColor: COLORS.headerDate,
   paddingHorizontal: 18,
   paddingVertical: 6,
   borderRadius: 8,
 },
  buttonText: {
    color: COLORS.whiteLetter,
    fontSize: 15,
  },
  headerRow: {
   flexDirection: 'row',
   justifyContent: 'flex-start',
   alignItems: 'center',
   marginBottom: 4,
 },

 subRow: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },

 topRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 0,
 },

 leftColumn: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
 },
 rightColumn: {
  justifyContent: 'center',
  alignItems: 'flex-end',
 },
 
 

})
