// src/students/screens/TestIncomesScreen.tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useIncomesByStudent, Income } from '../../incomes/hooks/useIncomesByStudent';

type Props = {
  route: { params: { studentId: number } };
};

export const TestIncomesScreen: React.FC<Props> = ({ route }) => {
  const { studentId } = route.params;
  const { incomes, loading, error, loadMore, loadingMore } = useIncomesByStudent({ studentId });

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  if (error) return <Text style={styles.center}>Error: {error}</Text>;

  if (!incomes.length) return <Text style={styles.center}>No hay pagos</Text>;

  return (
    <FlatList
      data={incomes}
      keyExtractor={(item: Income) => item.income_id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.detail} - ${item.amount}</Text>
          <Text>{item.payment_method} - {item.created}</Text>
        </View>
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
