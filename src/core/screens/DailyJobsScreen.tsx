import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Alert,
  Dimensions,
  Modal, TextInput,
} from "react-native";
import { Chip } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { AuthContext } from "../../contexts/AuthContext";
import { COLORS } from "../constants";
import { useJobs, DayJob } from "../hooks/useJobs";
import { useUsers } from "../hooks/useUsers";
import api from "../services/axiosClient";
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;
const CARD_MARGIN = 10;

type JobSection = { title: string; data: DayJob[] };

export const DailyJobsScreen: React.FC = () => {
  const { userId, userRole, userName } = useContext(AuthContext);
  const isAdmin = userRole === "admin";

  const navigation = useNavigation<any>();

  const [selectedUser, setSelectedUser] = useState<number | null>(userId);
  const { users } = useUsers(isAdmin, selectedUser ?? undefined);

  const { jobs, loading: jobsLoading, selectedJobs, setSelectedJobs, fetchSelectedJobs, fetchJobs } = useJobs();
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({}); // <--- Acordeón

  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const today = dayjs().format("YYYY-MM-DD");
  const isToday = formattedDate === today;
  const canEdit = isAdmin || (userRole === "empleado" && isToday);

  const [showJobsModal, setShowJobsModal] = useState(false);
  const [hasShownJobsModal, setHasShownJobsModal] = useState(false);
  const [initialJobsCount, setInitialJobsCount] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [newJobCategory, setNewJobCategory] = useState("otro");
  const openCreateJobModal = () => {
   setNewJobName("");
   setNewJobCategory("otro");
   setModalVisible(true);
 };

 const createJobFromModal = async () => {
  if (!newJobName.trim()) {
    return Alert.alert("Error", "El nombre no puede estar vacío");
  }

  const payload = {
    name: newJobName.trim(),
    category: isAdmin ? newJobCategory.trim() || "otro" : "otro",
  };

  try {
    setSaving(true);
    const response = await api.post("/day_jobs.php", JSON.stringify(payload), {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.result !== "success") {
      throw new Error(response.data.message || "Error al crear trabajo");
    }

    await fetchJobs();
    Alert.alert("Éxito", `Trabajo "${newJobName}" creado correctamente`);
    setModalVisible(false);
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "No se pudo crear el trabajo");
  } finally {
    setSaving(false);
  }
};

  // ----------------------
  // Cargar trabajos seleccionados
  // ----------------------
 
  useEffect(() => {
   if (selectedUser !== null) {
     setSelectedJobs([]);
     fetchSelectedJobs(selectedUser, selectedDate).then((jobsFetched) => {
       setInitialJobsCount(jobsFetched.length);
     });
   }
 }, [selectedUser, selectedDate]);

  // ----------------------
  // Toggle selección
  // ----------------------
  const toggleJob = (id: number) => {
    setSelectedJobs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
 
 useEffect(() => {
  if (initialJobsCount > 0 && !hasShownJobsModal && isToday) {
    setShowJobsModal(true);
    setHasShownJobsModal(true);
  }
}, [initialJobsCount, hasShownJobsModal]);

  const handleCreateJob = () => {
    openCreateJobModal();
  };
 
  // Guardar trabajos seleccionados
  const handleSave = async () => {
    if (saving || !canEdit) return;

    const workerId = selectedUser || userId;
    if (!workerId) return Alert.alert("Error", "No se pudo determinar el usuario.");
    if (selectedJobs.length === 0) return Alert.alert("Atención", "Seleccioná al menos un trabajo.");

    const selectedJobNames = jobs
      .filter((job) => selectedJobs.includes(job.id))
      .map((job) => `• ${job.name}`)
      .join("\n");

    const formattedDisplayDate = new Date(selectedDate).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const userDisplayName =
      (isAdmin ? users.find((u) => u.value === selectedUser)?.label : userName) || "Usuario";

    const message = `\u200B${userDisplayName} \n\nTrabajos seleccionados:\n${selectedJobNames}`;

    Alert.alert(
      "Confirmar selección",
      message,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setSaving(true);
            try {
              const payload = selectedJobs.map((jobId) => ({
                worker_id: workerId,
                job_id: jobId,
                date: formattedDate,
              }));

              const response = await api.post(
                "/worker_jobs.php",
                JSON.stringify(payload),
                { headers: { "Content-Type": "application/json" } }
              );

              if (response.data.result !== "success") {
                throw new Error(response.data.message || "Error al guardar trabajos");
              }

              Alert.alert("Éxito", "Los trabajos se guardaron correctamente.");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "No se pudieron guardar los trabajos.");
            } finally {
              setSaving(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // ----------------------
  // Agrupar trabajos por categoría
  // ----------------------
  const groupedJobs: JobSection[] = Object.entries(
    jobs.reduce((acc: Record<string, DayJob[]>, job) => {
      const cat = job.category || "Sin categoría";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(job);
      return acc;
    }, {})
  ).map(([title, data]) => ({ title, data }));

  // ----------------------
  // Render de cada trabajo
  // ----------------------
  const renderJob = ({ item }: { item: DayJob }) => {
    const isSelected = selectedJobs.includes(item.id);
    return (
      <TouchableOpacity onPress={() => canEdit && toggleJob(item.id)} activeOpacity={canEdit ? 0.8 : 1}>
        <View style={[styles.card, isSelected && styles.cardSelected, !canEdit && { opacity: 0.6 }]}>
          <View style={styles.cardContent}>
            <Text style={styles.jobTitle}>{item.name}</Text>
            {isSelected && <MaterialCommunityIcons name="check-circle" size={26} color={COLORS.darkGreenColor} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = ({ section }: { section: JobSection }) => {
    const isOpen = openSections[section.title] ?? section.title.toLowerCase() !== "otro"; 
    const toggleSection = () => {
      setOpenSections((prev) => ({ ...prev, [section.title]: !isOpen }));
    };

    return (
     
     <View style={{ marginTop: 4 }}>
        <TouchableOpacity style={styles.categoryHeader} onPress={toggleSection}>
          <Text style={styles.categoryHeaderText}>
            {section.title}
          </Text>
          {section.title.toLowerCase() === "otro" && (
            <MaterialCommunityIcons
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={22}
              color={COLORS.darkLetter}
            />
          )}
        </TouchableOpacity>
      
        {isOpen && (
          <View style={styles.sectionContent}>
            {section.data.map((job) => (
              <View key={job.id.toString()}>{renderJob({ item: job })}</View>
            ))}
          </View>
        )}
      </View>
   
    );
  };

  // ----------------------
  // Render principal
  // ----------------------
  return (
    <ImageBackground source={require("../../../assets/fondo.png")} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        {/* --- FILTROS --- */}
        <View style={styles.filterBar}>
         
          {/* --- SELECTOR DE FECHA CON MODAL --- */}
           <TouchableOpacity
             onPress={() => setShowDatePicker(true)}
             style={[styles.chip, { flexDirection: "row", alignItems: "center", paddingRight: 12, paddingLeft: 8, paddingVertical: 7 }]}
           >
             <MaterialCommunityIcons name="calendar" size={19} color={COLORS.darkLetter}/>
             <Text
               style={{
                 marginLeft: 6,
                 color: COLORS.darkLetter,
                 fontFamily: "OpenSans-Light",
                 fontSize: 15,
               }}
             >
               {dayjs(selectedDate).format("DD/MM/YYYY")}
             </Text>
           </TouchableOpacity>

           {/* Modal estilo iOS/Android */}
           <Modal
             transparent
             visible={showDatePicker}
             animationType="fade"
             onRequestClose={() => setShowDatePicker(false)}
             onShow={() => setTempDate(selectedDate)}
           >
             <View
               style={{
                 flex: 1,
                 justifyContent: "center",
                 alignItems: "center",
                 backgroundColor: "rgba(0,0,0,0.4)",
               }}
             >
               <View
                 style={{
                   backgroundColor: "#fff",
                   borderRadius: 16,
                   padding: 20,
                   width: "85%",
                   alignItems: "center",
                 }}
               >
                 <Text
                   style={{
                     fontSize: 16,
                     fontFamily: "OpenSans-SemiBold",
                     color: COLORS.darkLetter,
                     marginBottom: 12,
                   }}
                 >
                   Seleccionar fecha
                 </Text>

                 <DateTimePicker
                   value={tempDate}
                   mode="date"
                   display="spinner"
                   onChange={(event, date) => {
                     if (date) setTempDate(date);
                   }}
                 />

                 <TouchableOpacity
                   onPress={() => {
                     setSelectedDate(tempDate);
                     setShowDatePicker(false);
                   }}
                   style={{
                     marginTop: 14,
                     backgroundColor: COLORS.headerDate,
                     paddingVertical: 10,
                     paddingHorizontal: 30,
                     borderRadius: 10,
                   }}
                 >
                   <Text style={{ color: "white", fontFamily: "OpenSans-SemiBold" }}>Aceptar</Text>
                 </TouchableOpacity>

               </View>
             </View>
           </Modal>


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
                    { text: "Cancelar", style: "cancel" },
                  ],
                  { cancelable: true }
                );
              }}
              style={[styles.chip, styles.userChip]}
            >
              <MaterialCommunityIcons name="account" size={19} color={COLORS.darkLetter} style={{ marginRight: 6 }} />
              <Text style={styles.chipText}>
                {users.find((u) => u.value === selectedUser)?.label || "Seleccionar usuario"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.chip, styles.userChip]}>
              <MaterialCommunityIcons name="account" size={19} color={COLORS.darkLetter} style={{ marginRight: 6 }} />
              <Text style={styles.chipText}>{userName || "Usuario"}</Text>
            </View>
          )}

          <Chip
            icon={() => <MaterialCommunityIcons name="plus" size={19} color={COLORS.darkLetter} />}
            mode="flat"
            selected
            onPress={handleCreateJob}
            style={styles.chip}
            textStyle={{ color: COLORS.darkLetter, fontFamily: "OpenSans-Light", fontSize: 15 }}
          >
            Crear trabajo
          </Chip>
        </View>

        {jobsLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : jobs.length === 0 ? (
          <View style={styles.centered}>
            <Text style={{ color: COLORS.darkLetter, fontSize: 16 }}>No hay trabajos disponibles</Text>
          </View>
        ) : (
          <SectionList
            sections={groupedJobs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={() => null}
            renderSectionHeader={renderSection}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ paddingBottom: 100, paddingHorizontal:12 }}
          />
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            (saving || !canEdit) && { opacity: 0.5, backgroundColor: COLORS.transparentGreenColor },
          ]}
          onPress={handleSave}
          disabled={saving || !canEdit}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Guardando..." : canEdit ? "Guardar trabajos" : "Guardar trabajos (no permitido)"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{
            width: "90%",
            padding: 20,
            backgroundColor: "white",
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <Text style={{ fontSize: 18, fontFamily: "OpenSans-SemiBold", color: COLORS.darkLetter, marginBottom: 12 }}>
              Nuevo trabajo
            </Text>

            <Text style={{ fontFamily: "OpenSans-Regular", color: COLORS.darkLetter }}>Nombre:</Text>
            <TextInput
              value={newJobName}
              onChangeText={setNewJobName}
              placeholder="Nombre del trabajo"
              style={{
                borderWidth: 1,
                borderColor: COLORS.chipGreenColor,
                borderRadius: 8,
                padding: 10,
                marginBottom: 12,
                fontFamily: "OpenSans-Regular",
                color: COLORS.darkLetter,
              }}
            />

            {isAdmin && (
              <>
                <Text style={{ fontFamily: "OpenSans-Regular", color: COLORS.darkLetter }}>Categoría:</Text>
                <TextInput
                  value={newJobCategory}
                  onChangeText={setNewJobCategory}
                  placeholder="Categoría"
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.chipGreenColor,
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 12,
                    fontFamily: "OpenSans-Regular",
                    color: COLORS.darkLetter,
                  }}
                />
              </>
            )}

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.transparentGreenColor,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: COLORS.darkLetter, fontFamily: "OpenSans-SemiBold" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.headerDate,
                }}
                onPress={createJobFromModal}
              >
                <Text style={{ color: "white", fontFamily: "OpenSans-SemiBold" }}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {showJobsModal && (
         <Modal
           transparent
           animationType="fade"
           visible={showJobsModal}
           onRequestClose={() => setShowJobsModal(false)}
         >
           <View style={{
             flex: 1,
             justifyContent: "center",
             alignItems: "center",
             backgroundColor: "rgba(0,0,0,0.5)",
           }}>
             <View style={{
               width: "85%",
               padding: 20,
               backgroundColor: "white",
               borderRadius: 12,
               shadowColor: "#000",
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.25,
               shadowRadius: 4,
               elevation: 5,
             }}>
               <Text style={{ fontSize: 18, fontFamily: "OpenSans-SemiBold", color: COLORS.darkLetter, marginBottom: 12 }}>
                 ⚠️ Trabajos ya cargados
               </Text>

               <View style={{ maxHeight: 200, marginBottom: 20 }}>
                 {selectedJobs.map((jobId) => {
                   const job = jobs.find((j) => j.id === jobId);
                   if (!job) return null;
                   return (
                     <Text key={jobId} style={{ fontFamily: "OpenSans-Regular", fontSize: 16, color: COLORS.darkLetter }}>
                       • {job.name} ({job.category || "Sin categoría"})
                     </Text>
                   );
                 })}
               </View>

               <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
                 {/* Cerrar: ir al Home */}
                 <TouchableOpacity
                   style={{
                     paddingVertical: 10,
                     paddingHorizontal: 16,
                     borderRadius: 8,
                     backgroundColor: COLORS.transparentGreenColor,
                   }}
                   onPress={() => {
                     setShowJobsModal(false);
                     setTimeout(() => navigation.navigate("MainApp"), 100);
                   }}
                 >
                   <Text style={{ color: COLORS.darkLetter, fontFamily: "OpenSans-SemiBold" }}>Cerrar</Text>
                 </TouchableOpacity>

                 {/* Editar: cerrar modal y quedarse */}
                 <TouchableOpacity
                   style={{
                     paddingVertical: 10,
                     paddingHorizontal: 16,
                     borderRadius: 8,
                     backgroundColor: COLORS.headerDate,
                   }}
                   onPress={() => setShowJobsModal(false)}
                 >
                   <Text style={{ color: "white", fontFamily: "OpenSans-SemiBold" }}>Editar</Text>
                 </TouchableOpacity>
               </View>

             </View>
           </View>
         </Modal>
       )}
    </ImageBackground>
  );
};

