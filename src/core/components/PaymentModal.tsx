import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from 'core/constants';
import api from '../services/axiosClient';

type PaymentModalProps = {
  visible: boolean;
  onClose: () => void;
  studentId: number | null;
  onSuccess?: () => void;
  onSubmit?: (data: {
    fecha: Date;
    monto: string;
    metodo: '💵 efectivo' | '🏦 banco' | '📱 transferencia';
    detalle: string;
  }) => void;
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  studentId,
  onSuccess,
  onSubmit,
}) => {
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [monto, setMonto] = useState('');
  const [clases, setClases] = useState('');
  const [total, setTotal] = useState('');
  const [lugar, setLugar] = useState('escuela');
  const [metodo, setMetodo] = useState('💵 efectivo');
  const [detalle, setDetalle] = useState('');
  const [tipoNuevo, setTipoNuevo] = useState(false);
  const [showMetodoOptions, setShowMetodoOptions] = useState(false);
  const [showLugarOptions, setShowLugarOptions] = useState(false);

  const medios = ['💵 efectivo', '🏦 banco', '📱 transferencia'];
  const lugares = ['escuela', 'negocio'];

  const formatDateTime = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handleSubmit = async () => {
    const cantidadClases = tipoNuevo ? parseInt(clases) || 0 : 0;
    const montoTotalCurso = tipoNuevo ? parseFloat(total) || 0 : 0;
    const paidAmount = parseFloat(monto) || 0;
    
    const observation = tipoNuevo
    ? `${detalle} nuevo ${cantidadClases}cl`
    : `${detalle} a cta`;
  
    if (tipoNuevo && (!clases || !total || !monto)) {
      alert('Complete todos los campos obligatorios del curso y pago.');
      return;
    }
  
    if (!tipoNuevo && !monto) {
      alert('Complete el monto del pago.');
      return;
    }
  
    // Limpiar emojis del método de pago
    const metodoSinEmoji = metodo.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim();
  
    // Convertir fecha a yyyy-MM-dd HH:mm:ss
    const fechaFormateada = fecha
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
  
    const courseData: any = {
      student_id: studentId,
      classes_number: cantidadClases,
      amount: montoTotalCurso,
      observation,
      payment_method: metodoSinEmoji,
      payment_place: lugar,
      paid_amount: paidAmount,
      created: fechaFormateada,
      category: 'escuela',
      sub_category: 'intermedios',
    };
  
    try {
      await api.post('/class_courses.php', courseData, {
        params: { method: 'post' },
      });
      onClose();
      onSuccess?.();
      // Reset campos
      setMonto('');
      setClases('');
      setTotal('');
      setLugar('escuela');
      setDetalle('');
      setMetodo('💵 efectivo');
      setTipoNuevo(false);
      setFecha(new Date());
      setShowMetodoOptions(false);
      setShowLugarOptions(false);
    } catch (error: any) {
      alert(error.message || 'Error al crear el curso y registrar el pago');
    }
  };
  

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setFecha(selectedDate);
  };

  const { width } = Dimensions.get('window');

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={{ justifyContent: 'center', alignItems: 'center' }} avoidKeyboard>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ width: '100%', alignItems: 'center' }}>
        <View style={[styles.modalContainer, { width: width * 0.95 }]}>
          <Text style={styles.title}>Nuevo Pago</Text>

          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            {/* Fecha y Lugar */}
            <View style={styles.row}>
              <TouchableOpacity style={[styles.input, { flex: 1, marginRight: 8 }]} onPress={() => setShowDatePicker(true)}>
                <Text>{fecha.toLocaleDateString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => setShowLugarOptions(!showLugarOptions)}>
                <Text>{lugar}</Text>
              </TouchableOpacity>

              {showLugarOptions && (
                <View style={[styles.dropdown, { top: 55, right: 0 }]}>
                  {lugares.map((l) => (
                    <TouchableOpacity key={l} style={styles.dropdownItem} onPress={() => { setLugar(l); setShowLugarOptions(false); }}>
                      <Text>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {showDatePicker && <DateTimePicker value={fecha} mode="date" display="calendar" onChange={handleDateChange} />}

            {/* Switch Nuevo */}
            <View style={styles.switchRow}>
              <Text style={styles.label}>¿Es nuevo curso?</Text>
              <Switch value={tipoNuevo} onValueChange={setTipoNuevo} />
            </View>

            {/* Monto y método de pago */}
            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Monto" keyboardType="numeric" value={monto} onChangeText={setMonto} />

              <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => setShowMetodoOptions(!showMetodoOptions)}>
                <Text>{metodo}</Text>
              </TouchableOpacity>

              {showMetodoOptions && (
                <View style={[styles.dropdown, { top: 55, right: 0 }]}>
                  {medios.map((m) => (
                    <TouchableOpacity key={m} style={styles.dropdownItem} onPress={() => { setMetodo(m); setShowMetodoOptions(false); }}>
                      <Text>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Clases y total del curso */}
            {tipoNuevo && (
              <View style={styles.row}>
                <TextInput style={[styles.inputNoBorder, { flex: 1, marginRight: 8 }]} placeholder="Cantidad de clases" keyboardType="numeric" value={clases} onChangeText={setClases} />
                <TextInput style={[styles.inputNoBorder, { flex: 1 }]} placeholder="Valor total del curso" keyboardType="numeric" value={total} onChangeText={setTotal} />
              </View>
            )}

            <TextInput style={[styles.input, { height: 50 }]} placeholder="Observación" multiline value={detalle} onChangeText={setDetalle} />

            {/* Botones */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Mantener tus estilos
const styles = StyleSheet.create({
  modalContainer: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: { borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fff', fontSize: 16, marginVertical: 2, paddingHorizontal: 12, paddingVertical: 6, height: 40, justifyContent: 'center' },
  inputNoBorder: { backgroundColor: '#f9f9f9', fontSize: 16, marginVertical: 2, paddingHorizontal: 12, paddingVertical: 6, height: 40, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  dropdown: { position: 'absolute', width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, zIndex: 10, elevation: 5 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6, alignItems: 'center' },
  label: { fontSize: 16 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  cancelButton: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, backgroundColor: '#ccc', borderRadius: 8 },
  submitButton: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: COLORS.primary, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
