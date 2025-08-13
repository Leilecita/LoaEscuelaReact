import React, { useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { TextInput, IconButton } from 'react-native-paper'
import { COLORS } from 'core/constants'
import { TouchableRipple } from 'react-native-paper'

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

      <TouchableRipple
        borderless
        onPress={onRefresh}
        style={styles.fabButton}
        rippleColor="rgba(53, 49, 49, 0.32)"
      >
        <IconButton
          icon="refresh"
          size={24}
          iconColor={COLORS.darkLetter}
          accessibilityLabel="Refrescar"
        />
      </TouchableRipple>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,

    padding: 8,
    backgroundColor: 'transparent',
  },
  fabButton: {
   backgroundColor: '#ede7f6', // fondo tipo botón, podés usar algún color o var
   borderRadius: 8,           // círculo (medio del tamaño del botón)
   width: 48,
   height: 48,
   justifyContent: 'center',
   alignItems: 'center',
   shadowOffset: { width: 0, height: 2 },
   marginLeft: 8,
 },

  searchInput: {
    flex: 1,
    backgroundColor: '#ede7f6',
    borderRadius: 8,
    height: 40,
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    margin: 0,
  },
})
