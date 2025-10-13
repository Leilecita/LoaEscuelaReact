import React, { useCallback, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../../../core/services/axiosClient";
import { DateHeader } from "../../../core/components/DateHeader";
import { MonthHeader } from "../../../core/components/MonthHeader";
import { PeriodFilter } from "../../../containers/incomes/components/PeriodFilter";
import { COLORS } from "core/constants";
import { usePaginatedFetch } from "../../../core/hooks/usePaginatedFetch";
import { AuthContext } from "../../../contexts/AuthContext";
import { useUsers } from "../../../core/hooks/useUsers";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type DayJob = {
  id: number;
  name: string;
  countPeriod: string;
  category: string;
};

type User = {
  id: number;
  name: string;
  jobs: DayJob[];
};

type DayUsers = {
  day: string;
  users: User[];
};

export const DailyWorksScreen: React.FC = () => {
  const { userId, userRole, userName } = useContext(AuthContext);
  const isAdmin = userRole === "admin";

  const [periodFilter, setPeriodFilter] = useState<"Dia" | "Mes">("Dia");
  const [selectedUser, setSelectedUser] = useState<number | null>(isAdmin ? null : userId);

  const { users } = useUsers(isAdmin, selectedUser ?? undefined);

  function parseISODateToLocalDate(isoDate: string) {
    const parts = isoDate.split("-").map(Number);
    if (parts.length === 2) {
      const [year, month] = parts;
      return new Date(year, month - 1, 1, 12, 0, 0);
    } else if (parts.length === 3) {
      const [year, month, day] = parts;
      return new Date(year, month - 1, day, 12, 0, 0);
    }
    return new Date(isoDate);
  }

  const handlePeriodChange = (newPeriod: "Dia" | "Mes") => {
    setPeriodFilter(newPeriod);
  };

  // ----------------------
  // Fetch principal (trae trabajos por día)
  // ----------------------
  const fetchUsersByDay = async (page: number, period: "Dia" | "Mes", userIdFilter?: number | null) => {
    const { data } = await api.get("/worker_jobs.php", {
      params: {
        method: "getUsersWithJobsByDay",
        page,
        periodFilter: period,
        ...(userIdFilter ? { user_id: userIdFilter } : {}),
      },
    });

    return Array.isArray(data.data) ? data.data : [];
  };

  const fetchUsersByDayPage = useCallback(
    (page: number) => fetchUsersByDay(page, periodFilter, selectedUser),
    [periodFilter, selectedUser]
  );

  const {
    data: daysWithUsers,
    loading,
    loadingMore,
    refreshing,
    error,
    reload,
    loadMore,
  } = usePaginatedFetch<DayUsers>(fetchUsersByDayPage, []);

  useEffect(() => {
    reload();
  }, [selectedUser, periodFilter]);

  // ----------------------
  // Render de cada día
  // ----------------------
  const renderDay = ({ item }: { item: DayUsers }) => (
    <View style={{ marginBottom: 16 }}>
      {periodFilter === "Mes" ? (
        <MonthHeader date={parseISODateToLocalDate(item.day)} />
      ) : (
        <DateHeader date={parseISODateToLocalDate(item.day)} />
      )}

      <View style={styles.usersRow}>
        {item.users.map((user, userIndex) => (
          <View key={`${item.day}-${user.id}-${userIndex}`} style={styles.userCard}>
            <Text style={styles.userName}>{user.name}</Text>

            {user.jobs.length === 0 ? (
              <Text style={styles.noJobs}>No hay trabajos asignados</Text>
            ) : (
              user.jobs.map((job, jobIndex) => (
                <View key={`${user.id}-${job.id}-${jobIndex}`} style={styles.jobRow}>
                  <Text style={styles.jobName}>{job.name}</Text>
                  <Text style={styles.jobCount}>{job.countPeriod}</Text>
                </View>
              ))
            )}
          </View>
        ))}
      </View>
    </View>
  );

  // ----------------------
  // Render principal
  // ----------------------
  return (
    <ImageBackground
      source={require("../../../../assets/fondo.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Filtro Día/Mes y Usuario */}
      <View style={[styles.filterWrapper, { backgroundColor: "rgba(255,255,255,0.32)" }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          <PeriodFilter filter={periodFilter} onChangeFilter={handlePeriodChange} />

          {isAdmin ? (
            <TouchableOpacity
              onPress={() => {
                const userNames = users.map((u) => u.label);
                Alert.alert(
                  "Seleccionar usuario",
                  "",
                  [
                    ...userNames.map((name, idx) => ({
                      text: name,
                      onPress: () => setSelectedUser(users[idx].value),
                    })),
                    { text: "Ver todos", onPress: () => setSelectedUser(null) },
                    { text: "Cancelar", style: "cancel" },
                  ],
                  { cancelable: true }
                );
              }}
              style={styles.userChip}
            >
              <MaterialCommunityIcons
                name="account"
                size={19}
                color={COLORS.darkLetter}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.userChipText}>
                {selectedUser
                  ? users.find((u) => u.value === selectedUser)?.label
                  : "Todos los usuarios"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.userChip}>
              <MaterialCommunityIcons
                name="account"
                size={19}
                color={COLORS.darkLetter}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.userChipText}>{userName || "Usuario"}</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.container}>
        {error && (
          <View style={styles.centered}>
            <Text style={{ color: "red" }}>{error}</Text>
          </View>
        )}

        {loading && daysWithUsers.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : daysWithUsers.length === 0 ? (
          <View style={styles.centered}>
            <Text style={{ color: COLORS.darkLetter, fontSize: 16 }}>
              No hay usuarios o trabajos disponibles
            </Text>
          </View>
        ) : (
          <FlatList
            data={daysWithUsers}
            keyExtractor={(item) => item.day}
            renderItem={renderDay}
            contentContainerStyle={{ paddingBottom: 100 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color={COLORS.primary} /> : null
            }
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
  container: { flex: 1, paddingHorizontal: 16 },
  userName: {
    fontSize: 18,
    fontFamily: "OpenSans-Bold",
    color: COLORS.darkLetter,
    marginBottom: 8,
  },
  noJobs: {
    fontSize: 14,
    fontFamily: "OpenSans-Light",
    color: COLORS.darkLetter3,
    fontStyle: "italic",
  },
  usersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  userCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  jobRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  jobName: {
    fontSize: 15,
    fontFamily: "OpenSans-Regular",
    color: COLORS.darkLetter,
  },
  jobCount: {
    fontSize: 15,
    fontFamily: "OpenSans-Bold",
    color: COLORS.darkLetter,
  },
  filterWrapper: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.chipGreenColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    height: 32,
  },
  userChipText: {
    color: COLORS.darkLetter,
    fontFamily: "OpenSans-Light",
    fontSize: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
