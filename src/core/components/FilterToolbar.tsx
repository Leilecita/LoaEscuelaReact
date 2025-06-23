import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { Chip, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomDatePicker} from './DatePickerCustom';

type Props = {
  date: Date;
  onDateChange: (date: Date) => void;
  showOnlyPresent: boolean;
  onTogglePresent: () => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  onRefresh: () => void;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  countPresentes: number;
};

export const FilterBar: React.FC<Props> = ({
  date,
  onDateChange,
  showOnlyPresent,
  onTogglePresent,
  sortOrder,
  onToggleSortOrder,
  onRefresh,
  searchText,
  onSearchTextChange,
  countPresentes,
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleClear = () => {
    onSearchTextChange('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchText}
        onChangeText={onSearchTextChange}
        placeholder="Buscar..."
        mode="flat"
        style={styles.searchInput}
        left={<TextInput.Icon icon="magnify" color="#666" />}
        right={
          isKeyboardVisible ? (
            <TextInput.Icon icon="close" color="#666" onPress={handleClear} />
          ) : null
        }
        placeholderTextColor="#888"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        theme={{
          colors: {
            background: '#ede7f6', // violeta claro
            text: '#333',
            primary: '#6200ee', // color del cursor
            placeholder: '#888',
          },
        }}
      />

      <View style={styles.row}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScrollContainer}
        >
         <CustomDatePicker date={date} onDateChange={onDateChange} />

          <Chip
            icon={showOnlyPresent ? "account-check" : "account-check-outline"}
            mode="flat"
            selected={showOnlyPresent}
            onPress={onTogglePresent}
            style={styles.chip}
            textStyle={{ color: '#333' }}
          >
            Presentes {countPresentes}
          </Chip>

          <Chip icon="refresh" onPress={onRefresh} style={styles.chip}>
            Refresh
          </Chip>

          <Chip
            icon={
              sortOrder === 'asc'
                ? 'sort-alphabetical-ascending'
                : 'sort-alphabetical-descending'
            }
            selected
            onPress={onToggleSortOrder}
            style={styles.chip}
          >
            {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Chip>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 8,
  },
  
  searchInput: {
    backgroundColor: '#ede7f6',
    borderRadius: 8,
    marginHorizontal: 0,
    marginBottom: 8,
    height: 40,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  chipScrollContainer: {
   paddingVertical: 8,
   paddingRight: 8,
   marginLeft: 0,
 },
  chip: {
    marginRight: 8,
    marginLeft: 0,
    paddingLeft: 2,
    marginBottom: 8,
    backgroundColor: '#ede7f6',
    borderRadius: 8,
  },
  datePickerWrapper: {
    marginRight: 8,
    marginBottom: 8,
  },
  
});
