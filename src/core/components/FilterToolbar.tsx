import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { Chip, IconButton } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import { CustomDatePicker } from './DatePickerCustom'
import { COLORS } from 'core/constants'
import { TextInput as PaperInput } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  countStudents?: number
  enableDatePicker?: boolean
  enablePresentFilter?: boolean
  enableSortOrder?: boolean
  enableRefresh?: boolean
  activeFilter?: 'si' | 'no'
  onToggleActiveFilter?: () => void
  enableActiveFilter?: boolean
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
  countStudents = 0,
  enableDatePicker = false,
  enablePresentFilter = false,
  enableSortOrder = false,
  enableRefresh = false,
  enableActiveFilter = 'si',
  activeFilter,
  onToggleActiveFilter = () => {},
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  
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
    if (searchText) {
      onSearchTextChange(""); // 👈 limpia si hay texto
    }
    Keyboard.dismiss();       // 👈 siempre oculta el teclado
    setIsFocused(false);      
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.searchRow}>
      <PaperInput
        value={searchText}
        onChangeText={onSearchTextChange}
        placeholder="Buscar..."
        mode="flat"
        textColor={COLORS.white}
        style={styles.searchInput}
        left={<PaperInput.Icon icon="magnify" color="#fff" />}
        right={
          (isFocused || searchText) ? (
            <PaperInput.Icon icon="close" color="#fff" onPress={handleClear} />
          ) : null
        }
        placeholderTextColor="#fff"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        blurOnSubmit={false}
        cursorColor={COLORS.white}
        selectionColor={COLORS.white}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        theme={{
          colors: {
            primary: "#6200ee",
            onSurfaceVariant: "#6200ee",
            text: "#333",
            placeholder: "#888",
            background: "#ede7f6",
          },
        }}
      />
      <TouchableRipple
        borderless
        onPress={onRefresh}
        style={styles.fabButton}
        rippleColor="rgba(53, 49, 49, 0.32)"
      >
        <IconButton
          icon="refresh"
          size={24}
          iconColor={COLORS.white}
          accessibilityLabel="Refrescar"
        />
      </TouchableRipple>
    </View>
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
            icon={() => (
              <MaterialCommunityIcons
                name={showOnlyPresent ? 'account-check' : 'account-check'}
                size={20}
                color={COLORS.darkLetter} 
              />
            )}
            mode="flat"
            selected={showOnlyPresent}
            onPress={onTogglePresent}
            style={[
              styles.chip,
              showOnlyPresent
                ? { backgroundColor: COLORS.buttonClear } // violeta oscuro cuando está seleccionado
                : { backgroundColor: COLORS.chipGreenColor } // violeta claro cuando NO está seleccionado
            ]}
            textStyle={{
              color: COLORS.darkLetter, 
              fontFamily: 'OpenSans-Light',
              fontSize: 16
            }}
          >
            Presentes {countPresentes} / {countStudents}
          </Chip>
        )}

          {enableSortOrder && (
            <Chip
            icon={() => (
              <MaterialCommunityIcons
                name={
                  sortOrder === 'alf'
                    ? 'sort-alphabetical-ascending'
                    : 'sort-alphabetical-descending'
                }
                size={20}
                color={COLORS.darkLetter} 
              />
            )}
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

          {enableRefresh && (
           <Chip
           icon={() => (
             <MaterialCommunityIcons
               name="refresh"
               color={COLORS.darkLetter}   // 👈 ahora controlás el color
               size={20}
             />
           )}
           onPress={onRefresh}
           style={styles.chip}
           textStyle={{
             color: COLORS.darkLetter,
             fontFamily: 'OpenSans-Light',
             fontSize: 16,
           }}
         >
           Refresh
         </Chip>
          )}
          {enableActiveFilter && (
              <Chip
                icon={() => (
                  <MaterialCommunityIcons
                    name={activeFilter === 'si' ? 'account-multiple' : 'account-off'}
                    size={20}
                    color={COLORS.darkLetter}
                  />
                )}
                selected
                onPress={onToggleActiveFilter}
                style={styles.chip}
                textStyle={{
                  fontFamily: 'OpenSans-Light',
                  color: COLORS.darkLetter,
                  fontSize: 16,
                }}
              >
                {activeFilter === 'si' ? 'Activos' : 'Inactivos'}
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
    backgroundColor:  COLORS.transparentGreenColor,
    borderRadius: 8,
    marginBottom: 8,
    height: 50,
    flex: 1,
    fontSize: 17,
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
    backgroundColor: COLORS.chipGreenColor,
    borderRadius: 8,
  },
  fabButton: {
    borderRadius: 8,           // círculo (medio del tamaño del botón)
    width: 48,
    height: 50,
    backgroundColor:  COLORS.transparentGreenColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    marginLeft: 8,
  },
  searchRow: {
   
    backgroundColor: 'transparent',
    borderRadius: 12,
    flexDirection: 'row',
  },
 
})
