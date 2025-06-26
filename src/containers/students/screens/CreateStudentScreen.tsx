import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Checkbox } from 'react-native-paper'

export default function CreateStudentScreen() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    dni: '',
    telefono: '',
    esMenor: false,
    nombrePapa: '',
    telPapa: '',
    nombreMama: '',
    telMama: ''
  })

  const handleChange = (key: string, value: string | boolean) => {
    setForm({ ...form, [key]: value })
  }

  const violetMain = '#ede7f6' // fondo clarito de input (tu color)
  const violetText = '#6c55b8' // texto violeta medio suave
  const violetPlaceholder = '#bcb0e4' // placeholder más claro
  const violetButton = '#7b61ff' // botón y checkbox (violeta más intenso)

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, { color: violetButton }]}>Registro de Estudiante</Text>

      <Text style={[styles.label, { color: violetText }]}>Nombre</Text>
      <TextInput
        style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
        value={form.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
        placeholder="Nombre"
        placeholderTextColor={violetPlaceholder}
      />

      <Text style={[styles.label, { color: violetText }]}>Apellido</Text>
      <TextInput
        style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
        value={form.apellido}
        onChangeText={(text) => handleChange('apellido', text)}
        placeholder="Apellido"
        placeholderTextColor={violetPlaceholder}
      />

      <Text style={[styles.label, { color: violetText }]}>Fecha de Nacimiento</Text>
      <TextInput
        style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
        value={form.fechaNacimiento}
        onChangeText={(text) => handleChange('fechaNacimiento', text)}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={violetPlaceholder}
      />

      <Text style={[styles.label, { color: violetText }]}>DNI</Text>
      <TextInput
        style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
        value={form.dni}
        onChangeText={(text) => handleChange('dni', text)}
        placeholder="DNI"
        keyboardType="numeric"
        placeholderTextColor={violetPlaceholder}
      />

      <Text style={[styles.label, { color: violetText }]}>Teléfono</Text>
      <TextInput
        style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
        value={form.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        placeholderTextColor={violetPlaceholder}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={form.esMenor ? 'checked' : 'unchecked'}
          onPress={() => handleChange('esMenor', !form.esMenor)}
          color={violetButton}
          uncheckedColor="#d6cfff"
        />
        <Text style={[styles.checkboxLabel, { color: violetText }]}>Soy menor de edad</Text>
      </View>

      {form.esMenor && (
        <View style={[styles.menorContainer, { backgroundColor: violetMain }]}>
          <Text style={[styles.subtitle, { color: violetButton }]}>Datos de los padres</Text>

          <Text style={[styles.label, { color: violetText }]}>Nombre del padre</Text>
          <TextInput
            style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
            value={form.nombrePapa}
            onChangeText={(text) => handleChange('nombrePapa', text)}
            placeholder="Nombre del padre"
            placeholderTextColor={violetPlaceholder}
          />

          <Text style={[styles.label, { color: violetText }]}>Teléfono del padre</Text>
          <TextInput
            style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
            value={form.telPapa}
            onChangeText={(text) => handleChange('telPapa', text)}
            placeholder="Teléfono del padre"
            keyboardType="phone-pad"
            placeholderTextColor={violetPlaceholder}
          />

          <Text style={[styles.label, { color: violetText }]}>Nombre de la madre</Text>
          <TextInput
            style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
            value={form.nombreMama}
            onChangeText={(text) => handleChange('nombreMama', text)}
            placeholder="Nombre de la madre"
            placeholderTextColor={violetPlaceholder}
          />

          <Text style={[styles.label, { color: violetText }]}>Teléfono de la madre</Text>
          <TextInput
            style={[styles.input, { backgroundColor: violetMain, color: violetText }]}
            value={form.telMama}
            onChangeText={(text) => handleChange('telMama', text)}
            placeholder="Teléfono de la madre"
            keyboardType="phone-pad"
            placeholderTextColor={violetPlaceholder}
          />
        </View>
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: violetButton }]} onPress={() => alert('Formulario enviado!')}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#faf9ff',
    flexGrow: 1
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    alignSelf: 'center'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 15
  },
  label: {
    marginTop: 12,
    fontWeight: '600'
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 6,
    fontSize: 16,
    // sin borde ni sombra para look limpio
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  checkboxLabel: {
    fontSize: 17,
    marginLeft: 8
  },
  menorContainer: {
    borderRadius: 12,
    padding: 18,
    marginTop: 20
  },
  button: {
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7b61ff',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18
  }
})
