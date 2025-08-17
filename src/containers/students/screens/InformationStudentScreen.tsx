import React from 'react';
import { View, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Avatar, Button, Divider, Text as PaperText } from 'react-native-paper';
import { useIncomesByStudent } from '../../incomes/hooks/useIncomesByStudent';
import ItemIncomeView from '../../../containers/incomes/components/ItemIncomeView';
import { RootStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';

type InformationStudentRouteProp = RouteProp<RootStackParamList, 'InformationStudent'>;
type Props = { route: InformationStudentRouteProp };

export default function InformationStudentScreen({ route }: Props) {
  const studentId = route.params?.studentId;

  if (!studentId) return <PaperText>Estudiante no definido</PaperText>;

  const { incomes, loading, loadingMore, loadMore, reload } = useIncomesByStudent({ studentId });

  return (
    <View style={styles.container}>
        {/* Header con avatar */}
        <View style={styles.header}>
          <Avatar.Text size={48} label="A" style={{ backgroundColor: '#80cbc4' }} />
          <PaperText style={styles.name}>Nombre del estudiante</PaperText>
        </View>

        {/* Resumen */}
        <View style={styles.resumenContainer}>
          <View style={styles.rowResumen}>
            <PaperText style={styles.label}>Total clases compradas</PaperText>
            <PaperText style={styles.value}>0</PaperText>
          </View>
          <View style={styles.rowResumen}>
            <PaperText style={styles.label}>Total clases tomadas</PaperText>
            <PaperText style={styles.value}>0</PaperText>
          </View>
          <Divider style={{ marginVertical: 4 }} />
          <View style={styles.rowResumen}>
            <PaperText style={styles.label}>Total abonado</PaperText>
            <PaperText style={styles.value}>$ 0</PaperText>
          </View>
          <View style={styles.rowResumen}>
            <PaperText style={styles.label}>Total deuda</PaperText>
            <PaperText style={styles.value}>$ 0</PaperText>
          </View>
        </View>

        {/* Lista de pagos */}
        <View style={{ marginHorizontal: 8, marginTop: 16 }}>
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
                <ItemIncomeView
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

      {/* Botón flotante */}
      <Button
        mode="contained"
        style={styles.fab}
        onPress={() => {}}
      >
        Crear curso nuevo
      </Button>
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
