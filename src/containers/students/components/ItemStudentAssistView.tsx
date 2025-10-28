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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

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
  console.log(`🔹 Renderizando student: ${student.nombre} ${student.apellido} ${student.sabe_nadar} ${student.deportes}`);

  const navigation = useNavigation<NavigationProp>();
  const { userRole } = useContext(AuthContext);

  const totalClasesTomadas = student.taken_classes?.[0]?.cant_presents || 0;
  const isToday = useMemo(() => selectedDate.toDateString() === new Date().toDateString(), [selectedDate]);
  const isAdmin = userRole === 'admin';
  const isEnabled = isAdmin || isToday;

  const formatDNI = (dni: string | number) => {
    if (!dni) return '';
    const clean = dni.toString().replace(/\D/g, ''); // elimina puntos o espacios
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // agrega puntos cada 3 cifras
  };

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

          <Text style={styles.retiraTitulo}>Contacto</Text>

          {student.tel_adulto &&
            student.tel_adulto !== student.tel_mama && (
              <ContactRow name={student.nombre} phone={student.tel_adulto} />
          )}
          {student.nombre_mama && <ContactRow name={student.nombre_mama} phone={student.tel_mama} />}
          {student.nombre_papa && <ContactRow name={student.nombre_papa} phone={student.tel_papa} />}
          
      

          {student.category?.toLowerCase() === 'colonia' && (
          <View>
            <View style={styles.separator} />

            <Text style={styles.retiraTitulo}>Retira</Text>

            {[
              {
                nombre: student.autorizado1_nombre,
                dni: student.autorizado1_dni,
                parentesco: student.autorizado1_parentesco,
              },
              {
                nombre: student.autorizado2_nombre,
                dni: student.autorizado2_dni,
                parentesco: student.autorizado2_parentesco,
              },
              {
                nombre: student.autorizado3_nombre,
                dni: student.autorizado3_dni,
                parentesco: student.autorizado3_parentesco,
              },
            ]
              .filter(a => a.nombre || a.dni || a.parentesco)
              .map((a, index) => (
                <View key={index} style={styles.autorizadoRow}>
                  <Text style={[styles.autorizadoTexto, { flex: 1 }]}>{a.nombre || '-'}</Text>
                  <Text style={[styles.autorizadoTexto, { flex: 1, textAlign: 'right', paddingRight: 16 }]}>
                    {a.dni ? formatDNI(a.dni) : '-'}
                  </Text>

                  <Text style={[styles.autorizadoTexto, { flex: 1, textAlign: 'right' }]}>
                    ({a.parentesco || '-'})
                  </Text>
                </View>
              ))}

            {/* 🔹 Nueva sección con información adicional */}
            <View style={styles.separator} />

            <Text style={styles.retiraTitulo}>Información adicional</Text>
            <View style={styles.infoExtraContainer}>
              <View style={styles.infoExtraRow}>
                <Icon name="heart-pulse" size={18} color={COLORS.darkLetter3} style={styles.icon} />
                <Text style={styles.infoExtraText}>
                  <Text style={styles.infoLabel}>Problema de salud: </Text>
                  <Text style={styles.infoValue}>{student.salud?.trim() || 'No especificado'}</Text>
                </Text>
              </View>

              <View style={styles.infoExtraRow}>
                <Icon name="soccer" size={18} color={COLORS.darkLetter3} style={styles.icon} />
                <Text style={styles.infoExtraText}>
                  <Text style={styles.infoLabel}>Deportes / Gustos: </Text>
                  <Text style={styles.infoValue}>{student.deportes?.trim() || 'No especificado'}</Text>
                </Text>
              </View>

              <View style={styles.infoExtraRow}>
                <Icon name="swim" size={18} color={COLORS.darkLetter3} style={styles.icon} />
                <Text style={styles.infoExtraText}>
                  <Text style={styles.infoLabel}>Sabe nadar: </Text>
                  <Text style={styles.infoValue}>{student.sabe_nadar?.trim() || 'No especificado'}</Text>
                </Text>
              </View>
            </View>

          </View>
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
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: FONT_SIZES.paddingV,
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
   fontSize: FONT_SIZES.name
  },
  dni: {
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
    fontSize: FONT_SIZES.dni
  },
  extraInfo: {
    marginTop: 10,
    paddingLeft: 8,
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
  retiraTitulo: {
    fontFamily: 'OpenSans-Regular',
    fontSize: FONT_SIZES.dni,
    color: COLORS.darkLetter,
    marginBottom: 6,
    marginTop:10
  },
  autorizadoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    marginRight : 6
  },
  
  autorizadoTexto: {
    fontSize: FONT_SIZES.dni,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  
  autorizadoLabel: {
    color: '#000',
  },  infoExtraContainer: {
    marginTop: 6,
    marginBottom: 4,
  },
  infoExtraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  icon: {
    marginRight: 6,
  },
  infoExtraText: {
    fontSize: FONT_SIZES.dni,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
    flexShrink: 1,
  },

  
  infoLabel: {
    color: COLORS.darkLetter3,         // un poco más oscuro o más fuerte
    fontFamily: 'OpenSans-Light',  // si tenés una variante semibold
  },
  infoValue: {
    color: COLORS.darkLetter,        // tono más suave
    fontFamily: 'OpenSans-Light',
  },
  
});
