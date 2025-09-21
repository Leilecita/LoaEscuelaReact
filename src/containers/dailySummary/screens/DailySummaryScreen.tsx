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
  ScrollView,
  ImageBackground
} from 'react-native';
import api from '../../../core/services/axiosClient';
import { DateHeader } from '../../../core/components/DateHeader';
import { MonthHeader } from '../../../core/components/MonthHeader';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { COLORS } from 'core/constants';
import { IncomesFilterBar } from "../../../containers/incomes/components/IncomesFilterBar";
import { PaymentMethodFilter } from "../../../containers/incomes/components/PaymentMethodFilter";
import { PeriodFilter } from "../../../containers/incomes/components/PeriodFilter";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// ----------------------
// Filtros de periodo
// ----------------------
type PeriodFilterOption = "Dia" | "Mes";
type FilterOption = "Todos" | "Playa" | "Negocio";
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
  tot_incomes_mp: number;

  tot_incomes_ef_esc: number;
  tot_incomes_transf_esc: number;
  tot_incomes_mp_esc: number;

  tot_incomes_ef_col: number;
  tot_incomes_transf_col: number;
  tot_incomes_mp_col: number;

  tot_incomes_playa: number;
  tot_incomes_ef_playa: number;
  tot_incomes_transf_playa: number;
  tot_incomes_mp_playa: number;

  tot_incomes_ef_esc_playa: number;
  tot_incomes_transf_esc_playa: number;
  tot_incomes_mp_esc_playa: number;

  tot_incomes_ef_col_playa: number;
  tot_incomes_transf_col_playa: number;
  tot_incomes_mp_col_playa: number;

  tot_incomes_negocio: number;
  tot_incomes_ef_negocio: number;
  tot_incomes_transf_negocio: number;
  tot_incomes_mp_negocio: number;

  tot_incomes_ef_esc_negocio: number;
  tot_incomes_transf_esc_negocio: number;
  tot_incomes_mp_esc_negocio: number;

  tot_incomes_ef_col_negocio: number;
  tot_incomes_transf_col_negocio: number;
  tot_incomes_mp_col_negocio: number;

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
      period,
    },
  });

  const dataArray = response.data.data;
  if (Array.isArray(dataArray)) return dataArray;
  return [];
}

