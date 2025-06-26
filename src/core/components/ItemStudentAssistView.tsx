import React from 'react'
import { View, Text, Linking, StyleSheet } from 'react-native'
import { Checkbox, IconButton } from 'react-native-paper'
import type { Student } from '../../containers/students/services/studentService'

type Props = {
  student: Student
  isExpanded: boolean
  onToggleExpand: () => void
  togglePresente: (student: Student) => void
  eliminarPresente: (student: Student) => void
}

export const ItemStudentAssistView: React.FC<Props> = ({
  student,
  isExpanded,
  onToggleExpand,
  togglePresente,
  eliminarPresente,
}) => {
  const totalClasesTomadas = student.taken_classes?.[0]?.cant_presents || 0

  return (
    <View style={styles.itemContainer_check}>
      <View style={styles.row}>
        <View style={styles.infoContainer}>
          <Text style={styles.name} onPress={onToggleExpand}>
            {student.nombre} {student.apellido}
          </Text>
          <Text>DNI: {student.dni}</Text>
        </View>
        <Text style={{ marginRight: 8, color: '#666', fontSize: 12 }}>
          {totalClasesTomadas}
        </Text>
        <View style={styles.rightBox}>
          <Checkbox
            status={student.presente === 'si' ? 'checked' : 'unchecked'}
            onPress={() =>
              student.presente === 'si'
                ? eliminarPresente(student)
                : togglePresente(student)
            }
            color="black"
            uncheckedColor="transparent"
          />
        </View>
      </View>

      {isExpanded && (
        <View style={styles.extraInfo}>
          {student.nombre_mama && (
            <ContactInfo name={student.nombre_mama} phone={student.tel_mama} />
          )}
          {student.nombre_papa && (
            <ContactInfo name={student.nombre_papa} phone={student.tel_papa} />
          )}
        </View>
      )}
    </View>
  )
}

const ContactInfo = ({
  name,
  phone,
}: {
  name: string
  phone?: string | null
}) => (
  <View style={styles.contactRow}>
    <Text style={styles.contactName}>{name}</Text>
    <View style={styles.icons}>
      {phone ? (
        <>
          <IconButton
            icon="phone"
            size={20}
            iconColor="#007AFF"
            onPress={() => Linking.openURL(`tel:${phone}`)}
          />
          <IconButton
            icon="whatsapp"
            size={20}
            iconColor="#25D366"
            onPress={() =>
              Linking.openURL(`https://wa.me/${phone.replace(/\D/g, '')}`)
            }
          />
        </>
      ) : (
        <Text style={styles.noPhone}>Sin teléfono</Text>
      )}
    </View>
  </View>
)

const styles = StyleSheet.create({
  itemContainer_check: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
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
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  extraInfo: {
    marginTop: 10,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingRight: 10,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noPhone: {
    color: '#999',
    fontSize: 14,
  },
})
