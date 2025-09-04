// src/containers/dailySummary/DailySummaryScreen.tsx
import React, { useState, useCallback } from 'react';
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
import { IncomesFilterBar } from "../../containers/incomes/components/IncomesFilterBar";
import { CategoryFilter } from "../../containers/incomes/components/CategoryFilter";
import { PaymentMethodFilter } from "../../containers/incomes/components/PaymentMethodFilter";

// ----------------------
// Nuevo filtro de periodo
// ----------------------
type PeriodFilterProps = {
  filter: PeriodFilterOption;
  onChangeFilter: (val: PeriodFilterOption) => void;
};

const PeriodFilter: React.FC<PeriodFilterProps> = ({ filter, onChangeFilter }) => {
  return (
    <View style={{ flexDirection: "row", marginRight: 8 }}>
      {(["Dia", "Mes"] as PeriodFilterOption[]).map((option) => (
        <Chip
          key={option}
          style={styles.chip}
          mode="outlined"
          selected={filter === option}
          selectedColor={COLORS.primary}
          onPress={() => onChangeFilter(option)}
        >
          {option}
        </Chip>
      ))}
    </View>
  );
};

const FILTER_MAP: Record<string, string> = {
  Todos: "",
  Playa: "escuela",
  Negocio: "negocio",
};

type FilterOption = 'Todos' | 'Playa' | 'Negocio';
type PeriodFilterOption = "Dia" | "Mes" ;
type PaymentMethodOption = "Todos" | "Efectivo" | "MP" | "Transferencia";

// ----------------------
// Tipos de reportes
// ----------------------
type ReportResumPlanilla = {
  cant_presentes: number;
  nombre_planilla: string;
};

export type ReportResumAsist = {
  tot_incomes: number;
  tot_incomes_ef: number;
  tot_incomes_transf: number;
  tot_incomes_playa: number;
  tot_incomes_negocio: number;
  tot_incomes_escuela: number;
  tot_incomes_highschool: number;
  tot_incomes_colonia: number;
  tot_presents: number;
  day: string;
  planillas: ReportResumPlanilla[];
};

// ----------------------
// API
// ----------------------
async function fetchResumenes(page: number, period: PeriodFilterOption): Promise<ReportResumAsist[]> {
  const response = await api.get('/planillas_presentes.php', {
    params: { 
      method: 'getDayResumPresents',
      page,
      period, // <-- enviamos el periodFilter al backend
    },
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
  const [periodFilter, setPeriodFilter] = useState<PeriodFilterOption>("Dia");
  const [paymentPlace, setPaymentPlace] = useState<FilterOption>("Playa");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethodOption>("Todos");

  // <-- función memorizada para evitar recarga infinita
  const fetchResumenesWithPeriod = useCallback(
    (page: number) => fetchResumenes(page, periodFilter),
    [periodFilter]
  );

  const {
    data: resumenes,
    loading,
    loadingMore,
    refreshing,
    error,
    reload,
    loadMore,
  } = usePaginatedFetch<ReportResumAsist>(fetchResumenesWithPeriod, []);

  // Maneja cambio de período y recarga
  const handlePeriodChange = (newPeriod: PeriodFilterOption) => {
    setPeriodFilter(newPeriod);
    reload();
  };

  // renderItem tipado
  const renderItem: ListRenderItem<ReportResumAsist> = ({ item }) => {
    const totalEscuela = item.tot_incomes_escuela;
    const totalHigh = item.tot_incomes_highschool;
    const totalColonia = item.tot_incomes_colonia;
    const totalColoniaGroup = totalHigh + totalColonia;
    const isExpanded = expandedDay === item.day;

    // Para cajas Playa/Negocio
    const showNegocio = paymentPlace === 'Todos' || paymentPlace === 'Negocio';
    const showPlaya = paymentPlace === 'Todos' || paymentPlace === 'Playa';
    const bothBoxes = showNegocio && showPlaya && filter === 'Todos';

    return (
      <View>
        <DateHeader date={item.day.includes('T') ? item.day : item.day + 'T00:00:00'} />

        <View style={styles.card}>
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

          {filter === 'Todos' && (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>caja total</Text>
              <Text style={styles.totalValue}>${item.tot_incomes}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Efectivo</Text>
                <Text style={styles.detailValue}>${item.tot_incomes_ef}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tarjeta</Text>
                <Text style={styles.detailValue}>${item.tot_incomes_transf}</Text>
              </View>
            </View>
          )}

          {filter === 'Todos' && (
            <View style={styles.detailBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Escuela</Text>
                <Text style={styles.detailValue}>${totalEscuela}</Text>
              </View>

              <TouchableOpacity onPress={() => setExpandedDay(isExpanded ? null : item.day)}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Colonia</Text>
                  <Text style={styles.detailValue}>${totalColoniaGroup}</Text>
                </View>
              </TouchableOpacity>

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

          {(filter === 'Todos' || filter === 'Presentes') && (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Presentes</Text>
              <Text style={styles.totalValue}>{item.tot_presents}</Text>
            </View>
          )}

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
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <PeriodFilter filter={periodFilter} onChangeFilter={handlePeriodChange} />
          <IncomesFilterBar filter={paymentPlace} onChangeFilter={setPaymentPlace} />
          <PaymentMethodFilter filter={paymentMethodFilter} onChangeFilter={setPaymentMethodFilter} />
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
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
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
