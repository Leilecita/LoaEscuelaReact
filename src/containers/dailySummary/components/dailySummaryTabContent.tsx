// src/containers/dailySummary/DailySummaryTabContent.tsx
import React, { useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Text, ListRenderItem } from 'react-native';
import { ReportResumAsist } from '../screens/DailySummaryScreen';
import { DateHeader } from '../../../core/components/DateHeader';
import { COLORS } from 'core/constants';
import { StyleSheet } from 'react-native';

type Props = {
  resumenes: ReportResumAsist[];
  activeTab: 'Pagos' | 'Presentes';
  paymentPlace: 'Todos' | 'Playa' | 'Negocio';
  paymentMethodFilter: string;
  refreshing: boolean;
  reload: () => void;
  loadMore: () => void;
};

export const DailySummaryTabContent: React.FC<Props> = ({
  resumenes,
  activeTab,
  paymentPlace,
  refreshing,
  reload,
  loadMore
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
            </View>
          )}

          {activeTab === 'Presentes' && (
            <>
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Presentes</Text>
                <Text style={styles.totalValue}>{item.tot_presents}</Text>
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
});
