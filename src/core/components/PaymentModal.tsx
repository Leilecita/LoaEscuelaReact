import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
  Alert
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';
import { COLORS } from 'core/constants';
import api from '../services/axiosClient';
import { AuthContext } from '../../contexts/AuthContext';

import { parseCurrency, currencyToDisplay } from 'helpers/numberHelper';
import { ClasesPriceContext } from '../../contexts/ClasesPriceContext';

type PaymentModalProps = {
  visible: boolean;
  onClose: () => void;
  studentId: number | null;
  firstName: string;
  lastName: string;
  category: string;
  sub_category: string;
  onSuccess?: () => void;

};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  studentId,
  firstName,
  lastName,
  category,
  sub_category,
  onSuccess,
}) => {
  console.log('📌 PaymentModal props:', { studentId, firstName, lastName, category, sub_category });
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [clases, setClases] = useState('');
  const [lugar, setLugar] = useState('escuela');
  const [metodo, setMetodo] = useState('efectivo');
  const [detalle, setDetalle] = useState('');
  const [showMetodoOptions, setShowMetodoOptions] = useState(false);
  const [showLugarOptions, setShowLugarOptions] = useState(false);
  const [tipoCurso, setTipoCurso] = useState<'nuevo' | 'cta'>('cta');

  const [total, setTotal] = useState<number>(0);
  const [monto, setMonto] = useState<number>(0);

  const { valores: valoresPorClasesContext } = useContext(ClasesPriceContext);

  const medios = ['efectivo', 'mp', 'transferencia'];
  const lugares = ['escuela', 'negocio'];

  const { width } = Dimensions.get('window');
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';


  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setFecha(selectedDate);
  };

  const handleSubmit = async () => {

    const esNuevoCurso = tipoCurso === 'nuevo';
    const cantidadClases = esNuevoCurso ? parseInt(clases) || 0 : 0;
    const montoTotalCurso = esNuevoCurso ? total : 0; 
    const paidAmount = monto; 

    if (esNuevoCurso && (!clases || !total || !monto)) {
      alert('Complete todos los campos obligatorios del curso y pago.');
      return;
    }

    if (!esNuevoCurso && !monto) {
      alert('Complete el monto del pago.');
      return;
    }

    const observation = esNuevoCurso
    ? `${detalle ? detalle + ' - ' : ''}${cantidadClases} ${cantidadClases > 1 ? 'clases' : 'clase'}`
    : `${detalle ? detalle + ' - ' : ''}A cuenta`;

    const fechaFormateada = fecha.toISOString().replace('T', ' ').substring(0, 19);

    const courseData: any = {
      student_id: studentId,
      classes_number: cantidadClases,
      amount: montoTotalCurso,
      observation,
      payment_method: metodo,
      payment_place: lugar,
      paid_amount: paidAmount,
      created: fechaFormateada,
      category,
      sub_category,
    };

    try {
      await api.post('/class_courses.php', courseData, { params: { method: 'post' } });
      onClose();
      onSuccess?.();

      // reset campos
      setMonto(0);
      setClases('');
      setTotal(0);
      setLugar('escuela');
      setDetalle('');
      setMetodo('efectivo');
      setTipoCurso('cta');
      setFecha(new Date());
      setShowMetodoOptions(false);
      setShowLugarOptions(false);
    } catch (error: any) {
      alert(error.message || 'Error al crear el curso y registrar el pago');
    }
  };
  
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      avoidKeyboard
    >
       
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
         <ImageBackground
        source={require('../../../assets/fondo.png')}
        resizeMode="cover"
      >
        <View style={[styles.bottomSheet, { height: '85%', width: width }]}>
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.studentName}>{firstName} {lastName}</Text>
            <Text style={styles.title}>Nuevo Pago</Text>
          </View>

          <ScrollView
            style={{ width: '100%', flex: 1 }}
            contentContainerStyle={{ paddingBottom: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.segmentedContainer}>
              <TouchableOpacity
                style={[styles.segment, tipoCurso === 'cta' && styles.segmentActive]}
                onPress={() => setTipoCurso('cta')}
              >
                <Text style={[styles.segmentText, tipoCurso === 'cta' && styles.segmentTextActive]}>
                  A cuenta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segment, tipoCurso === 'nuevo' && styles.segmentActive]}
                onPress={() => setTipoCurso('nuevo')}
              >
                <Text style={[styles.segmentText, tipoCurso === 'nuevo' && styles.segmentTextActive]}>
                  Curso nuevo
                </Text>
              </TouchableOpacity>
            </View>


            {/* Fecha y Lugar */}
            <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                if (!isAdmin) {
                  Alert.alert('Acceso restringido', 'Solo los administradores pueden cambiar la fecha');
                  return;
                }
                setShowDatePicker(true);
              }}
              style={{ flex: 1, marginRight: 8 }}
            >
              <TextInput
                label="Fecha"
                value={fecha.toLocaleDateString()}
                mode="outlined"
                textColor={COLORS.darkLetter3}
                editable={false}          // evita escribir manualmente
                pointerEvents="none"      // bloquea interacciones dentro del input
                outlineColor={COLORS.veryLightGreenColor}
                activeOutlineColor={COLORS.headerDate}
                left={<TextInput.Icon icon="calendar" color={COLORS.headerDate} size={22} />}
              />
            </TouchableOpacity>


              <TouchableOpacity onPress={() => setShowLugarOptions(!showLugarOptions)} style={{ flex: 1 }}>
                <TextInput
                  label="Lugar de pago"
                  value={lugar}
                  mode="outlined"
                  textColor= {COLORS.darkLetter3}
                  editable={false}
                  pointerEvents="none"
                  outlineColor={COLORS.veryLightGreenColor}
                  activeOutlineColor={COLORS.headerDate}
                  left={<TextInput.Icon icon="map-marker" color={COLORS.headerDate} size={22}/>}
                />
              </TouchableOpacity>
            </View>

            {showLugarOptions && (
              <View style={styles.dropdown}>
                {lugares.map((l) => (
                  <TouchableOpacity key={l} style={styles.dropdownItem} onPress={() => { setLugar(l); setShowLugarOptions(false); }}>
                    <Text>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {showDatePicker && (
              Platform.OS === 'ios' ? (
                <Modal
                  isVisible={showDatePicker}
                  onBackdropPress={() => setShowDatePicker(false)}
                >
                  <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
                    <DateTimePicker
                      value={fecha}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setFecha(selectedDate);
                      }}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)} style={{ marginRight: 10 }}>
                        <Text>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text>Aceptar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              ) : (
                <DateTimePicker
                  value={fecha}
                  mode="date"
                  display="calendar"
                  onChange={handleDateChange}
                />
              )
            )}


            {tipoCurso === 'nuevo' && (
              <View style={styles.row}>
                <TextInput
                  label={clases ? "Cantidad de clases" : undefined}
                  value={clases}
                  onChangeText={(text) => {
                    setClases(text);
                    const num = parseInt(text, 10);
                    // 👈 Convertimos la clave a string para que funcione con "1"
                    const valor = !isNaN(num) ? valoresPorClasesContext[num.toString()] ?? 0 : 0;

                    setTotal(valor);
                  }}
                  textColor={COLORS.darkLetter3}
                  mode="outlined"
                  keyboardType="numeric"
                  outlineColor={COLORS.veryLightGreenColor}
                  activeOutlineColor={COLORS.headerDate}
                  style={styles.input}
                  placeholder="Cantidad de clases"
                  placeholderTextColor={COLORS.placeholderColor}
                />

                <TextInput
                  label={total ? "Valor total del curso" : undefined}
                  value={currencyToDisplay(total)}
                  onChangeText={(text) => setTotal(parseCurrency(text))}
                  mode="outlined"
                  textColor={COLORS.darkLetter}
                  keyboardType="numeric"
                  outlineColor={COLORS.veryLightGreenColor}
                  activeOutlineColor={COLORS.headerDate}
                  style={styles.input}
                  placeholder="Valor total del curso"
                  placeholderTextColor={COLORS.placeholderColor}
                />
              </View>
            )}


            {/* Monto y Método */}
            <View style={styles.row}>
              <TextInput
                label={monto ? "Monto a abonar" : undefined}
                value={currencyToDisplay(monto)}                 // 👈 mostrar formateado
                onChangeText={(text) => setMonto(parseCurrency(text))} // 👈 guardar limpio
                textColor={COLORS.darkLetter3}
                mode="outlined"
                keyboardType="numeric"
                outlineColor={COLORS.veryLightGreenColor}
                activeOutlineColor={COLORS.headerDate}
                style={styles.input}
                placeholder="Monto a abonar"
                placeholderTextColor={COLORS.placeholderColor}
              />



      
              <TouchableOpacity onPress={() => setShowMetodoOptions(!showMetodoOptions)} style={{ flex: 1 }}>
              <TextInput
                label={metodo ? "Método" : undefined} // 👈 solo aparece si hay valor
                value={metodo}
                mode="outlined"
                editable={false}
                pointerEvents="none"
                textColor= {COLORS.darkLetter3}
                outlineColor={COLORS.veryLightGreenColor}
                activeOutlineColor={COLORS.headerDate}
                style={styles.input}
                placeholder="Método"
                placeholderTextColor={COLORS.placeholderColor}
              />

              </TouchableOpacity>
            </View>

            {showMetodoOptions && (
              <View style={styles.dropdown}>
                {medios.map((m) => (
                  <TouchableOpacity key={m} style={styles.dropdownItem} onPress={() => { setMetodo(m); setShowMetodoOptions(false); }}>
                    <Text>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TextInput
              label={detalle ? "Observación" : undefined} // 👈 solo aparece si hay texto
              value={detalle}
              onChangeText={setDetalle}
              textColor= {COLORS.darkLetter3}
              mode="outlined"
              outlineColor={COLORS.veryLightGreenColor}
              activeOutlineColor={COLORS.headerDate}
              multiline
              style={[styles.input, { height: 60 }]}
              placeholder="Observación"
              placeholderTextColor={COLORS.placeholderColor}
            />

            {/* Botones */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonTextCancelar}>cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: { 
    //backgroundColor: COLORS.backgroundGreenClear, 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16, 
    
    padding: 20,
    marginBottom: 0,   
    
  },
  dragHandle: { width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 2.5, alignSelf: 'center', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  input: { flex: 1, marginVertical: 4, marginRight: 8, borderRadius: 10, textShadowColor:  '#fff',   height: 50, },
  dropdown: { position: 'absolute', width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, zIndex: 10 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  cancelButton: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, borderRadius: 8 },
  submitButton: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: COLORS.headerDate, borderRadius: 8 },
  buttonText: {color:COLORS.white, fontSize: 17 },
  buttonTextCancelar: {color:COLORS.buttonClearLetter, fontSize: 17 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 25, height: 25, borderWidth: 2, borderColor: COLORS.button, borderRadius: 4, marginRight: 6 },
  checked: { backgroundColor: COLORS.buttonClear },
  checkboxLabel: { fontSize: 16, color: COLORS.buttonClearLetter },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    marginBottom: 18,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.disabledGreyColor,
    alignItems: 'center',
  },
  
  segmentActive: {
    backgroundColor: COLORS.headerDate,
  },
  segmentText: {
    color: COLORS.buttonClearLetter,
    fontSize: 15,

    fontFamily: 'OpenSans-Regular',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 17,
  },
  title: {
    fontSize: 16,
    color: COLORS.darkLetter3,
    fontFamily: 'OpenSans-Light'
  },
  studentName: { fontSize: 18, color: COLORS.darkLetter2, marginBottom: 4, textAlign: 'center',   fontFamily: 'OpenSans-Regular' },
  background: {
    flex: 1,
  },
  
});
