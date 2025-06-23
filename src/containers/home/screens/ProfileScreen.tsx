import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@core';
import { AuthContext } from '../../../contexts/AuthContext'; // ajusta la ruta si es necesario

export const ProfileScreen = () => {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
