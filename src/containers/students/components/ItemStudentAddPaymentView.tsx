import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { Student } from '../services/studentService'
import { COLORS } from 'core/constants'
import { InitialAvatar } from '../../../core/components/InitialAvatar'
import { ContactRow } from '../../../core/components/ContactRow'

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
        <InitialAvatar letra={student.nombre.charAt(0)} category={student.sub_category} />

        {/* Nombre y DNI */}
        <View style={styles.leftColumn}>
          <Text style={styles.name} onPress={onToggleExpand}>
            {student.nombre} {student.apellido}
          </Text>
          <Text style={styles.dni}>{student.dni}</Text>
        </View>

        {/* Botón cargar pago */}
        {onCargarPago && (
          <View style={styles.rightColumn}>
            <Pressable
              style={styles.button}
              onPress={() => onCargarPago(student.id)}
            >
              <Text style={styles.buttonText}>cargar{'\n'}pago</Text>
            </Pressable>
          </View>
        )}
      </View>

      {isExpanded && (
        <View style={styles.extraInfo}>
          {/* Contactos del alumno */}
          {student.tel_adulto && (
            <ContactRow name={student.nombre} phone={student.tel_adulto} />
          )}
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
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  name: {
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
    fontSize: 16,
  },
  dni: {
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.headerDate,
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.whiteLetter,
    fontFamily: 'OpenSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },
  extraInfo: {
    marginTop: 10,
    paddingLeft: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
})
