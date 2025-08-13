import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { Student } from '../services/studentService'
import { COLORS } from 'core/constants'
import { InitialAvatar } from '../../../core/components/InitialAvatar'
import { ContactRow } from '../../../core/components/ContactRow'
import { InformationRow } from '../../../core/components/InformationRow'

type Props = {
  student: Student
  isExpanded: boolean
  onToggleExpand?: () => void
  onCargarPago?: (studentId: number) => void
}

export const ItemStudentAddPaymentView: React.FC<Props> = ({
  student,
  isExpanded,
  onToggleExpand,
  onCargarPago,
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
            onPress={() => onCargarPago?.(student.id)}
          >
            <Text style={styles.buttonText}>cargar{'\n'}pago</Text>
          </Pressable>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.extraInfo}>
          {/* Información del alumno */}
          <View style={styles.infoSection}>
          </View>

          

          {/* Contactos */}
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
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
    fontSize: 18,
  },
  dni: {
    fontFamily: 'OpenSans-Light',
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
    backgroundColor: COLORS.buttonClear,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.buttonClearLetter,
    fontSize: 15,
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
  infoSection: {
   marginBottom: 8,
 },
 separator: {
   height: 1,
   backgroundColor: '#ccc',
   marginVertical: 8,
 },
})
