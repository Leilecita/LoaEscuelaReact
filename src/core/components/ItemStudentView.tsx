import React from 'react'
import { View, Text, Linking, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import type { Student } from '../../containers/students/services/studentService'

type Props = {
  student: Student
  isExpanded: boolean
  onToggleExpand: () => void
}

export const ItemStudentView: React.FC<Props> = ({
  student,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.name} onPress={onToggleExpand}>
        {student.nombre} {student.apellido}
      </Text>
      <Text>DNI: {student.dni}</Text>

      {isExpanded && (
        <View style={styles.extraInfo}>
          {student.nombre_mama && (
            <View style={styles.contactRow}>
              <Text style={styles.contactName}>{student.nombre_mama}</Text>
              <View style={styles.icons}>
                {student.tel_mama ? (
                  <>
                    <IconButton
                      icon="phone"
                      size={20}
                      iconColor="#007AFF"
                      onPress={() => Linking.openURL(`tel:${student.tel_mama}`)}
                      style={styles.iconButton}
                    />
                    <IconButton
                      icon="whatsapp"
                      size={20}
                      iconColor="#25D366"
                      onPress={() =>
                        Linking.openURL(`https://wa.me/${student.tel_mama.replace(/\D/g, '')}`)
                      }
                      style={styles.iconButton}
                    />
                  </>
                ) : (
                  <Text style={styles.noPhone}>Sin teléfono</Text>
                )}
              </View>
            </View>
          )}

          {student.nombre_papa && (
            <View style={styles.contactRow}>
              <Text style={styles.contactName}>{student.nombre_papa}</Text>
              <View style={styles.icons}>
                {student.tel_papa ? (
                  <>
                    <IconButton
                      icon="phone"
                      size={20}
                      iconColor="#007AFF"
                      onPress={() => Linking.openURL(`tel:${student.tel_papa}`)}
                      style={styles.iconButton}
                    />
                    <IconButton
                      icon="whatsapp"
                      size={20}
                      iconColor="#25D366"
                      onPress={() =>
                        Linking.openURL(`https://wa.me/${student.tel_papa.replace(/\D/g, '')}`)
                      }
                      style={styles.iconButton}
                    />
                  </>
                ) : (
                  <Text style={styles.noPhone}>Sin teléfono</Text>
                )}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    marginTop: 6,
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
  iconButton: {
    marginLeft: 4,
  },
  noPhone: {
    color: '#999',
    fontSize: 14,
  },
})
