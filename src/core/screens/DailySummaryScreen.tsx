// src/containers/dailySummary/DailySummaryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ListRenderItem,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import api from '../../core/services/axiosClient';
import { DateHeader } from '../../core/components/DateHeader';
import { usePaginatedFetch } from '../../core/hooks/usePaginatedFetch';
import { Chip } from 'react-native-paper';
import { COLORS } from 'core/constants';

// ----------------------
// Tipos
// ----------------------
type ReportResumPlanilla = {
  cant_presentes: number;
  nombre_planilla: string;
};

export type ReportResumAsist = {
  tot_incomes: number;
  tot_incomes_playa: number;
  tot_incomes_negocio: number;
  tot_incomes_escuela: number;
  tot_incomes_highschool: number;
  tot_incomes_colonia: number;
  tot_presents: number;
  day: string;
  planillas: ReportResumPlanilla[];
};

type FilterOption = 'Todos' | 'Playa' | 'Negocio' | 'Presentes';

// ----------------------
// API
// ----------------------
async function fetchResumenes(page: number): Promise<ReportResumAsist[]> {
  const response = await api.get('/planillas_presentes.php', {
    params: { method: 'getDayResumPresents', page },
  });

  const dataArray = response.data.data;

  console.log('Resumenes API:', dataArray.map((d: any) => d.day));
  if (Array.isArray(dataArray)) return dataArray;
  return [];
}

