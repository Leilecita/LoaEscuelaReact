import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@core';

type Props = {
  date: string | Date;
};

export const DateHeader: React.FC<Props> = ({ date }) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const weekday = capitalize(dateObj.toLocaleDateString('es-AR', { weekday: 'short' }));
  const day = dateObj.toLocaleDateString('es-AR', { day: 'numeric' });
  const month = capitalize(dateObj.toLocaleDateString('es-AR', { month: 'long' }));
  const year = dateObj.toLocaleDateString('es-AR', { year: 'numeric' });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {weekday} {day}{' '}
        <Text style={styles.monthText}>{month}</Text> {year}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.chipGreenColor,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: COLORS.darkLetter2,
  },
  monthText: {
   fontFamily: 'OpenSans-Light', 
    color: COLORS.buttonClearLetter,
  },
});
