import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useIncomes } from "../hooks/useIncomes";
import ItemIncomeView from "../components/ItemIncomeView";
import { IncomesFilterBar } from "../components/IncomesFilterBar";

// 🔹 equivalencias entre UI y servidor
const FILTER_MAP: Record<string, string> = {
  Todos: "",
  Playa: "escuela",
  Negocio: "negocio",
};

export default function IncomesListScreen() {
  const [paymentPlace, setPaymentPlace] = useState<FilterOption>("Todos");

  const {
    incomes,
    loading,
    loadingMore,
    refreshing,
    loadMore,
    reload,
    error,
  } = useIncomes(FILTER_MAP[paymentPlace]);

  if (loading && incomes.length === 0) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
        Error: {error}
      </Text>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(239, 241, 202)" }}>
      {/* 🔹 Barra de filtros flotante */}
      <View style={styles.filterWrapper}>
        <IncomesFilterBar filter={paymentPlace} onChangeFilter={setPaymentPlace} />
      </View>

      {/* 🔹 Lista de pagos con paddingTop para que no tape la barra */}
      {incomes.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No hay pagos disponibles
        </Text>
      ) : (
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
          contentContainerStyle={{ paddingTop: 70 }} // <-- espacio para la barra
          renderItem={({ item, index }) => {
            const currentDate = new Date(item.income_created)
              .toISOString()
              .substring(0, 10);
            const previousDate =
              index > 0
                ? new Date(incomes[index - 1].income_created)
                    .toISOString()
                    .substring(0, 10)
                : null;

            return (
              <ItemIncomeView
                income_created={item.income_created}
                description={item.description}
                payment_method={item.payment_method}
                category={item.category || ""}
                detail={item.detail.toString()}
                amount={item.amount}
                income_id={item.income_id}
                student_id={item.student_id}
                payment_place={item.payment_place}
                showDateHeader={index === 0 || currentDate !== previousDate}
              />
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.4)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
});