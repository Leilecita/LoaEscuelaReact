import { COLORS } from '@core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text as PaperText } from 'react-native-paper';

type ItemPresentViewProps = {
  item: {
    planilla: string;
    fecha_presente?: string;
    class_name?: string;
  };
  index: number;
  previousItem?: { fecha_presente?: string };
};

export const ItemPresentStudentView: React.FC<ItemPresentViewProps> = ({
  item,
  index,
  previousItem,
}) => {
  if (!item.fecha_presente) return null;

  const date = new Date(item.fecha_presente);
  const day = date.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase();
  const number = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('es-AR', { month: 'long' });
  const year = date.getFullYear();

  const showYearHeader =
    !previousItem ||
    !previousItem.fecha_presente ||
    new Date(previousItem.fecha_presente).getFullYear() !== year;

  return (
    <View>
      {showYearHeader && (
        <View style={styles.yearHeader}>
          <PaperText style={styles.yearText}>{year}</PaperText>
        </View>
      )}

      <View style={styles.row}>
        {/* Día y número a la izquierda */}
          <PaperText style={styles.day}>{day}</PaperText>
          <PaperText style={styles.number}>{number}</PaperText>

        {/* Mes centrado */}
        <View style={styles.monthContainer}>
          <PaperText style={styles.month}>
            {month.charAt(0).toUpperCase() + month.slice(1)}
          </PaperText>
        </View>

        {/* Categoría a la derecha */}
        <View style={styles.categoryContainer}>
          <PaperText style={styles.category}>{item.planilla}</PaperText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  yearHeader: {
    backgroundColor: COLORS.buttonClear,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 8,
    marginLeft:8,
    alignSelf: 'flex-start', // 👈 solo abarca el año
  },
  yearText: {
    color: COLORS.buttonClearLetter,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft : 6,
    borderBottomWidth: 0.3,
    borderColor: COLORS.ligthLetter,
    alignItems: 'center',
  },
  dateContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  day: {
   width:50,
   fontFamily: 'OpenSans-Light',
   color: COLORS.darkLetter,
  },
  number: {
    fontSize: 14,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  monthContainer: {
    flex: 1,
    
    alignItems: 'center', // 👈 centrado horizontal
  },
  month: {
   fontFamily: 'OpenSans-Regular',
   color: COLORS.darkLetter,
  },
  categoryContainer: {
    minWidth: 100,
    alignItems: 'flex-end',

  },
  category: {
    fontStyle: 'italic',
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
    marginRight: 8,
  },
});
