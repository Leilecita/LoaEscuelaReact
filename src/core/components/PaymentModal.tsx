// src/core/components/PaymentModal.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native'
import Modal from 'react-native-modal'
import DateTimePicker from '@react-native-community/datetimepicker'
import { COLORS } from 'core/constants'

type PaymentModalProps = {
  visible: boolean
  onClose: () => void
  onSubmit: (data: {
    fecha: Date
    monto: string
    clases: string
    lugar: string
    metodo: '💵' | '🏦' | '📱'
    detalle: string
  }) => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [fecha, setFecha] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [monto, setMonto] = useState('')
  const [clases, setClases] = useState('')
  const [lugar, setLugar] = useState('')
  const [metodo, setMetodo] = useState<'💵' | '🏦' | '📱'>('💵')
  const [detalle, setDetalle] = useState('')

  const handleSubmit = () => {
    if (!monto || !clases || !lugar) {
      alert('Complete todos los campos obligatorios')
      return
    }
    onSubmit({ fecha, monto, clases, lugar, metodo, detalle })
    // Reset campos
    setMonto('')
    setClases('')
    setLugar('')
    setDetalle('')
    setMetodo('💵')
    setFecha(new Date())
    onClose()
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) setFecha(selectedDate)
  }

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Nuevo Pago</Text>

        {/* Fecha */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, { marginBottom: 10 }]}
        >
          <Text>{fecha.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Renglon: Monto | Clases | Lugar */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="Monto"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="Clases"
            keyboardType="numeric"
            value={clases}
            onChangeText={setClases}
          />
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="Lugar"
            value={lugar}
            onChangeText={setLugar}
          />
        </View>

        {/* Método de pago simplificado */}
        <View style={styles.metodoContainer}>
          {['💵', '🏦', '📱'].map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.metodoButton,
                metodo === m && styles.metodoButtonSelected,
              ]}
              onPress={() => setMetodo(m as '💵' | '🏦' | '📱')}
            >
              <Text
                style={[
                  styles.metodoText,
                  metodo === m && styles.metodoTextSelected,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Detalle */}
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Detalle"
          multiline
          value={detalle}
          onChangeText={setDetalle}
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
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  metodoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metodoButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metodoButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  metodoText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  metodoTextSelected: {
    color: '#fff',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  submitButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
