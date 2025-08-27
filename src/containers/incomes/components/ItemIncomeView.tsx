import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateHeader } from '../../../core/components/DateHeader';
import { RootStackParamList } from 'types';
import { COLORS } from '@core';
import { Icon } from 'react-native-paper';

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

export default function ItemIncomeView({
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
  onEdit,
}: ItemIncomeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [firstName, ...rest] = description.split(' ');
  const lastName = rest.join(' ');
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {showDateHeader && <DateHeader date={income_created} />}

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
          <Text style={styles.name}>{firstName}</Text>
          <Text style={styles.lastName}>{lastName}</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.concept}>{detail}</Text>
          <Text style={styles.location}>{category}</Text>
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
                  color={COLORS.darkLetter}
                  size={16}
                />
              </View>
            )}

            {/* ícono de lugar de pago */}
            {(payment_place === 'escuela' || payment_place === 'negocio') && (
              <Icon
                source={payment_place === 'escuela' ? 'beach' : 'store'}
                color={COLORS.darkLetter}
                size={16}
              />
            )}
          </View>


         {/* {(payment_place === 'escuela' || payment_place === 'negocio') && (
            <View style={styles.badge}>
              <Icon
                source={payment_place === 'escuela' ? 'beach' : 'store'}
                color={COLORS.darkLetter}
                size={16}
              />
            </View>
          )}*/}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.extraInfo}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('InformationStudent', {
                studentId: student_id,
                firstName,
                lastName,
                category,
              })
            }
          >
            <Text style={styles.masInfoText}>+ info</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  left: { flex: 2 },
  center: { flex: 2 },
  right: { flex: 2, alignItems: 'flex-end' },
  name: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
  },
  lastName: {
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
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
  },
  amount: {
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
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
});
