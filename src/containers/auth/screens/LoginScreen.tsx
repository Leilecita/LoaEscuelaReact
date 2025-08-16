import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '@core';

import axiosClient from '../../../core/services/axiosClient';

import { AuthContext } from '../../../contexts/AuthContext'; 

export const LoginScreen = () => {
  const { top } = useSafeAreaInsets();
  const { signIn } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    const name = username.trim().toLowerCase();
    const passwordPlain = password;

    try {

      const response = await axiosClient.get('/login.php', {
        params: {
          name: name,
          hash_password: passwordPlain,
          method: 'login',
        },
      });


     /* const response = await axios.get('http://192.168.5.33/loa_school/login.php', {
        params: {
          name: name,
          hash_password: passwordPlain,
          method: 'login',
        },
      }); */

      console.log('Respuesta del backend:', response.data);

      if (response.data.result === 'success' && response.data.data?.token) {
        console.log('Token recibido del backend:', response.data.data.token);
        // Guardar token y actualizar estado global para "loguear"
        signIn(response.data.data.token);
      } else {
        console.log('Login fallido:', response.data);
        setErrorMsg('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.log('Error en login:', error);
      setErrorMsg('Error de conexión o servidor');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <Input value={username} onChange={setUsername} autoCapitalize="none" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <Input value={password} onChange={setPassword} secureTextEntry />
      </View>

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <View style={styles.buttonContainers}>
        <Button title="Iniciar sesión" onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'PlaypenSans-Bold',
    marginBottom: 90,
  },
  inputContainer: {},
  label: {
    fontSize: 16,
    fontFamily: 'PlaypenSans-Regular',
    marginBottom: 8,
  },
  buttonContainers: {
    gap: 24,
    marginTop: 40,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
