import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Pressable, Text } from 'react-native';
import { Avatar, Divider, Text as PaperText } from 'react-native-paper';
import { useIncomesByStudent } from '../../incomes/hooks/useIncomesByStudent';
import ItemIncomeStudentView from '../../../containers/incomes/components/ItemIncomeStudentView';
import { RootStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { getResumenStudent } from '../../students/services/studentService'; 
import { usePresentsByStudents } from '../hooks/usePresentsByStudents';
import { ItemPresentStudentView } from '../../../containers/students/components/ItemPresentStudentView';
import { PaymentModal } from '../../../core/components/PaymentModal'; // importa tu modal
import { COLORS } from '@core';

type InformationStudentRouteProp = RouteProp<RootStackParamList, 'InformationStudent'>;
type Props = { route: InformationStudentRouteProp; };

type Resumen = {
  cant_buyed_classes: number;
  cant_presents: number;
  tot_paid_amount: number;
  tot_amount: number;
};

export default function InformationStudentScreen({ route }: Props) {
  const { studentId, firstName, lastName, category } = route.params || {};
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  if (!studentId) return <PaperText>Estudiante no definido</PaperText>;

  const { presents, loading: loadingPresents, reload: reloadPresents } = usePresentsByStudents(studentId);
  const { incomes, loading, loadingMore, loadMore, reload } = useIncomesByStudent({ studentId });
  const fetchResumen = async () => {
    try {
      setLoadingResumen(true);
      const data = await getResumenStudent(studentId);
      setResumen(data[0]);
    } catch (err) {
      console.error('Error al cargar resumen', err);
    } finally {
      setLoadingResumen(false);
    }
  };

  useEffect(() => {
    fetchResumen(); // Llamada inicial
  }, [studentId]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar.Text size={48} label={firstName[0]} style={{ backgroundColor: '#80cbc4' }} />
          <View style={styles.textContainer}>
            <PaperText style={styles.name}>
              {firstName} {lastName}
            </PaperText>
            <PaperText style={styles.category}>{category}</PaperText>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.resumenContainer}>
          {loadingResumen ? <ActivityIndicator size="small" /> : resumen ? (
            <>
              <View style={styles.rowResumen}>
                <PaperText style={styles.label}>Total clases compradas</PaperText>
                <PaperText style={styles.value}>{resumen.cant_buyed_classes}</PaperText>
              </View>
              <View style={styles.rowResumen}>
                <PaperText style={styles.label}>Total clases tomadas</PaperText>
                <PaperText style={styles.value}>{resumen.cant_presents}</PaperText>
              </View>
              <Divider style={{ marginVertical: 4 }} />
              <View style={styles.rowResumen}>
                <PaperText style={styles.label}>Total abonado</PaperText>
                <PaperText style={styles.value}>$ {resumen.tot_paid_amount}</PaperText>
              </View>
              <View style={styles.rowResumen}>
                <PaperText style={styles.label}>Total deuda</PaperText>
                <PaperText style={styles.value}>$ {resumen.tot_amount - resumen.tot_paid_amount}</PaperText>
              </View>
            </>
          ) : (
            <PaperText>No se pudo cargar el resumen</PaperText>
          )}
        </View>

        {/* Clases tomadas */}
        <View style={{ marginHorizontal: 8, marginTop: 16, flex: 1 }}>
          <PaperText style={{ fontWeight: 'bold', marginBottom: 8 }}>Clases tomadas</PaperText>
          {loadingPresents && presents.length === 0 ? <ActivityIndicator size="large" /> : (
            <FlatList
              data={presents}
              keyExtractor={(item, index) => (item.present_id ?? index).toString()}
              renderItem={({ item, index }) => (
                <ItemPresentStudentView
                  item={item}
                  index={index}
                  previousItem={presents[index - 1]}
                />
              )}
              refreshing={loadingPresents}
              onRefresh={reloadPresents}
            />
          )}
        </View>

        {/* Pagos realizados */}
        <View style={{ marginHorizontal: 8, marginTop: 16, flex: 1 }}>
          <PaperText style={{ fontWeight: 'bold', marginBottom: 8 }}>Pagos realizados</PaperText>
          {loading && incomes.length === 0 ? <ActivityIndicator size="large" /> : (
            <FlatList
              data={incomes}
              keyExtractor={(item, index) => (item.income_id ?? index).toString()}
              renderItem={({ item, index }) => (
                <ItemIncomeStudentView
                  income_created={item.created ?? ''}
                  description={item.detail ?? ''}
                  payment_method={item.payment_method ?? ''}
                  category={item.category ?? ''}
                  detail={item.detail ? item.detail.toString() : ''}
                  amount={item.amount ?? 0}
                  income_id={item.income_id ?? index}
                  showDateHeader={index === 0 || (item.created?.split('T')[0] ?? '') !== (incomes[index - 1]?.created?.split('T')[0] ?? '')}
                />
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
              refreshing={loading}
              onRefresh={reload}
            />
          )}
        </View>
      </View>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>cargar{'\n'}pago</Text>
      </Pressable>

      {/* Modal */}
      <PaymentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        studentId={studentId}
        firstName={firstName}
        lastName={lastName}
        onSuccess={() => {
          reload();        // recargar pagos
          reloadPresents(); // recargar presentes
          fetchResumen();  // recargar resumen
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgb(232, 237, 189)' },
  headers: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },

  header: {
    flexDirection: 'row', // avatar y texto al lado
    alignItems: 'center', // centra verticalmente
    gap: 10, // espacio entre avatar y textos
    padding: 10,
  },
  textContainer: {
    flexDirection: 'column', // nombre arriba, categoría abajo
  },
 
  category: {
    fontSize: 14,
    color: '#000', // color más claro
  },
  name: { fontFamily: 'OpenSans-Light', fontSize: 20, fontWeight: 'bold', color: '#000' },
  resumenContainer: { backgroundColor: '#f8bbd0', padding: 16 },
  rowResumen: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  label: { fontFamily: 'OpenSans-Regular', fontSize: 14, color: '#4e342e' },
  value: { fontFamily: 'OpenSans-Regular', fontSize: 14, color: '#000' },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: COLORS.buttonClear,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  
  fabText: {
    color: COLORS.buttonClearLetter,
    textAlign: 'center',
    fontSize: 14,
  },
});
