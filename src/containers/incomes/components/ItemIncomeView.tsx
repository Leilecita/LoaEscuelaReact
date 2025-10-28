import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateHeader } from '../../../core/components/DateHeader';
import { RootStackParamList } from 'types';
import { COLORS } from '@core';
import { Icon } from 'react-native-paper';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AuthContext } from '../../../contexts/AuthContext';
import { FONT_SIZES } from 'core/constants/fonts';
import TextTicker from 'react-native-text-ticker';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'InformationStudent'
>;

type ItemIncomeProps = {
  income_created: string;
  description: string;
  payment_method: string;
  payment_place: string;
  category: string;
  sub_category: string;
  detail: string;
  amount: number;
  course_amount: number;
  income_id: number;
  class_course_id: number;
  income_class_course_id: number;
  student_id: number;
  showDateHeader?: boolean;
  fromPayments?: boolean;
  onSend?: (id: number, class_course_id: number, detail: string) => void;
  onEdit?: (income: any) => void;
};

export default function ItemIncomeView({
  income_created,
  description,
  student_id,
  payment_place,
  category,
  detail,
  amount,
  course_amount,
  income_id,
  payment_method,
  class_course_id,
  income_class_course_id,
  sub_category,
  showDateHeader = false,
  fromPayments = false,
  onEdit,
  onSend,
}: ItemIncomeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customDetail, setCustomDetail] = useState(detail || ''); // 👈 inicia con el detalle original

  const [firstName, ...rest] = description.split(' ');
  const lastName = rest.join(' ');
  const navigation = useNavigation<NavigationProp>();
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';

  return (
    <View>
      <View style={styles.date}>
        {showDateHeader && <DateHeader date={income_created} />}
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setIsExpanded(prev => !prev)}
          onLongPress={() => {
            if (!isAdmin) {
              Alert.alert('Acceso restringido', 'Solo los administradores pueden acceder aquí');
              return;
            }

            onEdit?.({
              income_id,
              amount,
              course_amount,
              payment_method,
              payment_place,
              detail,
              class_course_id,
              income_class_course_id,
              category,
              sub_category,
              description,
            });
          }}
          delayLongPress={400}
        >
          <View style={styles.left}>
            {fromPayments ? (
              <>
                <Text style={styles.day}>
                  {format(new Date(income_created), 'd', { locale: es })}
                </Text>
                <Text style={styles.month}>
                  {format(new Date(income_created), 'MMM', { locale: es })}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.name}>{firstName}</Text>
                <Text style={styles.lastName}>{lastName}</Text>
              </>
            )}
          </View>

          <View style={styles.center}>
            <TextTicker
              style={styles.concept}
              duration={6000}
              loop
              bounce={false}
              repeatSpacer={100}
              marqueeDelay={1000}
              scrollSpeed={50}
            >
              {customDetail || detail}
            </TextTicker>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              {category === 'escuela' && <Icon source="human" color={COLORS.darkLetter3} size={16} />}
              {category === 'colonia' && <Icon source="baby-face-outline" color={COLORS.darkLetter3} size={16} />}
              {category === 'highschool' && <Icon source="school" color={COLORS.darkLetter3} size={16} />}

              <Text style={styles.location}>{sub_category}</Text>
            </View>
          </View>

          <View style={styles.right}>
            <Text style={styles.amount}>${amount.toLocaleString('es-AR')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 6 }}>
              {payment_method === 'transferencia' && (
                <View style={{ marginRight: 8, marginTop: 2 }}>
                  <Icon source="credit-card-outline" color={COLORS.darkLetter3} size={16} />
                </View>
              )}
              {payment_method === 'mp' && (
                <View style={{ marginRight: 8, marginTop: 2 }}>
                  <Icon source="cellphone" color={COLORS.darkLetter3} size={15} />
                </View>
              )}
              {(payment_place === 'escuela' || payment_place === 'negocio') && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    source={payment_place === 'escuela' ? 'beach' : 'store'}
                    color={COLORS.darkLetter3}
                    size={16}
                  />
                  <Text style={styles.location}>
                    {payment_place === 'escuela' ? 'playa' : 'negocio'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.extraInfo}>
            <View style={styles.moreInfoRow}>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Icon
                source="download"       // ícono de descarga de react-native-paper
                color={COLORS.buttonClearLetter}
                size={18}
              />
              <Text style={styles.pdfText}>PDF</Text>
            </TouchableOpacity>


              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('InformationStudent', {
                    studentId: student_id,
                    firstName,
                    lastName,
                    category,
                    sub_category,
                  })
                }
              >
                <Text style={styles.moreText}>+ info</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* MODAL para modificar detalle antes de enviar */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar detalle del recibo</Text>

            <TextInput
              style={styles.input}
              placeholder="Ingrese un detalle para el recibo"
              value={customDetail}
              onChangeText={setCustomDetail}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: COLORS.button }]}
                onPress={() => {
                  setShowModal(false);
                  onSend?.(income_id, class_course_id, customDetail.trim() || detail);
                }}
              >
                <Text style={styles.modalButtonText}>Descargar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: COLORS.buttonClearLetter }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    borderBottomWidth: 0.3,
    marginLeft: 10,
    marginRight: 12,
    marginBottom: 6,
    borderColor: COLORS.darkLetter3,
  },
  date: {
    marginLeft: 10,
    borderColor: COLORS.darkLetter3,
    marginBottom: -5,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  left: { flex: 2, marginBottom: 8 },
  center: { flex: 2, marginBottom: 8 },
  right: { flex: 1.8, alignItems: 'flex-end', marginBottom: 8 },
  name: {
    fontSize: FONT_SIZES.name,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  lastName: {
    fontSize: FONT_SIZES.dni,
    marginTop: 6,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter3,
  },
  concept: {
    fontSize: FONT_SIZES.name,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  location: {
    fontSize: FONT_SIZES.dni,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter3,
    marginLeft: 6,
  },
  amount: {
    fontSize: FONT_SIZES.name,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  extraInfo: {
    borderTopColor: '#ddd',
    paddingVertical: 4,
  },
  day: {
    width: 50,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  month: {
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  moreInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  moreText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: FONT_SIZES.name,
    color: COLORS.darkLetter3,
  },
  pdfText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: FONT_SIZES.dni,
    marginLeft:4 ,
    color: COLORS.buttonClearLetter,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: FONT_SIZES.name,
    color: COLORS.darkLetter,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.darkLetter3,
    borderRadius: 6,
    padding: 8,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  modalButtonText: {
    fontFamily: 'OpenSans-Regular',
    color: '#fff',
  },
});
