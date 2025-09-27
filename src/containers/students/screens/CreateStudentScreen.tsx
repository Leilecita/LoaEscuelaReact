import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native'
import { TextInput, Checkbox } from 'react-native-paper'
import { checkExistStudent, postStudent } from '../services/studentService'
import { COLORS } from '@core'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform, Pressable } from 'react-native' 
import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
import { Alert } from 'react-native';
import Modal from 'react-native-modal';


export default function CreateStudentScreen() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    dni: '',
    telefono: '',
    esMenor: false,
    nombreMama: '',
    telMama: '',
    observacion: '',
    edad: 0, 
  })

  const handleChange = (key: string, value: string | boolean | number) => {
    setForm({ ...form, [key]: value })
  }

 // const violetPlaceholder = '#bcb0e4'
  const violetPlaceholder = COLORS.veryLightGreenColor
  //const violetButton = COLORS.button
  const violetButton = COLORS.headerDate

  const [showDatePicker, setShowDatePicker] = useState(false)
  const calcularEdad = (fechaISO: string): number => {
    const hoy = new Date()
    const nacimiento = new Date(fechaISO)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  function parseISODateToLocalDate(isoDate: string) {
    const [year, month, day] = isoDate.split('-').map(Number)
    return new Date(year, month - 1, day, 12, 0, 0) // Hora fija a 12:00 evita desfases
  }



  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // meses de 0 a 11
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }


  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) {
      if (Platform.OS === 'android') {
        setShowDatePicker(false)
      }
      return
    }
  
    const iso = formatDate(selectedDate)
    const edad = calcularEdad(iso)
  
    setForm(prevForm => ({
      ...prevForm,
      fechaNacimiento: iso,
      edad: edad,
      esMenor: edad < 18,
    }))
  
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
  } 
  

  
  return (
    <ImageBackground
      source={require('../../../../assets/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100} 
      >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
          setShowDatePicker(false) 
          console.log('toco fuera');
        }}
      >
      <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.subtitle, { color: COLORS.darkLetter3 }]}>Datos del alumno</Text>
        <TextInput
          label={form.nombre ? "Nombre" : undefined}
          value={form.nombre}
          onChangeText={(text) => handleChange('nombre', text)}
          mode="outlined"
          style={styles.input}
          textColor= {COLORS.darkLetter3}
          outlineColor={violetPlaceholder}
          activeOutlineColor={violetButton}
          left={<TextInput.Icon icon="account" color={violetButton} />}
          placeholder="Nombre"
          placeholderTextColor={COLORS.placeholderColor}
        />

        <TextInput
          label={form.apellido ? "Apellido" : undefined}
          value={form.apellido}
          onChangeText={(text) => handleChange('apellido', text)}
          mode="outlined"
           textColor= {COLORS.darkLetter3}
          style={styles.input}
          outlineColor={violetPlaceholder}
          activeOutlineColor={violetButton}
          left={<TextInput.Icon icon="account-outline" color={violetButton} />}
          placeholder="Apellido"
          placeholderTextColor={COLORS.placeholderColor}
        />

        <Pressable onPress={() => setShowDatePicker(true)}>
          <TextInput
            label={form.fechaNacimiento ? "Fecha de Nacimiento" : undefined}
            value={form.fechaNacimiento}
            mode="outlined"
             textColor= {COLORS.darkLetter3}
            style={styles.input}
            editable={false}
            pointerEvents="none"
            outlineColor={violetPlaceholder}
            activeOutlineColor={violetButton}
            left={<TextInput.Icon icon="calendar" color={violetButton} />}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.placeholderColor}
          />
        </Pressable>

        {showDatePicker && (
          Platform.OS === 'ios' ? (
            <Modal
              isVisible={showDatePicker}
              onBackdropPress={() => setShowDatePicker(false)}
            >
              <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
                <DateTimePicker
                  value={
                    form.fechaNacimiento
                      ? parseISODateToLocalDate(form.fechaNacimiento)
                      : new Date(2010, 0, 1, 12, 0, 0)
                  }
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      handleDateChange(event, selectedDate);
                    }
                  }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 6,
                      backgroundColor: '#eee',
                      marginRight: 12,
                      minWidth: 90,              // 👈 ancho mínimo
                      alignItems: 'center',      // 👈 centra el texto
                    }}
                  >
                    <Text style={{ fontSize: 16, color: COLORS.darkLetter }}>Cancelar</Text>
                  </TouchableOpacity>

                   <TouchableOpacity
                      onPress={() => setShowDatePicker(false)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                        backgroundColor: COLORS.headerDate,
                        minWidth: 90,              // 👈 ancho mínimo
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16, color: COLORS.white }}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={
                form.fechaNacimiento
                  ? parseISODateToLocalDate(form.fechaNacimiento)
                  : new Date(2010, 0, 1, 12, 0, 0)
              }
              mode="date"
              display="calendar"
              maximumDate={new Date()}
              onChange={handleDateChange}
            />
          )
        )}




        <TextInput
          label={form.dni ? "DNI" : undefined}
          value={form.dni}
          onChangeText={(text) => handleChange('dni', text)}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
           textColor= {COLORS.darkLetter3}
          outlineColor={violetPlaceholder}
          activeOutlineColor={violetButton}
          left={<TextInput.Icon icon="card-account-details" color={violetButton} />}
          placeholder='DNI'
          placeholderTextColor={COLORS.placeholderColor}
        />

        <TextInput
           label={form.telefono ? "Teléfono" : undefined}
          value={form.telefono}
          onChangeText={(text) => handleChange('telefono', text)}
          mode="outlined"
          keyboardType="phone-pad"
           textColor= {COLORS.darkLetter3}
          style={styles.input}
          outlineColor={violetPlaceholder}
          activeOutlineColor={violetButton}
          left={<TextInput.Icon icon="phone" color={violetButton} />}
          placeholder='Teléfono'
          placeholderTextColor={COLORS.placeholderColor}
        />

        <TextInput
          label={form.observacion ? "Observación importante" : undefined}
          value={form.observacion}
          onChangeText={(text) => handleChange('observacion', text)}
          mode="outlined"
           textColor= {COLORS.darkLetter3}
          style={styles.input}
          outlineColor={violetPlaceholder}
          activeOutlineColor={violetButton}
          left={<TextInput.Icon icon="note" color={violetButton} />}
          placeholder='Observación importante'
          placeholderTextColor={COLORS.ligthLetter}
        />

  

        
        <View style={styles.checkboxContainer}>
          <View style={{
            width: 36,
            height: 36,
            borderWidth: 1,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderColor: COLORS.darkLetter3,
          }}>
            <Checkbox
              status={form.esMenor ? 'checked' : 'unchecked'}
              onPress={() => handleChange('esMenor', !form.esMenor)}
              color={COLORS.darkLetter3}// color del tilde
              uncheckedColor="transparent"
            />
          </View>
          <Text style={[styles.checkboxLabel, { color: COLORS.darkLetter2 }]}>Soy menor de edad</Text>
        </View>

        {form.esMenor && (
          <View >
            <Text style={[styles.subtitle, { color: COLORS.darkLetter3 }]}>Datos de los padres</Text>

            <TextInput
              label={form.nombreMama ? "Nombre del responsable" : undefined}
              value={form.nombreMama}
              onChangeText={(text) => handleChange('nombreMama', text)}
              mode="outlined"
              left={<TextInput.Icon icon="account" color={violetButton} />}
              style={styles.input}
              outlineColor={violetPlaceholder}
              activeOutlineColor={violetButton}
              textColor= {COLORS.darkLetter3}
              placeholder="Nombre del responsable"
              placeholderTextColor={COLORS.ligthLetter}
            />

            <TextInput
              label={form.telMama ? "Teléfono del responsable" : undefined}
              value={form.telMama}
              onChangeText={(text) => handleChange('telMama', text)}
              left={<TextInput.Icon icon="phone" color={violetButton} />}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
               textColor= {COLORS.darkLetter3}
              outlineColor={violetPlaceholder}
              activeOutlineColor={violetButton}
              placeholder='Teléfono del responsable'
              placeholderTextColor={COLORS.placeholderColor}
            />
          </View>
        )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: violetButton }]}
        onPress={async () => {
          // Validación
          const camposRequeridos = [
            form.nombre,
            form.apellido,
            form.fechaNacimiento,
            form.dni,
            form.telefono,
          ];

          if (camposRequeridos.some((campo) => campo.trim() === '')) {
            alert('Por favor completá todos los campos obligatorios.');
            return;
          }

          if (form.esMenor && (form.nombreMama.trim() === '' || form.telMama.trim() === '')) {
            alert('Completá los datos del responsable si sos menor.');
            return;
          }


          // Chequeo DNI antes de enviar
          const dniExiste = await checkExistStudent(form.dni);
          if (dniExiste) {
            Alert.alert('Atención', 'DNI ya existente');
            return; // Salimos para no guardar
          }

          try {
            const mappedData = {
              nombre: form.nombre,
              apellido: form.apellido,
              fecha_nacimiento: form.fechaNacimiento, 
              dni: form.dni,
              tel_adulto: form.telefono,
              nombre_mama: form.nombreMama,
              tel_mama: form.telMama,
              observation: form.observacion,
              edad: form.edad,
            }

            const response = await postStudent(mappedData);
            Alert.alert(
              'Éxito', // título
              'Estudiante creado correctamente', // mensaje
              [{ text: 'OK', onPress: () => console.log('OK presionado') }]
            );


            // Resetear formulario
            setForm({
              nombre: '',
              apellido: '',
              fechaNacimiento: '',
              dni: '',
              telefono: '',
              esMenor: false,
              nombreMama: '',
              telMama: '',
              observacion: '',
              edad: 0, 
            })
          } catch (e: any) {
            alert(`Error al crear estudiante: ${e.message}`);
          }
        }}
      >
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>


    
      </ScrollView>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    //backgroundColor: COLORS.background,
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
  input: {
    marginTop: 10,
    fontSize: 16,
    height: 50,
  },
  rightBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkboxLabel: {
    fontSize: 17,
    marginLeft: 8,
  },
  menorContainer: {
    borderRadius: 12,
    padding: 18,
    marginTop: 20
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#7b61ff',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 }
  },
  buttonText: {
    color: '#fff',
   fontFamily: 'OpenSans-Regular',
    fontSize: 17,
  },
  background: {
    flex: 1,
  },
  
})
