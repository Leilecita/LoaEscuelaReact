import React, { useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import type { ReportStudent } from '../services/studentService';
import { ContactRow } from '../../../core/components/ContactRow';
import { InformationRow } from '../../../core/components/InformationRow';
import { InitialAvatar } from '../../../core/components/InitialAvatar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'types';
import { COLORS } from 'core/constants';
import { FONT_SIZES } from 'core/constants/fonts';
import { AuthContext } from '../../../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'InformationStudent'>;

type Props = {
  student: ReportStudent;
  isExpanded: boolean;
  onToggleExpand: () => void;
  togglePresente: (student: ReportStudent) => void;
  eliminarPresente: (student: ReportStudent) => void;
  selectedDate: Date;
  onLongPress?: () => void;
};

const ItemStudentAssistViewComponent: React.FC<Props> = ({
  student,
  isExpanded,
  onToggleExpand,
  togglePresente,
  eliminarPresente,
  selectedDate,
  onLongPress,
}) => {
  console.log(`🔹 Renderizando student: ${student.nombre} ${student.apellido}`);

  const navigation = useNavigation<NavigationProp>();
  const { userRole } = useContext(AuthContext);

  const totalClasesTomadas = student.taken_classes?.[0]?.cant_presents || 0;
  const isToday = useMemo(() => selectedDate.toDateString() === new Date().toDateString(), [selectedDate]);
  const isAdmin = userRole === 'admin';
  const isEnabled = isAdmin || isToday;

  return (
    <View style={styles.itemContainer_check}>
      <Pressable
        style={styles.row}
        onPress={onToggleExpand}
        onLongPress={onLongPress}
        delayLongPress={400}
      >
        <InitialAvatar letra={student.nombre.charAt(0)} category={student.sub_category} />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {student.nombre} {student.apellido}
          </Text>
          <Text style={styles.dni}>{student.dni}</Text>
          {student.student_observation?.trim() !== '' && (
            <Text style={[styles.dni, { color: COLORS.darkLetter3, marginTop: 2 }]}>
              {student.student_observation}
            </Text>
          )}
        </View>

        <Text style={{ marginRight: 8, color: '#666', fontSize: 12 }}>
          {totalClasesTomadas}
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (!isEnabled) return;
            student.presente === 'si'
              ? eliminarPresente(student)
              : togglePresente(student);
          }}
          style={[
            styles.checkbox,
            student.presente === 'si' && styles.checked,
            {
              borderColor: !isToday ? 'gray' : COLORS.button,
              backgroundColor: student.presente === 'si' ? COLORS.button : 'transparent',
            },
          ]}
          disabled={!isEnabled}
        >
          {student.presente === 'si' && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>
      </Pressable>

      {isExpanded && (
        <View style={styles.extraInfo}>
          <View style={styles.infoSection}>
            <InformationRow
              texto="clases tomadas"
              numero={`${student.taken_classes[0].cant_presents ?? 0} de ${student.taken_classes[0].cant_buyed_classes ?? 0}`}
            />
            <InformationRow
              texto="deuda"
              numero={`$ ${(student.taken_classes[0].tot_amount ?? 0) - (student.taken_classes[0].tot_paid_amount ?? 0)}`}
            />
          </View>

          <View style={styles.separator} />

          {student.tel_adulto && <ContactRow name={student.nombre} phone={student.tel_adulto} />}
          {student.nombre_mama && <ContactRow name={student.nombre_mama} phone={student.tel_mama} />}
          {student.nombre_papa && <ContactRow name={student.nombre_papa} phone={student.tel_papa} />}

          {isAdmin && (
            <Pressable
              onPress={() =>
                navigation.navigate('InformationStudent', {
                  studentId: student.student_id,
                  firstName: student.nombre,
                  lastName: student.apellido,
                  category: student.category,
                  sub_category: student.sub_category,
                })
              }
              style={{
                alignSelf: 'flex-end',
                backgroundColor: COLORS.transparentGreenColor,
                borderRadius: 6,
                marginTop: 8,
                marginBottom: 4,
                paddingVertical: 4,
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              android_ripple={{ color: '#ccc' }}
              pointerEvents="box-none"
            >
              <Text style={styles.masInfoText}>+ info</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

// ✅ React.memo para evitar renders innecesarios
export const ItemStudentAssistView = React.memo(ItemStudentAssistViewComponent, (prev, next) => {
  return (
    prev.student.presente === next.student.presente &&
    prev.isExpanded === next.isExpanded &&
    prev.student.taken_classes?.[0]?.cant_presents === next.student.taken_classes?.[0]?.cant_presents
  );
});

const styles = StyleSheet.create({
  itemContainer_check: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 2,
    paddingLeft: 10,
    paddingRight: 16,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
   // fontSize: 16,
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
  infoSection: {
    marginBottom: 8,
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
    textDecorationLine: 'none',
    textAlign: 'right',
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  checked: {},
});
/*
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
  onLongPress?: () => void;
}

export const ItemStudentAssistView: React.FC<Props> = ({
  student,
  isExpanded,
  onToggleExpand,
  togglePresente,
  eliminarPresente,
  selectedDate,
  onLongPress,
  
}) => {
  console.log(`🔹 Renderizando student: ${student.nombre} ${student.apellido}`)
  const navigation = useNavigation<NavigationProp>()
  const { userRole } = useContext(AuthContext);
  const totalClasesTomadas = student.taken_classes?.[0]?.cant_presents || 0
  const isToday = selectedDate.toDateString() === new Date().toDateString()
  const isAdmin = userRole === 'admin';

  const isEnabled = isAdmin || isToday;

  //console.log(isAdmin)

    return (
      
    <View style={styles.itemContainer_check}>
      <Pressable style={styles.row} onPress={onToggleExpand}
        onLongPress={onLongPress}
        delayLongPress={400}>
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
           
           {isAdmin && (
              <Pressable
                  onPress={() =>
                    navigation.navigate('InformationStudent', {
                      studentId: student.student_id,
                      firstName: student.nombre,
                      lastName: student.apellido,
                      category: student.category,
                      sub_category: student.sub_category,
                    })
                  }
                  style={{
                    alignSelf: 'flex-end',
                    backgroundColor: COLORS.transparentGreenColor,
                    borderRadius: 6,
                    marginTop: 8,
                    marginBottom: 4,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  android_ripple={{ color: '#ccc' }}
                  pointerEvents="box-none"
                >
                  <Text style={styles.masInfoText}>+ info</Text>
                </Pressable>
            
            )}

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
    paddingTop:6,
    paddingBottom:6,
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
    fontSize: 16,
  },
  dni: {
    fontFamily:'OpenSans-Light',
    color: COLORS.darkLetter,
    fontSize: 15,
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


*/