// ----------------------
// Componente principal
// ----------------------
export const DailySummaryScreen: React.FC = () => {
  const [expandedPlaya, setExpandedPlaya] = useState<string | null>(null);
  const [expandedNego, setExpandedNego] = useState<string | null>(null);
  const [expandedTotal, setExpandedTotal] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterOption>('Todos');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilterOption>("Dia");
  const [paymentPlace, setPaymentPlace] = useState<FilterOption>("Playa");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethodOption>("Todos");

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

  const handlePeriodChange = (newPeriod: PeriodFilterOption) => {
    setPeriodFilter(newPeriod);
  };

  const renderRow = (label: string, icon: string, value: number) => (
    <View style={styles.row}>
      <View style={styles.rowWithIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={16}
          color={COLORS.darkLetter}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.subDetailLabel}>{label}</Text>
      </View>
      <Text style={styles.subDetailValue}>${value.toLocaleString('es-AR') ?? 0}</Text>
    </View>
  );

  const renderItem: ListRenderItem<ReportResumAsist> = ({ item }) => {
    return (
      <View>
        {periodFilter === "Mes" ? (
          <MonthHeader date={item.day.includes("T") ? item.day : item.day + "T00:00:00"} />
        ) : (
          <DateHeader date={item.day.includes("T") ? item.day : item.day + "T00:00:00"} />
        )}

        {/* Caja Playa */}
        <TouchableOpacity
            onPress={() =>
              setExpandedPlaya(expandedPlaya === item.day ? null : item.day)
            }
          >
            <View
              style={[styles.totalBox2, { backgroundColor: COLORS.cardEscuela }]}
            >
              <View style={styles.centeredTexts}>
                <Text style={styles.totalLabel}>Total caja Playa</Text>
                <Text style={styles.totalValue}>
                  ${item.tot_incomes_playa?.toLocaleString("es-AR") ?? 0}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="beach"
                size={30}
                color={COLORS.darkLetter}
              />
            </View>
          </TouchableOpacity>



        {expandedPlaya === item.day && (
          <View style={styles.detailAttached}>
            {/* Escuela */}
            <View style={styles.subCategoryBox}>
              <View style={styles.subCategoryHeader}>
                <Text style={styles.subCategoryTitle}>Escuela</Text>
                <Text style={styles.subCategoryTotal}>${(item.tot_incomes_ef_esc_playa + item.tot_incomes_transf_esc_playa + item.tot_incomes_mp_esc_playa).toLocaleString('es-AR') ?? 0}</Text>
              </View>
              {renderRow("Efectivo", "cash", item.tot_incomes_ef_esc_playa)}
              {renderRow("Tarjeta", "credit-card-outline", item.tot_incomes_transf_esc_playa)}
              {renderRow("MP", "cellphone", item.tot_incomes_mp_esc_playa)}
            </View>

            {/* Colonia */}
            <View style={styles.subCategoryBox}>
              <View style={styles.subCategoryHeader}>
                <Text style={styles.subCategoryTitle}>Colonia</Text>
                <Text style={styles.subCategoryTotal}>${(item.tot_incomes_ef_col_playa + item.tot_incomes_transf_col_playa + item.tot_incomes_mp_col_playa).toLocaleString('es-AR') ?? 0}</Text>
              </View>
              {renderRow("Efectivo", "cash", item.tot_incomes_ef_col_playa)}
              {renderRow("Tarjeta", "credit-card-outline", item.tot_incomes_transf_col_playa)}
              {renderRow("MP", "cellphone", item.tot_incomes_mp_col_playa)}
            </View>
          </View>
        )}

        {/* Caja Negocio */}
        <TouchableOpacity
            onPress={() =>
              setExpandedNego(expandedNego === item.day ? null : item.day)
            }
          >
            <View style={[styles.totalBox2, { backgroundColor: COLORS.cardColonia }]}>
              <View style={styles.centeredTexts}>
                <Text style={styles.totalLabel}>Total caja Nego</Text>
                <Text style={styles.totalValue}>
                  ${item.tot_incomes_negocio?.toLocaleString("es-AR") ?? 0}
                </Text>
              </View>

              {/* Si querés agregar un ícono igual que el de playa, por ejemplo: */}
              <MaterialCommunityIcons
                name="store"
                size={30}
                color={COLORS.darkLetter}
              />
            </View>
        </TouchableOpacity>


        {expandedNego === item.day && (
          <View style={styles.detailAttached}>
            {/* Escuela */}
            <View style={styles.subCategoryBox}>
              <View style={styles.subCategoryHeader}>
                <Text style={styles.subCategoryTitle}>Escuela</Text>
                <Text style={styles.subCategoryTotal}>${(item.tot_incomes_ef_esc_negocio + item.tot_incomes_transf_esc_negocio + item.tot_incomes_mp_esc_negocio).toLocaleString('es-AR') ?? 0}</Text>
              </View>
              {renderRow("Efectivo", "cash", item.tot_incomes_ef_esc_negocio)}
              {renderRow("Tarjeta", "credit-card-outline", item.tot_incomes_transf_esc_negocio)}
              {renderRow("MP", "cellphone", item.tot_incomes_mp_esc_negocio)}
            </View>

            {/* Colonia */}
            <View style={styles.subCategoryBox}>
              <View style={styles.subCategoryHeader}>
                <Text style={styles.subCategoryTitle}>Colonia</Text>
                <Text style={styles.subCategoryTotal}>${(item.tot_incomes_ef_col_negocio + item.tot_incomes_transf_col_negocio + item.tot_incomes_mp_col_negocio).toLocaleString('es-AR') ?? 0}</Text>
              </View>
              {renderRow("Efectivo", "cash", item.tot_incomes_ef_col_negocio)}
              {renderRow("Tarjeta", "credit-card-outline", item.tot_incomes_transf_col_negocio)}
              {renderRow("MP", "cellphone", item.tot_incomes_mp_col_negocio)}
            </View>
          </View>
        )}

        {/* Total Diario */}
       {/* Total Diario */}
        <TouchableOpacity
          onPress={() =>
            setExpandedTotal(expandedTotal === item.day ? null : item.day)
          }
        >
          <View style={[styles.totalBox2, { backgroundColor: COLORS.cardTot }]}>
            <View style={styles.centeredTexts}>
              <Text style={styles.totalLabel}>Total diario</Text>
              <Text style={styles.totalValue}>
                ${item.tot_incomes?.toLocaleString('es-AR') ?? 0}
              </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="beach"
                size={23}
                color={COLORS.darkLetter}
                style={{ marginRight:3 }}
              />
              <MaterialCommunityIcons
                name="store"
                size={23}
                color={COLORS.darkLetter}
                style={{ marginTop: 8, marginRight:3 }} // espacio vertical entre los iconos
              />
            </View>
          </View>
        </TouchableOpacity>


        {expandedTotal === item.day && (
          <View style={styles.detailAttached}>
            {/* Escuela */}
            <View style={styles.subCategoryBox}>
              <View style={styles.subCategoryHeader}>
                <Text style={styles.subCategoryTitle}>Escuela</Text>
                <Text style={styles.subCategoryTotal}>${(item.tot_incomes_ef_esc + item.tot_incomes_transf_esc + item.tot_incomes_mp_esc).toLocaleString('es-AR') ?? 0}</Text>
              </View>
              {renderRow("Efectivo", "cash", item.tot_incomes_ef_esc)}
              {renderRow("Tarjeta", "credit-card-outline", item.tot_incomes_transf_esc)}
              {renderRow("MP", "cellphone", item.tot_incomes_mp_esc)}
            </View>

            {/* Colonia */}
            <View style={styles.subCategoryBox}>
              <View style={styles.subCategoryHeader}>
                <Text style={styles.subCategoryTitle}>Colonia</Text>
                <Text style={styles.subCategoryTotal}>${(item.tot_incomes_ef_col + item.tot_incomes_transf_col + item.tot_incomes_mp_col).toLocaleString('es-AR') ?? 0}</Text>
              </View>
              {renderRow("Efectivo", "cash", item.tot_incomes_ef_col)}
              {renderRow("Tarjeta", "credit-card-outline", item.tot_incomes_transf_col)}
              {renderRow("MP", "cellphone", item.tot_incomes_mp_col)}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading && resumenes.length === 0) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>;
  }

  return (
    <ImageBackground
      source={require("../../../../assets/fondo.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} colors={['#6200ee']} tintColor="#6200ee" />}
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>
    </ImageBackground>
  );
};

// ----------------------
// Estilos
// ----------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(232, 237, 189, 0.5)' },
  flatListContent: { paddingVertical: 8, paddingHorizontal: 16 },
  filterWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  totalBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 19, fontFamily:'OpenSans-Regular', color: COLORS.darkLetter },
  totalValue: { fontSize: 20, fontFamily:'OpenSans-Regular', color: COLORS.darkLetter, marginTop: 8  },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  rowWithIcon: { flexDirection: 'row', alignItems: 'center' },
  subDetailLabel: { fontSize: 16, fontFamily: 'OpenSans-Light', color: COLORS.darkLetter3 },
  subDetailValue: { fontSize: 16, fontFamily: 'OpenSans-Light', color: COLORS.darkLetter3 },
  detailAttached: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 8,
  },
  subCategoryBox: { borderRadius: 10, padding: 8, marginBottom: 6 },
  subCategoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  subCategoryTitle: { fontSize: 17, fontFamily: 'OpenSans-Regular', color: COLORS.darkLetter },
  subCategoryTotal: { fontSize: 17, fontFamily: 'OpenSans-Regular', color: COLORS.darkLetter },
  valueWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // alinea a la derecha
    gap: 6, // espacio entre número e ícono (RN 0.71+ soporta gap, sino usá marginLeft)
  },
  totalBox2: {
    flexDirection: "row",
    alignItems: "center",      // centra verticalmente
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  
  centeredTexts: {
    flex: 1,
    alignItems: "center",      // centra horizontalmente textos
    justifyContent: "center",  // centra verticalmente textos
  },
  
  
});