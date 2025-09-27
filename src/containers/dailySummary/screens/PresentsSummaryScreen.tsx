// src/containers/dailySummary/DailySummaryScreen2.tsx
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
import { Chip } from 'react-native-paper';
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
  tot_incomes_ef_esc: number;
  tot_incomes_transf_esc: number;
  tot_incomes_ef_col: number;
  tot_incomes_transf_col: number;

  tot_incomes_playa: number;
  tot_incomes_ef_playa: number;
  tot_incomes_transf_playa: number;
  tot_incomes_ef_esc_playa: number;
  tot_incomes_transf_esc_playa: number;
  tot_incomes_ef_col_playa: number;
  tot_incomes_transf_col_playa: number;

  tot_incomes_negocio: number;
  tot_incomes_ef_negocio: number;
  tot_incomes_transf_negocio: number;
  tot_incomes_ef_esc_negocio: number;
  tot_incomes_transf_esc_negocio: number;
  tot_incomes_ef_col_negocio: number;
  tot_incomes_transf_col_negocio: number;

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
export const PresentsSummaryScreen: React.FC = () => {

  const [expandedTotPresents, setExpandedTotPresents] = useState<string | null>(null);
  const [expandedTotEsc, setExpandedTotEsc] = useState<string | null>(null);
  const [expandedTotColonia, setExpandedTotColonia] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterOption>('Todos');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilterOption>("Dia");

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
    //reload();
  };

  // ----------------------
  // Render Item
  // ----------------------
 

  // En tu renderItem
