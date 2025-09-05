import { COLORS } from '@core';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DateHeader } from '../../../core/components/DateHeader'; 

type ItemIncomeProps = {
  income_created: string; 
  description: string;    
  payment_method: string; 
  category: string;       
  detail: string;         
  amount: number;         
  income_id: number;      
  showDateHeader?: boolean;
};

export default function ItemIncomeStudentView({
  income_created,
  description,
  payment_method,
  category,
  detail,
  amount,
  showDateHeader = false,
}: ItemIncomeProps) {
  const [firstName, ...rest] = description.split(' ');
  const lastName = rest.join(' ');
  const [date, ...restw] = income_created.split(' ');
  
  return (
    <View style={styles.container}>

      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.name}>{date}</Text>
          
        </View>
        <View style={styles.center}>
          <Text style={styles.concept}>{payment_method}</Text>
          <Text style={styles.lastName}>{detail}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>${amount.toLocaleString('es-AR')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12, // margen izquierdo y derecho para todo
  },
  dateHeader: {
    backgroundColor:  COLORS.chipGreenColor,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 6,
  },
  dateText: {
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  left: {
    flex: 2,
  },
  center: {
    flex: 2,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
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
});
