import React, { useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from 'react-native-paper';

export const FechaSelector = ({ onFechaConfirmada }: { onFechaConfirmada: (date: Date) => void }) => {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    setMostrarPicker(Platform.OS === 'ios'); // En Android se cierra automáticamente
    if (selectedDate) {
      setFecha(selectedDate);
      onFechaConfirmada(selectedDate);
    }
  };

  return (
    <View>
      <Button title="Seleccionar fecha" onPress={() => setMostrarPicker(true)} />
      <Text style={{ marginTop: 10 }}>
        Fecha seleccionada: {fecha.toLocaleDateString('es-AR')}
      </Text>
      {mostrarPicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          locale="es-AR"
        />
      )}
    </View>
  );
};
