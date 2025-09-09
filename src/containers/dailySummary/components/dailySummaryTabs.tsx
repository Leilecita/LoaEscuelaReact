// src/containers/dailySummary/DailySummaryTabs.tsx
import React, { useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, FlatList, ActivityIndicator, RefreshControl, Text, ListRenderItem } from 'react-native';
import { DailySummaryTabContent } from 'DailySummaryTabContent';
import { ReportResumAsist } from '../screens/DailySummaryScreen';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import api from '../../../core/services/axiosClient';
import { COLORS } from 'core/constants';

type DailySummaryTabsProps = {
  periodFilter: 'Dia' | 'Mes';
  paymentPlace: 'Todos' | 'Playa' | 'Negocio';
  paymentMethodFilter: 'Todos' | 'Efectivo' | 'MP' | 'Transferencia';
};

const Tab = createMaterialTopTabNavigator();

async function fetchResumenes(page: number, period: 'Dia' | 'Mes'): Promise<ReportResumAsist[]> {
  const response = await api.get('/planillas_presentes.php', {
    params: { method: 'getDayResumPresents', page, period },
  });
  const dataArray = response.data.data;
  if (Array.isArray(dataArray)) return dataArray;
  return [];
}

export const DailySummaryTabs: React.FC<DailySummaryTabsProps> = ({
  periodFilter,
  paymentPlace,
  paymentMethodFilter
}) => {
  const fetchResumenesWithPeriod = useCallback(
    (page: number) => fetchResumenes(page, periodFilter),
    [periodFilter]
  );

  const { data: resumenes, loading, refreshing, reload, loadMore } = usePaginatedFetch<ReportResumAsist>(fetchResumenesWithPeriod, []);

  if (loading && resumenes.length === 0) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.darkGreenColor,
        tabBarInactiveTintColor: COLORS.lightGreenColor,
        tabBarIndicatorStyle: { backgroundColor: COLORS.darkGreenColor },
        swipeEnabled: true,
        lazy: true,
      }}
    >
      <Tab.Screen name="Pagos">
        {() => (
          <DailySummaryTabContent
            resumenes={resumenes}
            activeTab="Pagos"
            paymentPlace={paymentPlace}
            paymentMethodFilter={paymentMethodFilter}
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
            paymentPlace={paymentPlace}
            paymentMethodFilter={paymentMethodFilter}
            refreshing={refreshing}
            reload={reload}
            loadMore={loadMore}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
