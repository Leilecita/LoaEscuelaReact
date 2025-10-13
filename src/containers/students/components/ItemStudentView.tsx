import React, { useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity , Pressable} from 'react-native'
import type { Student } from '../services/studentService'
import { ContactRow } from '../../../core/components/ContactRow'
import { InitialAvatar } from '../../../core/components/InitialAvatar'
import { COLORS } from 'core/constants'
import { FONT_SIZES } from 'core/constants/fonts'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'types'
import { AuthContext } from '../../../contexts/AuthContext';

// 👈 Navigation tipado hacia InformationStudent
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'InformationStudent'>

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
  const navigation = useNavigation<NavigationProp>()
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';

  return (
    <View style={styles.itemContainer}>
       <Pressable style={styles.topRow} onPress={onToggleExpand}>
        <InitialAvatar letra={student.nombre.charAt(0)} category={student.sub_category}  />
        <View style={styles.leftColumn}>
          <Text style={styles.name} >
            {student.nombre} {student.apellido}
          </Text>
          <Text style={styles.dni}>{student.dni}</Text>
          {student.observation?.trim() !== '' && (
            <Text style={styles.dni}>{student.observation}</Text>
          )}
        </View>
      
        </Pressable>
      {isExpanded && (
        <View style={styles.extraInfo}>
          {student.tel_adulto && (
            <ContactRow name={student.nombre} phone={student.tel_adulto} />
          )}
          {student.nombre_mama && (
            <ContactRow name={student.nombre_mama} phone={student.tel_mama} />
          )}
          {student.nombre_papa && (
            <ContactRow name={student.nombre_papa} phone={student.tel_papa} />
          )}


          {isAdmin && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('InformationStudent', {  studentId: student.id,
                  firstName: student.nombre,   
                  lastName: student.apellido,
                  category: student.category,
                  sub_category: student.sub_category,  })
              }
            >
              <Text style={styles.masInfoText}>+ info</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  },
  name: {
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
    //fontSize: 16,
    fontSize: FONT_SIZES.name
  },
  dni: {
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
    //fontSize: 15,
    fontSize: FONT_SIZES.dni
  },
  extraInfo: {
    marginTop: 10,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
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
})
