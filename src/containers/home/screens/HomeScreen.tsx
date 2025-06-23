// src/containers/home/screens/HomeScreen.tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Ir a Asistencias" onPress={() => navigation.navigate('Asistencias')} />
      <Button title="Todos los alumnos" onPress={() => navigation.navigate('ListaDeAlumnos')} />
    </View>
  );
};
