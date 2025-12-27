import { COLORS } from '@core';
import React, {  useState } from 'react';

import { View, StyleSheet, Alert } from 'react-native';
import { Text as PaperText } from 'react-native-paper';
import { Pressable } from 'react-native'
import { Modal, Portal, TextInput, Button } from 'react-native-paper'
import { updatePresentObservacion } from '../services/studentService'


type ItemPresentViewProps = {
  item: {
    id: number;
    planilla: string;
    fecha_presente?: string | number; // 👈 CLAVE
    class_name?: string;
    observacion?: string;
  };
  index: number;
  previousItem?: { fecha_presente?: string | number };

};

export const ItemPresentStudentView: React.FC<ItemPresentViewProps> = ({
  item,
  index,
  previousItem,
}) => {
  if (!item.fecha_presente) return null;

  const parseLocalDate = (dateValue: string | number) => {
    if (typeof dateValue === 'number') {
      return new Date(dateValue)
    }
  
    // "2025-03-26" → fecha LOCAL
    const [year, month, day] = dateValue.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const date = parseLocalDate(item.fecha_presente)
  const day = date.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase();
  const number = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('es-AR', { month: 'long' });
  const year = date.getFullYear();

  const showYearHeader =
    !previousItem ||
    !previousItem.fecha_presente ||
    new Date(previousItem.fecha_presente).getFullYear() !== year;

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [observacion, setObservacion] = useState('')


  const openEditModal = (item: any) => {
    setSelectedItem(item)
    setObservacion(item.observacion || '')
    setModalVisible(true)
  }
  
  const handleSave = async () => {

    if (!selectedItem?.id) return
  
    try {
     
      const ok = await updatePresentObservacion( selectedItem.id, observacion)

      if (ok) {
        setModalVisible(false)
      }
  
      // si después querés:
      // refrescar lista o actualizar estado local
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la observación')
    }
  }
  
  return (
    <View>
       <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          {/* HEADER */}
          <View style={styles.modalHeader}>
            <PaperText style={styles.modalDay}>
              {day} {number} · {month.charAt(0).toUpperCase() + month.slice(1)} · {item.planilla}
            </PaperText>
          </View>

          {/* TAG RAPIDA */}
          <Pressable
            style={styles.quickTag}
            onPress={() => setObservacion('regalo')}
          >
            <PaperText style={styles.quickTagText}>regalo</PaperText>
          </Pressable>

          {/* INPUT */}
          <TextInput
            value={observacion}
            onChangeText={setObservacion}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Agregar observación..."
          />

          {/* BOTONES */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button onPress={() => setModalVisible(false)}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleSave}>
              Guardar
            </Button>
          </View>
        </Modal>
      </Portal>

      {showYearHeader && (
        <View style={styles.yearHeader}>
          <PaperText style={styles.yearText}>{year}</PaperText>
        </View>
      )}

      <Pressable
        style={styles.row}
        onLongPress={() => openEditModal(item)}
        delayLongPress={300}
      >
        {/* Día y número a la izquierda */}
          <PaperText style={styles.day}>{day}</PaperText>
          <PaperText style={styles.number}>{number}</PaperText>
          <View style={styles.observacionRow}>
            {item.observacion && item.observacion.trim() !== '' && (
                <PaperText style={styles.observacionText}>
                  {item.observacion}
                </PaperText>
            )}
          </View>

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
       
      </Pressable>
      

     
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
    fontSize: 15,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  monthContainer: {
    flex: 1,
    alignItems: 'center', // 👈 centrado horizontal
  },
  month: {
   fontFamily: 'OpenSans-Regular',
   fontSize: 15,
   color: COLORS.darkLetter,
  },
  categoryContainer: {
    minWidth: 100,
    fontSize: 15,
    alignItems: 'flex-end',

  },
  category: {
    fontFamily: 'OpenSans-Regular',
    color: COLORS.darkLetter,
    fontSize: 15,
    marginRight: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 16,
    margin: 24,
    borderRadius: 8,
  },
  modalHeader: {
    marginBottom: 12,
  },
  
  modalDay: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: COLORS.darkLetter,
  },
  
  modalClass: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.ligthLetter,
  },
  quickTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.buttonClear,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  
  quickTagText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: COLORS.buttonClearLetter,
  },
  observacionRow: {
    marginLeft: 20, // alinea con el texto (después del día y número)
    marginRight: 6,
  },
  
  observacionText: {
    fontFamily: 'OpenSans-Light',
    fontSize: 13,
    color: COLORS.darkLetter,
  },
  
  
  
});