// ----------------------
// Componente principal
// ----------------------
export const DailySummaryScreen: React.FC = () => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>('Todos');

  const {
    data: resumenes,
    loading,
    loadingMore,
    refreshing,
    error,
    reload,
    loadMore,
  } = usePaginatedFetch<ReportResumAsist>(fetchResumenes, []);

  // renderItem tipado
  const renderItem: ListRenderItem<ReportResumAsist> = ({ item }) => {
    const totalEscuela = item.tot_incomes_escuela;
    const totalHigh = item.tot_incomes_highschool;
    const totalColonia = item.tot_incomes_colonia;
    const totalColoniaGroup = totalHigh + totalColonia;
    const isExpanded = expandedDay === item.day;

      // Para cajas Playa/Negocio
      const showNegocio = filter === 'Todos' || filter === 'Negocio';
      const showPlaya = filter === 'Todos' || filter === 'Playa';
      const bothBoxes = showNegocio && showPlaya && filter === 'Todos';

    return (
      <View>
       
       <DateHeader
         date={item.day.includes('T') ? item.day : item.day + 'T00:00:00'}
       />

        <View style={styles.card}>

         {/* Contenedor horizontal para Playa y Negocio */}
         {(showNegocio || showPlaya) && (
            <View style={styles.totalRow}>
              {showNegocio && (
                <View style={[styles.totalBox, bothBoxes ? styles.totalBoxHalf : styles.totalBoxFull]}>
                  <Text style={styles.totalLabel}>caja negocio</Text>
                  <Text style={styles.totalValue}>${item.tot_incomes_negocio}</Text>
                </View>
              )}

              {showPlaya && (
                <View style={[styles.totalBox, bothBoxes ? styles.totalBoxHalf : styles.totalBoxFull]}>
                  <Text style={styles.totalLabel}>caja playa</Text>
                  <Text style={styles.totalValue}>${item.tot_incomes_playa}</Text>
                </View>
              )}
            </View>
          )}
          {/* Mostrar/Ocultar según filtro 
          {(filter === 'Todos' || filter === 'Negocio') && (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>caja negocio</Text>
              <Text style={styles.totalValue}>${item.tot_incomes_negocio}</Text>
            </View>
          )}

          {(filter === 'Todos' || filter === 'Playa') && (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>caja playa</Text>
              <Text style={styles.totalValue}>${item.tot_incomes_playa}</Text>
            </View>
          )}*/}

          {/* caja total solo en Todos */}
          {filter === 'Todos' && (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>caja total</Text>
              <Text style={styles.totalValue}>${item.tot_incomes}</Text>
            </View>
          )}

          {/* Detalle sectorizado solo en Todos */}
          {filter === 'Todos' && (
            <View style={styles.detailBox}>
            {/* Escuela */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Escuela</Text>
              <Text style={styles.detailValue}>${totalEscuela}</Text>
            </View>
          
            {/* Colonia con expand/collapse */}
            <TouchableOpacity onPress={() => setExpandedDay(isExpanded ? null : item.day)}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Colonia</Text>
                <Text style={styles.detailValue}>${totalColoniaGroup}</Text>
              </View>
            </TouchableOpacity>
          
            {/* Subdetalles */}
            {isExpanded && (
              <View style={styles.subDetailBox}>
                <View style={styles.detailRow}>
                  <Text style={styles.subDetailLabel}>Highschool</Text>
                  <Text style={styles.subDetailValue}>${totalHigh}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.subDetailLabel}>Colonia</Text>
                  <Text style={styles.subDetailValue}>${totalColonia}</Text>
                </View>
              </View>
            )}
          </View>
          
          )}

          {/* Presentes solo si filtro = Todos o Presentes */}
          {(filter === 'Todos' || filter === 'Presentes') && (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Presentes</Text>
              <Text style={styles.totalValue}>{item.tot_presents}</Text>
            </View>
          )}

          {/* Planillas solo si filtro = Todos o Presentes */}
          {(filter === 'Todos' || filter === 'Presentes') && (
            <View style={styles.columnsContainer}>
              {item.planillas?.map((p) => (
                <View key={p.nombre_planilla} style={styles.columnItem}>
                  <View style={styles.rowItem}>
                    <Text style={styles.planillaText}>{p.nombre_planilla}</Text>
                    <Text style={styles.planillaText}>{p.cant_presentes}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading && resumenes.length === 0) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
        {error}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de filtros */}
      <View style={styles.filterWrapper}>
      <ScrollView
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.filterContainer}
       >
         {(['Todos', 'Playa', 'Negocio', 'Presentes'] as FilterOption[]).map(
           (option) => (
             <Chip
               key={option}
               mode="flat"
               selected={filter === option}
               onPress={() => setFilter(option)}
               icon={
                 option === 'Playa'
                   ? 'beach'
                   : option === 'Negocio'
                   ? 'store'
                   : option === 'Presentes'
                   ? 'account-group'
                   : 'filter'
               }
               style={[
                 styles.chip,
                 filter === option
                   ? { backgroundColor: COLORS.buttonClear }
                   : { backgroundColor: '#ede7f6' },
               ]}
               textStyle={{
                 color: COLORS.darkLetter,
                 fontFamily: 'OpenSans-Light',
                 fontSize: 16,
               }}
             >
               {option}
             </Chip>
           )
         )}
       </ScrollView>
       </View>



      {resumenes.length === 0 ? (
        <Text style={styles.loadingText}>No hay datos disponibles</Text>
      ) : (
        <FlatList<ReportResumAsist>
          data={resumenes}
          keyExtractor={(item) => item.day}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={reload}
              colors={['#6200ee']}
              tintColor="#6200ee"
            />
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" /> : null
          }
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

// ----------------------
// Estilos
// ----------------------
const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: 'rgb(232, 237, 189)' },
 flatListContent: { paddingVertical: 8, paddingHorizontal: 16 },
 filterWrapper: {
   backgroundColor: 'rgba(255,255,255,0.4)',
   paddingVertical: 8,
   marginBottom: 8,
   borderRadius: 12,
 },
 filterContainer: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   paddingHorizontal: 8,
   paddingVertical: 4,
 },
 chip: {
   marginRight: 8,
   borderRadius: 8,
   height: 35,
 },
 card: {
   flex: 1,
   backgroundColor: 'rgba(255,255,255,0.8)',
   borderRadius: 15,
   padding: 16,
   marginBottom: 5,
 },
 totalRow: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginVertical: 10,
 },
 totalBoxHalf: {
   flex: 1,
   marginRight: 8,
   alignItems: 'center',
 },
 totalBoxFull: {
   flex: 1,
   marginRight: 0,
   alignItems: 'center',
 },
 totalBox: {
   backgroundColor: 'rgba(0,0,0,0.05)',
   borderRadius: 10,
   padding: 10,
   marginVertical: 5,
   alignItems: 'center',
 },
 totalLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
 totalValue: { fontSize: 22, fontWeight: 'bold', color: '#000' },
 detailBox: { marginBottom: 10 },
 detailRow: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   paddingVertical: 6,
 },
 detailLabel: { fontSize: 15, color: '#333', fontFamily: 'OpenSans-Light' },
 detailValue: {
   fontSize: 15,
   fontWeight: '600',
   color: '#000',
   fontFamily: 'OpenSans-Light',
 },
 subDetailBox: {
   backgroundColor: 'rgba(0,0,0,0.03)',
   borderRadius: 8,
   paddingHorizontal: 10,
   paddingVertical: 6,
   marginTop: 6,
 },
 subDetailLabel: { fontSize: 15, color: '#555' },
 subDetailValue: { fontSize: 15, fontWeight: '600', color: '#555' },
 planillaText: { color: '#000', fontFamily: 'OpenSans-Light', fontSize: 15 },
 columnsContainer: {
   flexDirection: 'row',
   marginTop: 10,
   flexWrap: 'wrap',
 },
 columnItem: { width: '50%', paddingRight: 10 },
 rowItem: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginVertical: 4,
 },
 loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
 
});
