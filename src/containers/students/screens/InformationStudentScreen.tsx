import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Pressable, Text, ImageBackground } from 'react-native';
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
  
  const { studentId, firstName, lastName, category, sub_category } = route.params || {};
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

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedDateCapital = formattedDate.replace(/(\d{2}) de (\w{3}) de (\d{4})/, (_, d, m, y) => `${d} de ${m.charAt(0).toUpperCase() + m.slice(1)} ${y}`);


  return (
    <ImageBackground
      source={require('../../../../assets/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Avatar.Text size={48} color= {COLORS.white} label={firstName[0]} style={{ backgroundColor: COLORS.mediumGreenColor }} />
            <View style={styles.textContainer}>
              <PaperText style={styles.name}>
                {firstName} {lastName}
              </PaperText>
              <PaperText style={styles.category}>{category}</PaperText>
            </View>
          </View>

          {/* Resumen */}
          <View style={styles.headerResum}>
            <Text style={styles.headerText}>Resumen al {formattedDate}</Text>
          </View>
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
            <View style={styles.headerTitle}>
              <Text style={{  marginLeft: 16,  fontFamily: 'OpenSans-Regular', color: COLORS.darkLetter }}>Clases tomadas</Text>
            </View>
            {loadingPresents && presents.length === 0 ? <ActivityIndicator size="large" /> : (
              <View style={styles.resumenContainerClases}>
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
              </View>
            )}
          </View>

          {/* Pagos realizados */}
          <View style={{ marginHorizontal: 8, marginTop: 16, flex: 1 }}>
          <View style={styles.headerTitle}>
              <Text style={{  marginLeft: 16, fontFamily: 'OpenSans-Regular', color: COLORS.darkLetter }}>Pagos realizados</Text>
            </View>
            {loading && incomes.length === 0 ? <ActivityIndicator size="large" /> : (
              <View style={styles.resumenContainerClases}>
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
              </View>
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
          category={category}
          sub_category={sub_category}
          lastName={lastName}
          onSuccess={() => {
            reload();        // recargar pagos
            reloadPresents(); // recargar presentes
            fetchResumen();  // recargar resumen
          }}
          
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    fontSize: 16,
    color: COLORS.darkLetter3, // color más claro
    fontFamily: 'OpenSans-Light',
  },
  name: { fontFamily: 'OpenSans-Light', fontSize: 20, fontWeight: 'bold', color: '#000' },
  resumenContainer: { backgroundColor: 'rgba(173, 209, 181, 0.37)', padding: 16 },

  resumenContainerClases: 
  { backgroundColor:'rgba(218, 227, 138, 0.43)',  height: 280 },

  rowResumen: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  label: { fontFamily: 'OpenSans-Regular', fontSize: 15, color: COLORS.darkLetter2 },
  value: { fontFamily: 'OpenSans-Regular', fontSize: 15, color: COLORS.darkLetter2 },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: COLORS.lightGreenColor,
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
  headerText: { fontFamily: 'OpenSans-Regular', fontSize: 16, color: '#ffff' },
  headerResum: {
    flexDirection: 'row', // avatar y texto al lado
    alignItems: 'center', // centra verticalmente
    backgroundColor:   '#88bfb9',
    paddingLeft: 16,
    paddingBottom: 6,
    paddingTop: 6,
    marginTop:4,
  },

  headerTitle: {
    flexDirection: 'row', // avatar y texto al lado
    alignItems: 'center', // centra verticalmente
    backgroundColor:   'rgba(226,223,50,255)',
    paddingBottom: 6,
    paddingTop: 6,
    marginHorizontal:-8,
    marginTop:4,
  },
  background: {
    flex: 1,
  },
});
