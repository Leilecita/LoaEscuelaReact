import React from 'react'
import { View, FlatList, Text, ActivityIndicator, RefreshControl } from 'react-native'
import { useIncomes } from '../hooks/useIncomes'
import ItemIncomeView from '../components/ItemIncomeView'

export default function IncomesListScreen() {
  const {
    incomes,
    loading,
    loadingMore,
    refreshing,
    loadMore,
    reload,
    error,
  } = useIncomes('')

  if (loading && incomes.length === 0) {
    return <ActivityIndicator size="large" />
  }

  if (error) {
    return <Text style={{ color: 'red' }}>Error: {error}</Text>
  }

  if (incomes.length === 0) {
    return <Text>No hay pagos disponibles</Text>
  }

  return (
    <View style={{ flex: 1,backgroundColor: 'rgb(239, 241, 202)'}}>
    <FlatList
      data={incomes}
      keyExtractor={(item) => item.income_id.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={reload} />
      }
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size="small" /> : null
      }
      renderItem={({ item, index }) => {
        const currentDate = new Date(item.income_created).toISOString().substring(0, 10);
        const previousDate = index > 0
          ? new Date(incomes[index - 1].income_created).toISOString().substring(0, 10)
          : null;
      
        return (
          <ItemIncomeView
            income_created={item.income_created}
            description={item.description}
            payment_method={item.payment_method}
            category={item.category || ''}
            detail={item.detail.toString()}
            amount={item.amount}
            income_id={item.income_id}
            showDateHeader={index === 0 || currentDate !== previousDate}
          />
        )
      }}
    />
    </View>
  )
}