// En tu renderItem
const renderItem: ListRenderItem<ReportResumAsist> = ({ item }) => {
 const planillas = item.planillas ?? [];

 // Buscar cada planilla por nombre
 const intermedios = planillas.find(p => p.nombre_planilla.toLowerCase() === "intermedios");
 const adultos     = planillas.find(p => p.nombre_planilla.toLowerCase() === "adultos");
 const kids        = planillas.find(p => p.nombre_planilla.toLowerCase() === "kids");
 const mini        = planillas.find(p => p.nombre_planilla.toLowerCase() === "mini");
 const high        = planillas.find(p => p.nombre_planilla.toLowerCase() === "highschool");

 // Totales agrupados
 const totalEscuela = (intermedios?.cant_presentes ?? 0) + (adultos?.cant_presentes ?? 0);
 const totalColonia = (kids?.cant_presentes ?? 0) + (mini?.cant_presentes ?? 0) + (high?.cant_presentes ?? 0);

 return (
   <View>
     {periodFilter === "Mes" ? (
       <MonthHeader date={item.day.includes("T") ? item.day : item.day + "T00:00:00"} />
     ) : (
       <DateHeader date={item.day.includes("T") ? item.day : item.day + "T00:00:00"} />
     )}



     {/* Total Colonia */}
     <TouchableOpacity
       onPress={() =>
         setExpandedTotColonia(expandedTotColonia === item.day ? null : item.day)
       }
     >
       <View style={[styles.totalBox, { backgroundColor: COLORS.cardColonia }]}>
         <Text style={styles.totalLabel}>Presentes colonia</Text>
         <Text style={styles.totalValue}>{totalColonia}</Text>
       </View>
     </TouchableOpacity>

     {expandedTotColonia === item.day && (
       <View style={styles.detailAttached}>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Kids</Text>
           <Text style={styles.subDetailValue}>{kids?.cant_presentes ?? 0}</Text>
         </View>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Mini</Text>
           <Text style={styles.subDetailValue}>{mini?.cant_presentes ?? 0}</Text>
         </View>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Highschool</Text>
           <Text style={styles.subDetailValue}>{high?.cant_presentes ?? 0}</Text>
         </View>
       </View>
     )}

     {/* Total Escuela */}
     <TouchableOpacity
       onPress={() =>
         setExpandedTotEsc(expandedTotEsc === item.day ? null : item.day)
       }
     >
       <View style={[styles.totalBox, { backgroundColor: COLORS.cardEscuela }]}>
         <Text style={styles.totalLabel}>Presentes escuela</Text>
         <Text style={styles.totalValue}>{totalEscuela}</Text>
       </View>
     </TouchableOpacity>

     {expandedTotEsc === item.day && (
       <View style={styles.detailAttached}>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Intermedios</Text>
           <Text style={styles.subDetailValue}>{intermedios?.cant_presentes ?? 0}</Text>
         </View>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Adultos</Text>
           <Text style={styles.subDetailValue}>{adultos?.cant_presentes ?? 0}</Text>
         </View>
       </View>
     )}

     {/* Total General */}
     <TouchableOpacity
       onPress={() =>
         setExpandedTotPresents(expandedTotPresents === item.day ? null : item.day)
       }
     >
       <View style={[styles.totalBox, { backgroundColor: COLORS.cardTot }]}>
         <Text style={styles.totalLabel}>Total presentes</Text>
         <Text style={styles.totalValue}>{item.tot_presents ?? 0}</Text>
       </View>
     </TouchableOpacity>

     {expandedTotPresents === item.day && (
       <View style={styles.detailAttached}>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Intermedios</Text>
           <Text style={styles.subDetailValue}>{intermedios?.cant_presentes ?? 0}</Text>
         </View>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Adultos</Text>
           <Text style={styles.subDetailValue}>{adultos?.cant_presentes ?? 0}</Text>
         </View>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Kids</Text>
           <Text style={styles.subDetailValue}>{kids?.cant_presentes ?? 0}</Text>
         </View>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Mini</Text>
           <Text style={styles.subDetailValue}>{mini?.cant_presentes ?? 0}</Text>
         </View>
         <View style={styles.row}>
           <Text style={styles.subDetailLabel}>Highschool</Text>
           <Text style={styles.subDetailValue}>{high?.cant_presentes ?? 0}</Text>
         </View>
       </View>
     )}
   </View>
 );
};


  return (
    <ImageBackground
      source={require("../../../../assets/fondo.png")} // <-- tu fondo
      style={{ flex: 1 }}
      resizeMode="cover"
    >
       <View style={{ flex: 1, overflow: 'visible' }}>
         <View style={[styles.filterWrapper, { backgroundColor: 'rgba(255,255,255,0.32)' }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
            <PeriodFilter filter={periodFilter} onChangeFilter={handlePeriodChange} />
          </ScrollView>
        </View>

        {error && (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
            {error}
          </Text>
        )}

        {loading && resumenes.length === 0 && (
          <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
        )}

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
    backgroundColor: 'rgba(255, 255, 255, 0.29)',
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chip: { marginRight: 8, borderRadius: 8, height: 35 },
  totalBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 16, fontFamily:'OpenSans-Regular', color: COLORS.darkLetter },
  totalValue: { fontSize: 17, fontFamily:'OpenSans-Regular', color: COLORS.darkLetter, marginTop: 8  },
  detailBox: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  detailLabel: { fontSize: 15, color: '#333', marginBottom: 4 },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16 },

 

categoryBox: {
  backgroundColor: '#f4f4f4',
  borderRadius: 10,
  padding: 10,
},

categoryHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 6,
},

categoryTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},

categoryTotal: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},

row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 2,

},

subDetailLabel: {
 fontSize: 14,
 fontFamily: 'OpenSans-Light',
 color: COLORS.darkLetter3,
},
detailAttached: {
 backgroundColor: 'rgba(255,255,255,0.5)', // fondo claro
 paddingVertical: 8,
 paddingHorizontal: 22,
 
 borderBottomLeftRadius: 15, // solo bordes inferiores
 borderBottomRightRadius: 15,
 marginBottom: 8, // separa de la siguiente tarjeta
},
rowWithIcon: {
 flexDirection: 'row',
 alignItems: 'center',
},

subDetailValue: {
  fontSize: 14,
  fontFamily: 'OpenSans-Light',
  color: COLORS.darkLetter3,
},
subDetailContainer: {
  backgroundColor: 'rgba(255,255,255,0.5)', // fondo claro, semitransparente
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderBottomLeftRadius: 15,
  borderBottomRightRadius: 15,
  marginBottom: 8,
  // sin marginTop, así queda pegado al totalBox
},
subCategoryBox: {
  borderRadius: 10,
  padding: 8,
  marginBottom: 6,
},
subCategoryHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 4,
},
subCategoryTitle: { fontSize: 17, fontFamily: 'OpenSans-Regular', color: COLORS.darkLetter },
subCategoryTotal: { fontSize: 17, fontFamily: 'OpenSans-Regular', color: COLORS.darkLetter},



 
});
