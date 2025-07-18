// src/containers/home/screens/HomeScreen.tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../src/types'; // importa el tipo root stack
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Estas dos rutas están definidas en RootStackParamList */}
      <Button title="Ir a Asistencias" onPress={() => navigation.navigate('Asistencias')} />
      <Button
        title="Todos los alumnos"
        onPress={() =>
          navigation.navigate('ListaDeAlumnos', {
            category: 'Todas',
            subcategoria: 'Todas',
            modo: 'lista',
          })
        }
      />
    </View>
  );
};
