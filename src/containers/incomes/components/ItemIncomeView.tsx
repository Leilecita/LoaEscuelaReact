import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateHeader } from '../../../core/components/DateHeader';
import { RootStackParamList } from 'types';
import { COLORS } from '@core';
import { Icon } from 'react-native-paper';
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AuthContext } from '../../../contexts/AuthContext';
import { FONT_SIZES } from 'core/constants/fonts';

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
  student_id: number;
  showDateHeader?: boolean;
  fromPayments?: boolean;
  onSend?: (id: number, class_course_id: number) => void;

  
  // 👇 callback para abrir modal de edición
  onEdit?: (income: {
    income_id: number;
    class_course_id: number;
    amount: number;
    course_amount: number;
    payment_method: string;
    payment_place: string;
    category: string;
    sub_category: string;
    detail: string;
    description: string;
  }) => void;
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
  sub_category,
  showDateHeader = false,
  fromPayments = false, 
  onEdit,
  onSend,
}: ItemIncomeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [firstName, ...rest] = description.split(' ');
  const lastName = rest.join(' ');
  const navigation = useNavigation<NavigationProp>();
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';

  return (
    <View>
      <View style={styles.date}>
      {showDateHeader && <DateHeader date={income_created}  />}
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
            category,
            sub_category,
            description
          });
        }}
        delayLongPress={400}  // medio segundito
      >
       <View style={styles.left}>
          {fromPayments ? (
            <>
              <Text style={styles.day}>
                {format(new Date(income_created), 'd', { locale: es })} {/* día */}
              </Text>
              <Text style={styles.month}>
                {format(new Date(income_created), 'MMM', { locale: es })} {/* mes */}
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
          <Text style={styles.concept}>{detail}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {category === 'escuela' && (
              <Icon
                source="human"
                color={COLORS.darkLetter3}
                size={16}
              />
            )}
            {category === 'colonia' && (
              <Icon
                source="baby-face-outline"
                color={COLORS.darkLetter3}
                size={16}
              />
            )}
            {category === 'highschool' && (
              <Icon
                source="school"
                color={COLORS.darkLetter3}
                size={16}
              />
            )}

            {/* Subcategory al lado del ícono */}
            <Text style={styles.location}>{sub_category}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.amount}>
            ${amount.toLocaleString('es-AR')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 6 }}>
            {/* ícono de método de pago */}
            {(payment_method === 'transferencia') && (
              <View style={{ marginRight: 8, marginTop:2 }}>
                <Icon
                  source="credit-card-outline"
                  color={COLORS.darkLetter3}
                  size={16}
                />
              </View>
            )}
            {(payment_method === 'mp') && (
              <View style={{ marginRight: 8, marginTop:2 }}>
                <Icon
                  source="cellphone"
                  color={COLORS.darkLetter3}
                  size={15}
                />
              </View>
            )}

            {/* ícono de lugar de pago */}
            {(payment_place === 'escuela' || payment_place === 'negocio') && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  source={payment_place === 'escuela' ? 'beach' : 'store'}
                  color={COLORS.darkLetter3}
                  
                  size={16}
                />
                <Text style={ styles.location }>
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
          onPress={() => onSend?.(income_id, class_course_id)}
        >
          <View style={{ flexDirection: 'row'}}>
           
            <Text style={[styles.pdfText, { marginLeft: 2 }]}>
              descargar recibo
            </Text>
          </View>
        </TouchableOpacity>


        {/* + info alineado a la derecha */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('InformationStudent', {
              studentId: student_id,
              firstName,
              lastName,
              category,
              sub_category
            })
          }
        >
          <Text style={styles.moreText}>+ info</Text>
        </TouchableOpacity>
    </View>
  </View>
)}

    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    borderBottomWidth: 0.3, 
    marginLeft: 10,
    marginRight: 12,
    marginBottom : 6,
    borderColor: COLORS.darkLetter3, 
  },
  date: {
    marginLeft: 10,
    borderColor: COLORS.darkLetter3, 
    marginBottom: -5,
    marginTop : 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  left: { flex: 2, marginBottom: 8 },
  center: { flex: 2, marginBottom: 8 },
  right: { flex: 2, alignItems: 'flex-end', marginBottom: 8 },
  name: {
    //fontSize: 16,
    fontSize: FONT_SIZES.name,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  lastName: {
    fontSize: FONT_SIZES.name,
   // fontSize: 15,
    marginTop: 6, 
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter3,
  },
  concept: {
    fontSize: FONT_SIZES.name,
    //fontSize: 16,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  location: {
    fontSize: FONT_SIZES.name,
   // fontSize: 16,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter3,
    marginLeft: 6, 
  },
  amount: {
    fontSize: FONT_SIZES.name,
   // fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  extraInfo: {
    borderTopColor: '#ddd',
    paddingVertical: 4,
  },
  day: {
    width:50,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
   },

   month: {
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
   },
   button: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
    fontFamily: 'OpenSans-Light',
    fontSize: FONT_SIZES.name,
    color: COLORS.buttonClearLetter,
    textDecorationLine: 'none',
    textAlign: 'left',
    marginLeft: -15,
  },
  
});