// ----------------------
// Estilos
// ----------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  filterBar: { flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 10, zIndex: 10, paddingHorizontal: 16, paddingTop:12 },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "OpenSans-SemiBold",
    color: COLORS.darkLetter,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (screenWidth - 32 - CARD_MARGIN) / 2,
    marginBottom: 10,
    borderRadius: 15,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: COLORS.darkGreenColor,
    backgroundColor: "rgba(255,255,255,1)",
  },
  cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  jobTitle: { fontSize: 17, fontFamily: "OpenSans-Regular", color: COLORS.darkLetter },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.chipGreenColor,
    borderRadius: 8,
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.chipGreenColor,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    height: 35,
  },
  chipText: { color: COLORS.darkLetter, fontFamily: "OpenSans-Light", fontSize: 15 },
  saveButton: {
    backgroundColor: COLORS.headerDate,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    marginBottom: 16,
  },
  saveButtonText: { color: "#fff", fontSize: 17, fontFamily: "OpenSans-Regular" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  categoryHeader: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "space-between",
   //backgroundColor: "rgba(223, 237, 71, 0.42)", // tono similar al de InformationStudentScreen
   backgroundColor: COLORS.transparentGreyColor,
   paddingVertical: 6,
   paddingHorizontal: 16,
   marginHorizontal: -12,
   marginBottom: 16,
 },
 
 categoryHeaderText: {
   fontFamily: "OpenSans-Regular",
   fontSize: 16,
   color: COLORS.darkLetter,
 },
 
});
