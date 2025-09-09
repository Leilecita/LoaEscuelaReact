import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateHeader } from '../../../core/components/DateHeader';
import { RootStackParamList } from 'types';
import { COLORS } from '@core';
import { Icon } from 'react-native-paper';
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
  income_id: number;
  class_course_id: number;
  student_id: number;
  showDateHeader?: boolean;
  fromPayments?: boolean;

  
  // 👇 callback para abrir modal de edición
  onEdit?: (income: {
    income_id: number;
    class_course_id: number;
    amount: number;
    payment_method: string;
    payment_place: string;
    category: string;
    sub_category: string;
    detail: string;
  }) => void;
};

export default function ItemIncomeStudentView({
  income_created,
  description,
  student_id,
  payment_place,
  category,
  detail,
  amount,
  income_id,
  payment_method,
  class_course_id,
  sub_category,
  showDateHeader = false,
  fromPayments = false, 
  onEdit,
}: ItemIncomeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [firstName, ...rest] = description.split(' ');
  const lastName = rest.join(' ');
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.row}
        onPress={() => setIsExpanded(prev => !prev)}
        onLongPress={() =>
          
          onEdit?.({
            income_id,
            amount,
            payment_method,
            payment_place,
            detail,
            class_course_id,
            category,
            sub_category,
          })
        }
        delayLongPress={400} // medio segundito
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
            {(payment_method === 'mp' || payment_method === 'transferencia') && (
              <View style={{ marginRight: 8, marginTop:2 }}>
                <Icon
                  source="credit-card-outline"
                  color={COLORS.darkLetter3}
                  size={16}
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

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderBottomWidth: 0.3, 
    borderColor: COLORS.ligthLetter, 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  left: { flex: 1 },
  center: { flex: 3 },
  right: { flex: 2, alignItems: 'flex-end' },
  name: {
    fontSize: 17,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  lastName: {
    fontSize: 15,
    marginTop: 6, 
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter3,
  },
  concept: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  location: {
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter3,
    marginLeft: 6, 
  },
  amount: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  extraInfo: {
    paddingLeft: 10,
    borderTopColor: '#ddd',
    paddingTop: 4,
  },
  masInfoText: {
    marginBottom: 8,
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: COLORS.darkLetter3,
    textAlign: 'right',
  },
  badge: {
    // opcional: estilo de fondo del ícono
  },
  day: {
    width:20,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: COLORS.darkLetter,
   },

   month: {
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
    fontSize: 14,
    width:24,
    textAlign: 'center',
   },
});
