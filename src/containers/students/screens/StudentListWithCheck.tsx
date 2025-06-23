import React, { useEffect, useState } from 'react'
import { FlatList, Text, View, ActivityIndicator, StyleSheet, Button, Alert, Linking } from 'react-native'
import { Checkbox, Chip, Icon, IconButton, Surface, TextInput } from 'react-native-paper'
import { useStudent } from '../../../../src/core/hooks/useStudent'
import type { Student } from '../services/studentService'
import { guardarPresente, usePresentCount } from '../services/studentService'
import { deletePresente } from '../services/studentService'
import { formatDateToFullDateTime, formatDateToYYYYMMDD, getCurrentLocalDate, getCurrentLocalDateTime } from 'helpers/dateHelper'
import { FilterBar } from 'core/components/FilterToolbar'
import { Category, Subcategoria } from 'types'

type Props = {
    category: Category,
    subcategoria: Subcategoria
}

export const StudentListWithCheck: React.FC<Props> = ({ category, subcategoria }) => {
    const [searchText, setSearchText] = useState('');

const [showOnlyPresent, setShowOnlyPresent] = useState(false);
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    //const togglePresentFilter = () => setShowOnlyPresent((prev) => !prev);
    //const toggleSortOrder = () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    const [searchInput, setSearchInput] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchInput);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchInput]);

    useEffect(() => {
        updateQuery(debouncedQuery);
    }, [debouncedQuery]);

    const [expandedStudentId, setExpandedStudentId] = React.useState<number | null>(null)
    const toggleExpand = (id: number) => {
        setExpandedStudentId(prev => (prev === id ? null : id))
    }
    
    const [selectedDate, setSelectedDate] = useState(new Date());

    const only_date = formatDateToYYYYMMDD(selectedDate);
    const today = formatDateToFullDateTime(selectedDate);

    const [refreshSignal, setRefreshSignal] = React.useState(false)

    const { countPresentes, loading: loadingPresentes } = usePresentCount(category, subcategoria, only_date, refreshSignal)

    const forzarRefrescoContador = () => {
        setRefreshSignal((prev) => !prev)
    }

    const eliminarPresente = (student: Student) => {
        Alert.alert(
          'Confirmar',
          `¿Seguro que deseas sacar el presente a ${student.nombre} ${student.apellido}?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sí, eliminar',
              style: 'destructive',
              onPress: async () => {
                try {
                  if (!student.planilla_presente_id || student.planilla_presente_id === -1) {
                    Alert.alert('Error', 'No hay presente registrado para eliminar.');
                    return;
                  }
      
                  const res = await deletePresente(student.planilla_presente_id);
                  if (res.result && res.result !== 'success') {
                    Alert.alert('Error', 'No se pudo eliminar el presente.');
                    return;
                  }
      
                  forzarRefrescoContador();
      
                  setStudents((prev) =>
                    prev.map((s) => {
                      if (s.student_id !== student.student_id) return s;
      
                      // Copiamos y actualizamos el primer taken_classes si existe
                      const updatedTakenClasses = [...(s.taken_classes || [])];
                      if (updatedTakenClasses.length > 0 && updatedTakenClasses[0].cant_presents > 0) {
                        updatedTakenClasses[0] = {
                          ...updatedTakenClasses[0],
                          cant_presents: updatedTakenClasses[0].cant_presents - 1,
                        };
                      }
      
                      return {
                        ...s,
                        presente: 'no',
                        planilla_presente_id: -1,
                        taken_classes: updatedTakenClasses,
                      };
                    })
                  );
                } catch (e: any) {
                  console.error('Error al eliminar presente:', e.response ?? e.message ?? e);
                  Alert.alert('Error', 'No se pudo eliminar el presente.');
                }
              },
            },
          ]
        );
      };
      

    const {
        students,
        loading,
        loadingMore,
        error,
        loadMore,
        reload,
        setStudents,
        planillaId,   
        updateQuery,
    } = useStudent(category, subcategoria, only_date, showOnlyPresent, sortOrder)


    const togglePresente = async (student: Student) => {
        if (!planillaId) {
            Alert.alert('Error', 'No se pudo determinar la planilla.');
            return;
        }

        const nuevoEstado = student.presente !== 'si';

        try {
            const responseData = await guardarPresente({
                alumno_id: student.student_id,
                planilla_id: planillaId,
                fecha_presente: today,
            });

            // Crear una copia del student y sus taken_classes
            const updatedStudent = {
                ...student,
                presente: nuevoEstado ? 'si' : 'no',
                planilla_presente_id: nuevoEstado ? responseData.id || -1 : -1,
                taken_classes: student.taken_classes
                    ? student.taken_classes.map((tc, index) => {
                        if (index === 0) {
                            return {
                                ...tc,
                                cant_presents: tc.cant_presents + (nuevoEstado ? 1 : -1),
                            };
                        }
                        return tc;
                    })
                    : [],
            };

            forzarRefrescoContador();

            setStudents((prev) =>
                prev.map((s) =>
                    s.student_id === student.student_id ? updatedStudent : s
                )
            );
        } catch (e) {
            Alert.alert('Error', 'No se pudo actualizar la asistencia');
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.center} size="large" />
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ marginBottom: 10 }}>{error}</Text>
                <Button title="Reintentar" onPress={reload} />
            </View>
        )
    }

    if (!planillaId) {
        return (
            <View style={styles.center}>
                <Text>Cargando datos de la planilla...</Text>
                <ActivityIndicator size="small" />
            </View>
        )
    }

     // Filtrar estudiantes según searchText
    const filteredStudents = students.filter((student) => {
    const fullName = `${student.nombre} ${student.apellido}`.toLowerCase();
    const searchLower = searchText.toLowerCase();
    return fullName.includes(searchLower);
  });

    return (

        <View style={{ flex: 1 }}>

    <FilterBar
        date={selectedDate}
        onDateChange={setSelectedDate}
        showOnlyPresent={showOnlyPresent}
        onTogglePresent={() => setShowOnlyPresent((prev) => !prev)}
        sortOrder={sortOrder}
        onToggleSortOrder={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        onRefresh={reload}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        countPresentes={countPresentes}  // <--- Aquí
      />

            <FlatList
                data={filteredStudents}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item, index) => `${item.planilla_alumno_id}-${item.student_id}-${index}`}


                renderItem={({ item }) => {

                    const totalClasesTomadas = item.taken_classes && item.taken_classes.length > 0
                        ? item.taken_classes[0].cant_presents
                        : 0;

                    const isExpanded = expandedStudentId === item.student_id;

                    return (
                        
                        <View style={styles.itemContainer_check}>
                            
                            
                            <View style={styles.row}>
                                <View style={styles.infoContainer}>
                                    <Text
                                        style={styles.name}
                                        onPress={() => toggleExpand(item.student_id)} // al tocar el nombre, se expande
                                    >
                                        {item.nombre} {item.apellido}
                                    </Text>
                                    <Text>DNI: {item.dni}</Text>
                                </View>
                                <Text style={{ marginRight: 8, color: '#666', fontSize: 12 }}>
                                    {totalClasesTomadas}
                                </Text>
                                <View style={styles.rightBox}>
                                    <Checkbox
                                        status={item.presente === 'si' ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            if (item.presente === 'si') {
                                                eliminarPresente(item);
                                            } else {
                                                togglePresente(item);
                                            }
                                        }}
                                        color="black"
                                        uncheckedColor="transparent"
                                    />
                                </View>
                            </View>

                            {isExpanded && (
                                <View style={styles.extraInfo}>
                                    {item.nombre_mama ? (
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
                                    ) : null}

                                    {item.nombre_papa ? (
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
                                    ) : null}
                                </View>

                            )}
                        </View>
                    );
                }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 10 }} /> : null}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
           
        </View>
    );


}

const styles = StyleSheet.create({
    itemContainer_check: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    presentesContainer: {
        backgroundColor: '#EFEFEF',
        padding: 12,
        borderRadius: 8,
        margin: 12,
        alignItems: 'center',
    },
    presentesText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    presentesChip: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        borderRadius: 8,
        paddingHorizontal: 1,
        paddingVertical: 1,
        elevation: 2,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
      },
   
    extraInfo: {
        marginTop: 10,
        paddingLeft: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 8,
    },
    mamaTitle: {
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 5,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    icon: {
        marginRight: 16,
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
    iconButton: {
        marginLeft: 4,
    },
    noPhone: {
        color: '#999',
        fontSize: 14,
    },
   
})
