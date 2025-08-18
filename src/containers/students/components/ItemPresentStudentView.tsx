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
        <View style={styles.dateContainer}>
          <PaperText style={styles.day}>{day}</PaperText>
          <PaperText style={styles.number}>{number}</PaperText>
        </View>
        <PaperText style={styles.info}>
          {month.charAt(0).toUpperCase() + month.slice(1)} - {item.planilla}
        </PaperText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  yearHeader: {
    backgroundColor: '#f8bbd0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  yearText: {
    fontWeight: 'bold',
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f2f863', // amarillo similar a la foto
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  dateContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  day: {
    fontWeight: 'bold',
  },
  number: {
    fontSize: 14,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
});
