import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

type Props = {
  searchText: string;
  onSearchTextChange: (text: string) => void;
};

export const CustomSearchInput: React.FC<Props> = ({ searchText, onSearchTextChange }) => {
  return (
    <TextInput
      value={searchText}
      onChangeText={onSearchTextChange}
      placeholder="Buscar..."
      mode="flat" // o "outlined" si querés con borde completo
      style={styles.input}
      left={<TextInput.Icon icon="magnify" color="#666" />}
      placeholderTextColor="#888"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      theme={{
        colors: {
          background: '#ede7f6', // violeta claro como los chips
          text: '#333',
          primary: '#6200ee',
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ede7f6', // violeta claro
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    fontSize: 14,
    height: 40,
  },
});
