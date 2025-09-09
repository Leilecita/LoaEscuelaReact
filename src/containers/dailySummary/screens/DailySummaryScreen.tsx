// src/containers/dailySummary/DailySummaryScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, ListRenderItem, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../../core/services/axiosClient';
import { DateHeader } from '../../../core/components/DateHeader';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { COLORS } from 'core/constants';

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

const Tab = createBottomTabNavigator();

// ----------------------
// API
// ----------------------
async function fetchResumenes(page: number, period: 'Dia' | 'Mes'): Promise<ReportResumAsist[]> {
  const response = await api.get('/planillas_presentes.php', {
    params: { method: 'getDayResumPresents', page, period },
  });
  const dataArray = response.data.data;
  if (Array.isArray(dataArray)) return dataArray;
  return [];
}

// ----------------------
// Tab Content
// ----------------------
type DailySummaryTabContentProps = {
  resumenes: ReportResumAsist[];
  activeTab: 'Pagos' | 'Presentes';
  refreshing: boolean;
  reload: () => void;
  loadMore: () => void;
};

const DailySummaryTabContent: React.FC<DailySummaryTabContentProps> = ({
  resumenes,
  activeTab,
  refreshing,
  reload,
  loadMore,
}) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const renderItem: ListRenderItem<ReportResumAsist> = ({ item }) => {
    const totalEscuela = item.tot_incomes_escuela;
    const totalHigh = item.tot_incomes_highschool;
    const totalColonia = item.tot_incomes_colonia;
    const totalColoniaGroup = totalHigh + totalColonia;
    const isExpanded = expandedDay === item.day;

    return (
      <View>
        <DateHeader date={item.day.includes('T') ? item.day : item.day + 'T00:00:00'} />

        <View style={styles.card}>
          {activeTab === 'Pagos' && (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total ingresos</Text>
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

          {activeTab === 'Presentes' && (
            <>
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Presentes</Text>
                <Text style={styles.totalValue}>{item.tot_presents}</Text>
              </View>

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
            </>
          )}
        </View>
      </View>
    );
  };

  if (!resumenes.length) return <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay datos disponibles</Text>;

  return (
    <FlatList
      data={resumenes}
      keyExtractor={(item) => item.day}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} colors={['#6200ee']} />}
    />
  );
};

// ----------------------
// Componente principal con Bottom Tabs
// ----------------------
type Props = {
  periodFilter: 'Dia' | 'Mes';
};

export const DailySummaryScreen: React.FC<Props> = ({ periodFilter }) => {
  const fetchResumenesWithPeriod = useCallback((page: number) => fetchResumenes(page, periodFilter), [periodFilter]);

  const { data: resumenes, loading, refreshing, reload, loadMore } = usePaginatedFetch<ReportResumAsist>(
    fetchResumenesWithPeriod,
    []
  );

  if (loading && resumenes.length === 0) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'rgb(255, 255, 255)',
        tabBarInactiveTintColor: COLORS.lightGreenColor,
        tabBarStyle: {
          backgroundColor: COLORS.darkGreenColor,
          height: 70,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Pagos' ? 'cash' : 'account-check';
          return <MaterialCommunityIcons name={iconName} color={color} size={26} />;
        },
        tabBarLabelStyle: { fontSize: 12, fontFamily: 'OpenSans-Regular', marginBottom: 4 },
      })}
    >
      <Tab.Screen name="Pagos">
        {() => (
          <DailySummaryTabContent
            resumenes={resumenes}
            activeTab="Pagos"
            refreshing={refreshing}
            reload={reload}
            loadMore={loadMore}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Presentes">
        {() => (
          <DailySummaryTabContent
            resumenes={resumenes}
            activeTab="Presentes"
            refreshing={refreshing}
            reload={reload}
            loadMore={loadMore}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// ----------------------
// Estilos
// ----------------------
const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 5,
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
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailLabel: { fontSize: 15, color: '#333', fontFamily: 'OpenSans-Light' },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#000', fontFamily: 'OpenSans-Light' },
  columnsContainer: { flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' },
  columnItem: { width: '50%', paddingRight: 10 },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  planillaText: { color: '#000', fontFamily: 'OpenSans-Light', fontSize: 15 },
});
