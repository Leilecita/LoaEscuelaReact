import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Chip, TextInput } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import { CustomDatePicker } from './DatePickerCustom'
import { COLORS } from 'core/constants'

type FilterBarProps = {
  date?: Date
  onDateChange?: (date: Date) => void
  showOnlyPresent?: boolean
  onTogglePresent?: () => void
  sortOrder?: 'alf' | ''
  onToggleSortOrder?: () => void
  onRefresh?: () => void
  searchText: string
  onSearchTextChange: (text: string) => void
  countPresentes?: number
  enableDatePicker?: boolean
  enablePresentFilter?: boolean
  enableSortOrder?: boolean
  enableRefresh?: boolean
}

export const FilterBar: React.FC<FilterBarProps> = ({
  date = new Date(),
  onDateChange = () => {},
  showOnlyPresent = false,
  onTogglePresent = () => {},
  sortOrder = 'alf',
  onToggleSortOrder = () => {},
  onRefresh = () => {},
  searchText,
  onSearchTextChange,
  countPresentes = 0,
  enableDatePicker = false,
  enablePresentFilter = false,
  enableSortOrder = false,
  enableRefresh = false,
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
    })
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  const handleClear = () => {
    onSearchTextChange('')
    Keyboard.dismiss()
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
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
        blurOnSubmit={false}
        theme={{
          colors: {
            background: '#ede7f6',
            text: '#333',
            primary: '#6200ee',
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
          {enableDatePicker && (
            <CustomDatePicker date={date} onDateChange={onDateChange} />
          )}

          {enablePresentFilter && (
            <Chip
              icon={showOnlyPresent ? 'account-check' : 'account-check-outline'}
              mode="flat"
              selected={showOnlyPresent}
              onPress={onTogglePresent}
              style={[
                styles.chip,
                showOnlyPresent
                  ? { backgroundColor: COLORS.buttonClear } // violeta oscuro cuando está seleccionado
                  : { backgroundColor: '#ede7f6' } // violeta claro cuando NO está seleccionado
              ]}
              textStyle={{
                color: showOnlyPresent ? COLORS.darkLetter : COLORS.darkLetter, 
                fontFamily: 'OpenSans-Light',
                fontSize: 16
              }}
            >
              Presentes {countPresentes}
          </Chip>
          )}

          {enableRefresh && (
            <Chip icon="refresh" onPress={onRefresh} style={styles.chip}
            textStyle={{
              color: COLORS.darkLetter,        
              fontFamily: 'OpenSans-Light',      
              fontSize: 16,                  
            }}>
              Refresh
            </Chip>
          )}

          {enableSortOrder && (
            <Chip
              icon={
                sortOrder === 'alf'
                  ? 'sort-alphabetical-ascending'
                  : 'sort-alphabetical-descending'
              }
              selected
              onPress={onToggleSortOrder}
              style={styles.chip}
              textStyle={{
                fontFamily: 'OpenSans-Light',
                color: COLORS.darkLetter,              
                fontSize: 16,                  
              }}
            >
              {sortOrder === 'alf' ? 'A-Z' : 'Z-A'}
            </Chip>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginTop: 12,
    backgroundColor: 'transparent',
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
})
