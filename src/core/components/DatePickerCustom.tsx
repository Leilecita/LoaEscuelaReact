import React, { useState } from 'react';
import { Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { COLORS } from 'core/constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        icon={() => (
          <MaterialCommunityIcons
              name={
               'calendar'
              }
              size={20}
              color={COLORS.darkLetter} 
            />
          )}
        onPress={openPicker}
        style={{ marginRight: 8, marginBottom: 8, backgroundColor: COLORS.chipGreenColor }}
        textStyle={{ color: COLORS.darkLetter,  fontFamily: 'OpenSans-Light', fontSize: 16 }}
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
