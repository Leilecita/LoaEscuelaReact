import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Avatar, Button, Divider, Text as PaperText } from 'react-native-paper';
import { useIncomesByStudent } from '../../incomes/hooks/useIncomesByStudent';
import ItemIncomeStudentView from '../../../containers/incomes/components/ItemIncomeStudentView';
import { RootStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { getResumenStudent } from '../../students/services/studentService'; 
import { usePresentsByStudents } from '../hooks/usePresentsByStudents';
import { ItemPresentStudentView } from '../../../containers/students/components/ItemPresentStudentView';


type InformationStudentRouteProp = RouteProp<RootStackParamList, 'InformationStudent'>;
type Props = { route: InformationStudentRouteProp };

type Resumen = {
  cant_buyed_classes: number;
  cant_presents: number;
  tot_paid_amount: number;
  tot_amount: number;
};

export default function InformationStudentScreen({ route }: Props) {
  //const studentId = route.params?.studentId;
  const { studentId, firstName, lastName } = route.params || {};
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loadingResumen, setLoadingResumen] = useState(false);

  if (!studentId) return <PaperText>Estudiante no definido</PaperText>;

  const { presents, loading: loadingPresents, error: errorPresents, reload: reloadPresents } =
  usePresentsByStudents(studentId);


  const { incomes, loading, loadingMore, loadMore, reload } = useIncomesByStudent({ studentId });

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        setLoadingResumen(true);
        const data = await getResumenStudent(studentId);
        setResumen(data[0]); // el back devuelve lista, agarro el primero
      } catch (err) {
        console.error('Error al cargar resumen', err);
      } finally {
        setLoadingResumen(false);
      }
    };

    fetchResumen();
  }, [studentId]);

  return (
    <View style={styles.container}>
      {/* Header con avatar */}
      <View style={styles.header}>
        <Avatar.Text size={48} label="A" style={{ backgroundColor: '#80cbc4' }} />
        <PaperText style={styles.name}>{firstName} {lastName}</PaperText>
      </View>

      {/* Resumen */}
      <View style={styles.resumenContainer}>
        {loadingResumen ? (
          <ActivityIndicator size="small" />
        ) : resumen ? (
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
              <PaperText style={styles.value}>
                $ {resumen.tot_amount - resumen.tot_paid_amount}
              </PaperText>
            </View>
          </>
        ) : (
          <PaperText>No se pudo cargar el resumen</PaperText>
        )}
      </View>

        {/* Lista de presentes */}
          <View style={{ marginHorizontal: 8, marginTop: 16, flex: 1 }}>
            <PaperText style={{ fontWeight: 'bold', marginBottom: 8 }}>Clases tomadas</PaperText>
            {loadingPresents && presents.length === 0 ? (
              <ActivityIndicator size="large" />
            ) : presents.length === 0 ? (
              <PaperText>No hay presentes disponibles</PaperText>
            ) : (
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
              ListEmptyComponent={() =>
                !loadingPresents ? <PaperText>No hay presentes disponibles</PaperText> : null
              }
            />
            

            )}
          </View>


      {/* Lista de pagos */}
      <View style={{ marginHorizontal: 8, marginTop: 16, flex: 1 }}>
        <PaperText style={{ fontWeight: 'bold', marginBottom: 8 }}>Pagos realizados</PaperText>
        {loading && incomes.length === 0 ? (
          <ActivityIndicator size="large" />
        ) : incomes.length === 0 ? (
          <PaperText>No hay pagos disponibles</PaperText>
        ) : (
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
                showDateHeader={
                  index === 0 ||
                  (item.created?.split('T')[0] ?? '') !==
                    (incomes[index - 1]?.created?.split('T')[0] ?? '')
                }
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d4e157' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  name: { fontFamily: 'OpenSans-Light', fontSize: 20, fontWeight: 'bold', color: '#000' },
  resumenContainer: { backgroundColor: '#f8bbd0', padding: 16 },
  rowResumen: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  label: { fontFamily: 'OpenSans-Regular', fontSize: 14, color: '#4e342e' },
  value: { fontFamily: 'OpenSans-Regular', fontSize: 14, color: '#000' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#ad1457' },
});
