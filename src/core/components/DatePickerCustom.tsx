import React, { useState } from 'react';
import { Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

type Props = {
  date: Date;
  onDateChange: (date: Date) => void;
};

export const CustomDatePicker: React.FC<Props> = ({ date, onDateChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const openPicker = () => setShowPicker(true);

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <>
      <Chip
        icon="calendar"
        onPress={openPicker}
        style={{ marginRight: 8, marginBottom: 8, backgroundColor: '#ede7f6' }}
        textStyle={{ color: '#333' }}
      >
        {format(date, 'dd/MM/yyyy')}
      </Chip>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          locale="es-AR"
        />
      )}
    </>
  );
};
