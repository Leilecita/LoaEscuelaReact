import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text } from 'react-native';
import { Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { COLORS } from 'core/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

type Props = {
  date: Date;
  onDateChange: (date: Date) => void;
};

export const CustomDatePicker: React.FC<Props> = ({ date, onDateChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(date);

  const openPicker = () => {
    setTempDate(date); // resetea al valor actual
    setShowPicker(true);
  };

  const handleConfirm = () => {
    onDateChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  return (
    <>
      <Chip
        icon={() => (
          <MaterialCommunityIcons
            name="calendar"
            size={19}
            color={COLORS.darkLetter}
          />
        )}
        onPress={openPicker}
        style={{
          marginRight: 8,
          marginBottom: 8,
          backgroundColor: COLORS.chipGreenColor,
        }}
        textStyle={{
          color: COLORS.darkLetter,
          fontFamily: 'OpenSans-Light',
          fontSize: 15,
        }}
      >
        {format(date, 'dd/MM/yyyy')}
      </Chip>

      {showPicker &&
        (Platform.OS === 'android' ? (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) onDateChange(selectedDate);
            }}
          />
        ) : (
          <Modal isVisible={showPicker} onBackdropPress={handleCancel}>
            <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setTempDate(selectedDate);
                }}
                locale="es-AR"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
                  onPress={handleCancel}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 6,
                    backgroundColor: '#eee',
                    marginRight: 12,
                    minWidth: 90,              // 👈 ancho mínimo
                    alignItems: 'center',      // 👈 centra el texto
                  }}
                >
                  <Text style={{ fontSize: 16, color: COLORS.darkLetter }}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirm}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 6,
                    backgroundColor: COLORS.headerDate,
                    minWidth: 90,              // 👈 ancho mínimo
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, color: COLORS.white }}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ))}
    </>
  );
};
