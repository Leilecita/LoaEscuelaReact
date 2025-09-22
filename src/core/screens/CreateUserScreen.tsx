import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from 'react-native'
import { TextInput } from 'react-native-paper'
import { COLORS } from '@core'
import axiosClient from '../services/axiosClient'
import { Picker } from '@react-native-picker/picker' // 📌 instalar: npm install @react-native-picker/picker

export default function CreateUserScreen() {
  const [form, setForm] = useState({
    name: '',
    hash_password: '',
    mail: '',
    phone: '',
    level: '',  
    category: '',      
  })

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const violetPlaceholder = COLORS.veryLightGreenColor
  const violetButton = COLORS.headerDate

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.hash_password.trim() || !form.mail.trim() || !form.phone.trim() || !form.category.trim()) {
      Alert.alert('Error', 'Por favor completá todos los campos.')
      return
    }

    try {
      const key = 'lorena'
      const payload = {
        ...form,
        token: ''  
      }

      const response = await axiosClient.post('/login.php', payload, {
        params: {
          key_access: key,
          method: 'register'
        }
      })

      if (response.data.result === 'success') {
        Alert.alert('Éxito', 'El usuario ha sido registrado correctamente.')
        setForm({ name: '', hash_password: '', mail: '', phone: '', level: 'empleado', category: '' })
      } else {
        Alert.alert('Error', response.data.message || 'No se pudo registrar el usuario.')
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error de conexión.')
    }
  }

  return (
    <ImageBackground source={require('../../../assets/fondo.png')} style={styles.background} resizeMode="cover">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={[styles.subtitle, { color: COLORS.darkLetter3 }]}>Crear Usuario</Text>

            {/* Inputs existentes */}
            <TextInput autoCapitalize="none" label={form.name ? 'Nombre' : undefined} value={form.name} onChangeText={(text) => handleChange('name', text)} mode="outlined" style={styles.input} outlineColor={violetPlaceholder} activeOutlineColor={violetButton} textColor={COLORS.darkLetter3} placeholder="Nombre" placeholderTextColor={COLORS.placeholderColor} left={<TextInput.Icon icon="account" color={violetButton} />} />

            <TextInput autoCapitalize="none" label={form.hash_password ? 'Contraseña' : undefined} value={form.hash_password} onChangeText={(text) => handleChange('hash_password', text)} mode="outlined" secureTextEntry style={styles.input} outlineColor={violetPlaceholder} activeOutlineColor={violetButton} textColor={COLORS.darkLetter3} placeholder="Contraseña" placeholderTextColor={COLORS.placeholderColor} left={<TextInput.Icon icon="lock" color={violetButton} />} />

            <TextInput autoCapitalize="none" label={form.mail ? 'Mail' : undefined} value={form.mail} onChangeText={(text) => handleChange('mail', text)} mode="outlined" style={styles.input} outlineColor={violetPlaceholder} activeOutlineColor={violetButton} textColor={COLORS.darkLetter3} placeholder="Mail" placeholderTextColor={COLORS.placeholderColor} left={<TextInput.Icon icon="email" color={violetButton} />} keyboardType="email-address" />

            <TextInput label={form.phone ? 'Teléfono' : undefined} value={form.phone} onChangeText={(text) => handleChange('phone', text)} mode="outlined" style={styles.input} outlineColor={violetPlaceholder} activeOutlineColor={violetButton} textColor={COLORS.darkLetter3} placeholder="Teléfono" placeholderTextColor={COLORS.placeholderColor} left={<TextInput.Icon icon="phone" color={violetButton} />} keyboardType="phone-pad" />
            {/* Input para level */}
            <TextInput
              autoCapitalize="none"
              label={form.level ? 'Nivel' : undefined}
              value={form.level}
              onChangeText={(text) => handleChange('level', text)}
              mode="outlined"
              style={styles.input}
              outlineColor={violetPlaceholder}
              activeOutlineColor={violetButton}
              textColor={COLORS.darkLetter3}
              placeholder="Nivel (admin / empleado)"
              placeholderTextColor={COLORS.placeholderColor}
            />

            {/* Input para categoría */}
            <TextInput
              autoCapitalize="none"
              label={form.category ? 'Categoría' : undefined}
              value={form.category}
              onChangeText={(text) => handleChange('category', text)}
              mode="outlined"
              style={styles.input}
              outlineColor={violetPlaceholder}
              activeOutlineColor={violetButton}
              textColor={COLORS.darkLetter3}
              placeholder="Categoría"
              placeholderTextColor={COLORS.placeholderColor}
            />


            <TouchableOpacity style={[styles.button, { backgroundColor: violetButton }]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: { padding: 25, flexGrow: 1 },
  subtitle: { fontSize: 20, fontWeight: '600', marginVertical: 15 },
  input: { marginTop: 10,  },
  button: { marginTop: 30, paddingVertical: 15, borderRadius: 8, alignItems: 'center', shadowColor: '#7b61ff', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 4 } },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  background: { flex: 1 },
})
