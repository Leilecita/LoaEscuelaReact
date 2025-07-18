import React from 'react'
import { View, Text, Linking, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import type { Student } from '../../containers/students/services/studentService'
import { ContactRow } from './ContactRow'
import { InitialAvatar } from './InitialAvatar'
import { COLORS } from 'core/constants'

type Props = {
  student: Student
  isExpanded: boolean
  onToggleExpand: () => void
}

export const ItemStudentView: React.FC<Props> = ({
  student,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <View style={styles.itemContainer}>
       <View style={styles.topRow}>
        <InitialAvatar letra={student.nombre.charAt(0)} />
        <View style={styles.leftColumn}>
          <Text style={styles.name} onPress={onToggleExpand}>
            {student.nombre} {student.apellido}
          </Text>
          <Text style={styles.dni}>{student.dni}</Text>
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
    paddingTop:8,
    paddingBottom:8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // para Android
  },

 leftColumn: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
   },
  name: {
    fontFamily:'OpenSans-Regular',
    color: COLORS.darkLetter,
    fontSize: 16,
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
  
})
