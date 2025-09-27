import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, } from 'react-native'
import { TextInput, IconButton } from 'react-native-paper'
import { COLORS } from 'core/constants'
import { TouchableRipple } from 'react-native-paper'
import { TextInput as PaperInput } from "react-native-paper";

type SimpleFilterBarProps = {
  searchText: string
  onSearchTextChange: (text: string) => void
  onRefresh: () => void
}

export const SimpleFilterToolbar: React.FC<SimpleFilterBarProps> = ({
  searchText,
  onSearchTextChange,
  onRefresh,
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
      <PaperInput
        value={searchText}
        onChangeText={onSearchTextChange}
        placeholder="Buscar..."
        mode="flat"
        textColor= {COLORS.white}
        style={styles.searchInput}
        left={<PaperInput.Icon icon="magnify" color="#fff" />}
        right={
          (isFocused || searchText) ? ( // 👈 aparece si está enfocado o hay texto
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
   
  </KeyboardAvoidingView>
   
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: 'transparent',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 8,
  },
 
  fabButton: {
   borderRadius: 8,           // círculo (medio del tamaño del botón)
   width: 48,
   height: 40,
   backgroundColor:  COLORS.transparentGreenColor,
   justifyContent: 'center',
   alignItems: 'center',
   shadowOffset: { width: 0, height: 2 },
   marginLeft: 8,
 },

  searchInput: {
    flex: 1,
    backgroundColor:  COLORS.transparentGreenColor,
    borderRadius: 8,
    height: 40,
    fontSize: 17,
  },
  
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    margin: 0,
  },
})
