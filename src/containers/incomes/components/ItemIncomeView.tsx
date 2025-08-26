import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateHeader } from '../../../core/components/DateHeader';
import { RootStackParamList } from 'types';
import { COLORS } from '@core';
import { Icon } from 'react-native-paper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'InformationStudent'>;
type ItemIncomeProps = {
  income_created: string;
  description: string;
  payment_method: string;
  payment_place: string;
  category: string;
  detail: string;
  amount: number;
  income_id: number;
  student_id: number;
  showDateHeader?: boolean;
};

export default function ItemIncomeView({
  income_created,
  description,
  student_id,
  payment_place,
  category,
  detail,
  amount,
  showDateHeader = false,
}: ItemIncomeProps) {
  const [isExpanded, setIsExpanded] = useState(false); // 👈 estado local
  const [firstName, ...rest] = description.split(' ');
  const lastName = rest.join(' ');
  const navigation = useNavigation<NavigationProp>();

  console.log("👉 paymentplace recibido", payment_place);

  return (
    
    <View style={styles.container}>
       
      {showDateHeader && <DateHeader date={income_created} />}

      <TouchableOpacity
        style={styles.row}
        onPress={() => setIsExpanded(prev => !prev)} // 👈 toggle
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
          <Text style={styles.amount}>${amount.toLocaleString('es-AR')}</Text>
          
          {/* Badge mini solo con ícono */}
          {(payment_place === "escuela" || payment_place === "negocio") && (
          <View style={styles.badge}>
            <Icon
              source={payment_place === "escuela" ? "beach" : "store"}
              color={COLORS.darkLetter}
              size={16}
            />
          </View>
        )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.extraInfo}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('InformationStudent', {
                studentId: student_id,
                firstName: firstName,
                lastName: lastName,
                category: category,
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
  container: { paddingHorizontal: 12, borderBottomWidth: 0.5,
    borderColor: '#ccc', },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  left: { flex: 2 },
  center: { flex: 2 },
  right: { flex: 2, alignItems: 'flex-end' },
  name: { fontSize: 16, fontFamily: 'OpenSans-Regular', color: COLORS.darkLetter },
  lastName: { fontSize: 16, fontFamily: 'OpenSans-Light', color: COLORS.darkLetter },
  concept: { fontSize: 16, fontFamily: 'OpenSans-Regular', color: COLORS.darkLetter },
  location: { fontSize: 16, fontFamily: 'OpenSans-Light', color: COLORS.darkLetter3 },
  amount: { fontSize: 16, fontFamily: 'OpenSans-Light', color: COLORS.darkLetter },
  extraInfo: {
    paddingLeft: 10,
    borderTopColor: '#ddd',
    paddingTop: 4,
  },
  masInfoText: {
    marginBottom: 8,
    fontFamily: 'OpenSans-Light',
    fontSize: 18,
    marginRight: 4,
    color: COLORS.darkLetter3,
    textAlign: 'right',

  },
  badge: {
   /* marginLeft: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',*/
  },
  
  
});
