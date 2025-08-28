import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useIncomes } from "../hooks/useIncomes";
import ItemIncomeView from "../components/ItemIncomeView";
import { IncomesFilterBar } from "../components/IncomesFilterBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { PaymentMethodFilter } from "../components/PaymentMethodFilter";
import { EditIncomeModal } from "../components/EditIncomeModal";

// 🔹 Mapeos de filtros para enviar al backend
const FILTER_MAP: Record<string, string> = {
  Todos: "",
  Playa: "escuela",
  Negocio: "negocio",
};

const CATEGORY_FILTER_MAP: Record<string, string> = {
  Todos: "",
  Escuela: "Escuela",
  Colonia: "Colonia",
  Highschool: "Highschool",
};

const PAYMENT_METHOD_MAP: Record<string, string> = {
  Todos: "",
  Efectivo: "efectivo",
  MP: "mp",
  Transferencia: "transferencia",
};

type FilterOption = "Todos" | "Playa" | "Negocio";
type CategoryFilterOption = "Todos" | "Escuela" | "Colonia" | "Highschool";
type PaymentMethodOption = "Todos" | "Efectivo" | "MP" | "Transferencia";

export default function IncomesListScreen() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterOption>("Escuela");
  const [paymentPlace, setPaymentPlace] = useState<FilterOption>("Playa");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethodOption>("Todos");
  const [editingIncome, setEditingIncome] = useState<any>(null);

  const {
    incomes,
    loading,
    loadingMore,
    refreshing,
    loadMore,
    reload,
    error,
  } = useIncomes(
    FILTER_MAP[paymentPlace],
    CATEGORY_FILTER_MAP[categoryFilter],
    PAYMENT_METHOD_MAP[paymentMethodFilter]
  );

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
      
      {/* 🔹 Barra de filtros horizontal */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <IncomesFilterBar filter={paymentPlace} onChangeFilter={setPaymentPlace} />
          <CategoryFilter filter={categoryFilter} onChangeFilter={setCategoryFilter} />
          <PaymentMethodFilter filter={paymentMethodFilter} onChangeFilter={setPaymentMethodFilter} />
        </ScrollView>
      </View>

      {/* 🔹 Lista de pagos */}
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
          contentContainerStyle={{ paddingTop: 80 }}
          renderItem={({ item, index }) => {
            const currentDate = new Date(item.income_created).toISOString().substring(0, 10);
            const previousDate = index > 0 ? new Date(incomes[index - 1].income_created).toISOString().substring(0, 10) : null;

            return (
              <ItemIncomeView
                income_created={item.income_created}
                description={item.description}
                payment_method={item.payment_method}
                category={item.category || ""}
                sub_category={item.sub_category || ""}
                detail={item.detail.toString()}
                amount={item.amount}
                income_id={item.income_id}
                student_id={item.student_id}
                class_course_id={item.class_course_id}
                payment_place={item.payment_place}
                showDateHeader={index === 0 || currentDate !== previousDate}
                onEdit={(income) => setEditingIncome(income)}
              />
            );
          }}
        />
      )}

      {/* 🔹 Modal de edición */}
      <EditIncomeModal
        visible={!!editingIncome}
        income={editingIncome}
        onClose={() => setEditingIncome(null)}
        onSuccess={() => { setEditingIncome(null); reload(); }}
      />
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
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
