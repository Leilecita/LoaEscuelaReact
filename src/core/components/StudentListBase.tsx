import React, { useState } from 'react'
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Linking,
} from 'react-native'
import { IconButton } from 'react-native-paper'
import type { Student } from '../../containers/students/services/studentService'

type Props = {
  students: Student[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  loadMore: () => void
  reload: () => void
  searchText: string
  onSearchTextChange: (text: string) => void
}

export const StudentListBase: React.FC<Props> = ({
  students,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
  searchText,
  onSearchTextChange,
}) => {
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedStudentId((prev) => (prev === id ? null : id))
  }

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.nombre} ${student.apellido}`.toLowerCase()
    return fullName.includes(searchText.toLowerCase())
  })

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>{error}</Text>
        <Text onPress={reload} style={{ color: '#007AFF' }}>
          Reintentar
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Buscar alumno..."
        value={searchText}
        onChangeText={onSearchTextChange}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.student_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.name} onPress={() => toggleExpand(item.student_id)}>
              {item.nombre} {item.apellido}
            </Text>
            <Text>DNI: {item.dni}</Text>

            {expandedStudentId === item.student_id && (
              <View style={styles.extraInfo}>
                {item.nombre_mama && (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactName}>{item.nombre_mama}</Text>
                    <View style={styles.icons}>
                      {item.tel_mama ? (
                        <>
                          <IconButton
                            icon="phone"
                            size={20}
                            iconColor="#007AFF"
                            onPress={() => Linking.openURL(`tel:${item.tel_mama}`)}
                            style={styles.iconButton}
                          />
                          <IconButton
                            icon="whatsapp"
                            size={20}
                            iconColor="#25D366"
                            onPress={() =>
                              Linking.openURL(`https://wa.me/${item.tel_mama.replace(/\D/g, '')}`)
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

                {item.nombre_papa && (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactName}>{item.nombre_papa}</Text>
                    <View style={styles.icons}>
                      {item.tel_papa ? (
                        <>
                          <IconButton
                            icon="phone"
                            size={20}
                            iconColor="#007AFF"
                            onPress={() => Linking.openURL(`tel:${item.tel_papa}`)}
                            style={styles.iconButton}
                          />
                          <IconButton
                            icon="whatsapp"
                            size={20}
                            iconColor="#25D366"
                            onPress={() =>
                              Linking.openURL(`https://wa.me/${item.tel_papa.replace(/\D/g, '')}`)
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
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 10 }} /> : null}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
