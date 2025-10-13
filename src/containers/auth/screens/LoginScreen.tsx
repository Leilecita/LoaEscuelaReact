import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@core';
import axiosClient from '../../../core/services/axiosClient';
import { AuthContext } from '../../../contexts/AuthContext';

export const LoginScreen = () => {
  const { top } = useSafeAreaInsets();
  const { signIn } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const violetPlaceholder = COLORS.veryLightGreenColor;
  const violetButton = COLORS.headerDate;

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

      if (
        response.data.result === 'success' &&
        response.data.data?.token &&
        response.data.data?.level
      ) {
        signIn(response.data.data.token, response.data.data.level, response.data.data.name, response.data.data.category, response.data.data.id);
      } else {
        setErrorMsg('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setErrorMsg('Error de conexión o servidor');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 Top Bar (fuera del fondo) */}
      <View style={[styles.topBar, { paddingTop: top }]}>
        <Text style={styles.topBarTitle}>Login</Text>
      </View>

      {/* 🔹 Fondo solo debajo del TopBar */}
      <ImageBackground
        source={require('../../../../assets/fondo.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "padding"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100} // ajustar según el header
                  >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                
                <Text style={[styles.title, { color: COLORS.darkLetter3 }]}>
                  Iniciar Sesión
                </Text>

                <TextInput
                  label={username ? 'Usuario' : undefined}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  mode="outlined"
                  textColor={COLORS.darkLetter3}
                  style={styles.input}
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                  left={<TextInput.Icon icon="account" color={violetButton} />}
                  placeholder="Usuario"
                  placeholderTextColor={COLORS.placeholderColor}
                />

                <TextInput
                  label={password ? 'Contraseña' : undefined}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  mode="outlined"
                  textColor={COLORS.darkLetter3}
                  style={styles.input}
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                  left={<TextInput.Icon icon="lock" color={violetButton} />}
                  placeholder="Contraseña"
                  placeholderTextColor={COLORS.placeholderColor}
                />

                {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: violetButton }]}
                  onPress={handleLogin}
                >
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
             </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: COLORS.darkGreenColor,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
  },
  background: {
    flex: 1,
  },
  container: { padding: 25, flexGrow: 1, marginTop: 115, paddingBottom: 140 },
  title: {
    fontSize: 28,
    marginBottom: 40,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
  },
  input: {
    marginTop: 15,
    height: 50,
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#7b61ff',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#fff',
   fontFamily: 'OpenSans-Regular',
    fontSize: 17,
  },
  error: {
    color: 'red',
    marginTop: 12,
    textAlign: 'center',
  },
});
