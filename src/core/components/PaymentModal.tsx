import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';
import { COLORS } from 'core/constants';
import api from '../services/axiosClient';

type PaymentModalProps = {
  visible: boolean;
  onClose: () => void;
  studentId: number | null;
  firstName: string;
  lastName: string;
  category: string;
  onSuccess?: () => void;
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  studentId,
  firstName,
  lastName,
  category,
  onSuccess,
}) => {
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [monto, setMonto] = useState('');
  const [clases, setClases] = useState('');
  const [total, setTotal] = useState('');
  const [lugar, setLugar] = useState('escuela');
  const [metodo, setMetodo] = useState('efectivo');
  const [detalle, setDetalle] = useState('');
  const [showMetodoOptions, setShowMetodoOptions] = useState(false);
  const [showLugarOptions, setShowLugarOptions] = useState(false);
  const [tipoCurso, setTipoCurso] = useState<'nuevo' | 'cta'>('cta');
  const [selectedCategory, setSelectedCategory] = useState('');
const [selectedSubCategory, setSelectedSubCategory] = useState(''); // ✅ esto faltaba
const [showCategoryOptions, setShowCategoryOptions] = useState(false);
const [showSubCategoryOptions, setShowSubCategoryOptions] = useState(false);

  const violetPlaceholder = '#bcb0e4'
  const violetButton = COLORS.button

  const medios = ['efectivo', 'mp', 'transferencia'];
  const lugares = ['escuela', 'negocio'];
  const categories = ['escuela', 'colonia', 'highschool'];
  const subCategories = ['intermedios', 'adultos', 'mini', 'kids', 'highshchool'];
  const { width } = Dimensions.get('window');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setFecha(selectedDate);
  };



  const handleSubmit = async () => {

    const esNuevoCurso = tipoCurso === 'nuevo';
    const cantidadClases = esNuevoCurso ? parseInt(clases) || 0 : 0;
    const montoTotalCurso = esNuevoCurso ? parseFloat(total) || 0 : 0;
    const paidAmount = parseFloat(monto) || 0;

    if (esNuevoCurso && (!clases || !total || !monto)) {
      alert('Complete todos los campos obligatorios del curso y pago.');
      return;
    }

    if (!esNuevoCurso && !monto) {
      alert('Complete el monto del pago.');
      return;
    }

    const observation = esNuevoCurso
      ? `${detalle ? detalle + ' - ' : ''}Nuevo curso (${cantidadClases} clases)`
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
     // category,
      //sub_category: 'intermedios',
      category: selectedCategory,
sub_category: selectedSubCategory,
    };

    try {
      await api.post('/class_courses.php', courseData, { params: { method: 'post' } });
      onClose();
      onSuccess?.();

      // reset campos
      setMonto('');
      setClases('');
      setTotal('');
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
        <View style={[styles.bottomSheet, { height: '85%', width: width }]}>
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.studentName}>{firstName} {lastName}</Text>

            <Text style={styles.title}>Nuevo Pago</Text>
          </View>

          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 20 }}
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

            <View style={styles.row}>
              <TouchableOpacity onPress={() => setShowCategoryOptions(!showCategoryOptions)} style={{ flex: 1, marginRight: 8 }}>
                <TextInput
                  label="Categoría"
                  value={selectedCategory}
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowSubCategoryOptions(!showSubCategoryOptions)} style={{ flex: 1 }}>
                <TextInput
                  label="Subcategoría"
                  value={selectedSubCategory}
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                />
              </TouchableOpacity>
            </View>

            {showCategoryOptions && (
                <View style={styles.dropdown}>
                  {categories.map(c => (
                    <TouchableOpacity key={c} style={styles.dropdownItem} onPress={() => {
                      setSelectedCategory(c);
                      setShowCategoryOptions(false);
                    }}>
                      <Text>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {showSubCategoryOptions && (
                <View style={styles.dropdown}>
                  {subCategories.map(sc => (
                    <TouchableOpacity key={sc} style={styles.dropdownItem} onPress={() => {
                      setSelectedSubCategory(sc);
                      setShowSubCategoryOptions(false);
                    }}>
                      <Text>{sc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}


            {/* Fecha y Lugar */}
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flex: 1, marginRight: 8 }}>
                <TextInput
                  label="Fecha"
                  value={fecha.toLocaleDateString()}
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                 
                  left={<TextInput.Icon icon="calendar" color={violetButton} size={22} />}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowLugarOptions(!showLugarOptions)} style={{ flex: 1 }}>
                <TextInput
                  label="Lugar de pago"
                  value={lugar}
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                  left={<TextInput.Icon icon="map-marker" color={violetButton} size={22}/>}
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
              <DateTimePicker
                value={fecha}
                mode="date"
                display="calendar"
                onChange={handleDateChange}
              />
            )}
        


            {/* Curso 
            <View style={[styles.row, { justifyContent: 'flex-start', marginVertical: 10 }]}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setTipoCurso('nuevo')}>
                <View style={[styles.checkbox, tipoCurso === 'nuevo' && styles.checked]} />
                <Text style={styles.checkboxLabel}>Curso nuevo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxContainer, { marginLeft: 20 }]} onPress={() => { setTipoCurso('cta'); setClases(''); setTotal(''); }}>
                <View style={[styles.checkbox, tipoCurso === 'cta' && styles.checked]} />
                <Text style={styles.checkboxLabel}>A cta</Text>
              </TouchableOpacity>
            </View>*/}

            {tipoCurso === 'nuevo' && (
              <View style={styles.row}>
                <TextInput
                  label="Cantidad de clases"
                  mode="outlined"
                  keyboardType="numeric"
                  value={clases}
                  onChangeText={setClases}
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                  style={styles.input}
                />
                <TextInput
                  label="Valor total del curso"
                  mode="outlined"
                  keyboardType="numeric"
                  value={total}
                  onChangeText={setTotal}
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                  style={styles.input}
                />
              </View>
            )}

            {/* Monto y Método */}
            <View style={styles.row}>
              <TextInput
                label="Monto a abonar"
                mode="outlined"
                keyboardType="numeric"
                value={monto}
                onChangeText={setMonto}
                outlineColor={violetPlaceholder}
                activeOutlineColor={violetButton}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowMetodoOptions(!showMetodoOptions)} style={{ flex: 1 }}>
                <TextInput
                  label="Método"
                  value={metodo}
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  outlineColor={violetPlaceholder}
                  activeOutlineColor={violetButton}
                  style={styles.input}
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
              label="Observación"
              value={detalle}
              onChangeText={setDetalle}
              theme={{
                colors: {
                  placeholder: COLORS.ligthLetter, // 👈 color del placeholder
                  text: COLORS.darkLetter,         // 👈 color del texto escrito
                }
              }}
              mode="outlined"
              outlineColor={violetPlaceholder}
              activeOutlineColor={violetButton}
              multiline
              style={[styles.input, { height: 60 }]}
            />

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

const styles = StyleSheet.create({
  bottomSheet: { 
    backgroundColor: COLORS.backgroundVioletClear, 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16, 
    padding: 20,
    marginBottom: 0,   
  },
  dragHandle: { width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 2.5, alignSelf: 'center', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  input: { flex: 1, marginVertical: 4, marginRight: 8, borderRadius: 10, },
  dropdown: { position: 'absolute', width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, zIndex: 10 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  cancelButton: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, borderRadius: 8 },
  submitButton: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: COLORS.buttonClear, borderRadius: 8 },
  buttonText: { color: COLORS.buttonClearLetter, fontSize: 14 },
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
    backgroundColor: COLORS.buttonClear,
    alignItems: 'center',
  },
  
  segmentActive: {
    backgroundColor: COLORS.button,
  },
  segmentText: {
    color: COLORS.buttonClearLetter,
    fontFamily: 'Poppins_500Medium',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    color: COLORS.darkLetter3,
    fontFamily: 'OpenSans-Light'
  },
  studentName: { fontSize: 16, color: COLORS.darkLetter3, marginBottom: 4, textAlign: 'center',   fontFamily: 'OpenSans-Regular' },

  
});
