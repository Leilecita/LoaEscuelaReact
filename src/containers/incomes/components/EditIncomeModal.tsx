import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import { TextInput } from "react-native-paper";
import Modal from "react-native-modal";
import { COLORS } from "core/constants";
import api from "../../../core/services/axiosClient";

export const EditIncomeModal = ({ visible, onClose, income, onSuccess }: any) => {
  const [activeSegment, setActiveSegment] = useState<"pago" | "categoria">("pago");

  // Campos de pago
  const [monto, setMonto] = useState("");
  const [montoCurso, setMontoCurso] = useState("");
  const [description, setDescription] = useState("");
  const [metodo, setMetodo] = useState("");
  const [lugar, setLugar] = useState("");
  const [showMetodoOptions, setShowMetodoOptions] = useState(false);
  const [showLugarOptions, setShowLugarOptions] = useState(false);
  const [detail, setDetail] = useState("");

  // Campos de categoría
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [showCategoriaOptions, setShowCategoriaOptions] = useState(false);
  const [showSubcategoriaOptions, setShowSubcategoriaOptions] = useState(false);

  const medios = ["efectivo", "mp", "transferencia"];
  const lugares = ["escuela", "negocio"];
  const categorias = ["escuela", "colonia", "highschool"];
  const subcategorias = ["adultos", "intermedios", "kids", "mini", "highschool"];

  const { width } = Dimensions.get("window");

  useEffect(() => {
    if (income) {
      setMonto(income.amount?.toString() || "");
      setMontoCurso(income.course_amount?.toString() || "");
      setMetodo(income.payment_method || "");
      setLugar(income.payment_place || "");
      setCategoria(income.category || "");
      setSubcategoria(income.sub_category || "");
      setDescription(income.description || "");
      setDetail(income.detail || "");
    }
  }, [income]);

  const handleUpdate = async () => {
    if (!income) return;

    try {
      if (activeSegment === "pago") {
        await api.put("/incomes.php", {
          id: income.income_id,
          amount: parseFloat(monto),
          payment_method: metodo,
          payment_place: lugar,
        });

        await api.put("/incomes_class_courses.php", {
          id: income.income_class_course_id,
          income_id: income.income_id,
          class_course_id: income.class_course_id,
          detail: detail,
        });
      } else {
        await api.put("/class_courses.php", {
          id: income.class_course_id,
          category: categoria,
          sub_category: subcategoria,
          amount: parseFloat(montoCurso),
        });
      }

      onSuccess?.();
      onClose();
    } catch (e: any) {
      alert(e.message || "Error al actualizar");
    }
  };

  if (!income) return null;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
      avoidKeyboard
      propagateSwipe
    >
      <ImageBackground source={require("../../../../assets/fondo.png")} resizeMode="cover">
        <View style={[styles.bottomSheet, { width, height: "80%" }]}>
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.studentName}>{description} </Text>
            <Text style={styles.title}>Editar Pago</Text>
          </View>

          {/* Segment control */}
          <View style={styles.segmentedContainer}>
            <TouchableOpacity
              style={[styles.segment, activeSegment === "pago" && styles.segmentActive]}
              onPress={() => setActiveSegment("pago")}
            >
              <Text style={[styles.segmentText, activeSegment === "pago" && styles.segmentTextActive]}>
                Pago
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, activeSegment === "categoria" && styles.segmentActive]}
              onPress={() => setActiveSegment("categoria")}
            >
              <Text style={[styles.segmentText, activeSegment === "categoria" && styles.segmentTextActive]}>
                Categoría
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Segmento Pago */}
            {activeSegment === "pago" && (
              <>
                <TextInput
                  label="Monto"
                  value={monto}
                  onChangeText={setMonto}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  outlineColor={COLORS.veryLightGreenColor}
                  activeOutlineColor={COLORS.lightGreenColor}
                  textColor={COLORS.darkLetter3}
                />

                {/* Método de pago */}
                <TouchableOpacity onPress={() => setShowMetodoOptions((s) => !s)}>
                  <TextInput
                    label="Método de pago"
                    value={metodo}
                    mode="outlined"
                    editable={false}
                    pointerEvents="none"
                    style={styles.input}
                    outlineColor={COLORS.veryLightGreenColor}
                    activeOutlineColor={COLORS.lightGreenColor}
                    textColor={COLORS.darkLetter3}
                  />
                </TouchableOpacity>

                {/* Lugar de pago */}
                <TouchableOpacity onPress={() => setShowLugarOptions((s) => !s)}>
                  <TextInput
                    label="Lugar de pago"
                    value={lugar}
                    mode="outlined"
                    editable={false}
                    pointerEvents="none"
                    style={styles.input}
                    outlineColor={COLORS.veryLightGreenColor}
                    activeOutlineColor={COLORS.lightGreenColor}
                    textColor={COLORS.darkLetter3}
                  />
                </TouchableOpacity>

                <TextInput
                  label="Concepto / Detalle"
                  value={detail}
                  onChangeText={setDetail}
                  mode="outlined"
                  style={[styles.input, { marginBottom: 2 }]}
                  outlineColor={COLORS.veryLightGreenColor}
                  activeOutlineColor={COLORS.lightGreenColor}
                  textColor={COLORS.darkLetter3}
                />
              </>
            )}

            {/* Segmento Categoría */}
            {activeSegment === "categoria" && (
              <>
                <TextInput
                  label="Monto curso"
                  value={montoCurso}
                  onChangeText={setMontoCurso}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  outlineColor={COLORS.veryLightGreenColor}
                  activeOutlineColor={COLORS.lightGreenColor}
                  textColor={COLORS.darkLetter3}
                />
                <TouchableOpacity onPress={() => setShowCategoriaOptions((s) => !s)}>
                  <TextInput
                    label="Categoría"
                    value={categoria}
                    mode="outlined"
                    editable={false}
                    pointerEvents="none"
                    style={styles.input}
                    outlineColor={COLORS.veryLightGreenColor}
                    activeOutlineColor={COLORS.lightGreenColor}
                    textColor={COLORS.darkLetter3}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowSubcategoriaOptions((s) => !s)}>
                  <TextInput
                    label="Subcategoría"
                    value={subcategoria}
                    mode="outlined"
                    editable={false}
                    pointerEvents="none"
                    style={styles.input}
                    outlineColor={COLORS.veryLightGreenColor}
                    activeOutlineColor={COLORS.lightGreenColor}
                    textColor={COLORS.darkLetter3}
                  />
                </TouchableOpacity>
              </>
            )}

            {/* Botones */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonTextCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/** ---------- GLOBAL OVERLAYS (fuera del ScrollView) ---------- **/}
          {/* Método de pago dropdown */}
          {showMetodoOptions && (
            <View style={styles.globalOverlay} pointerEvents="box-none">
              <TouchableOpacity style={styles.touchableBackground} onPress={() => setShowMetodoOptions(false)} />
              <View style={[styles.dropdown, { top: 60 }]}>
                {medios.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMetodo(m);
                      setShowMetodoOptions(false);
                    }}
                  >
                    <Text>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Lugar de pago dropdown */}
          {showLugarOptions && (
            <View style={styles.globalOverlay} pointerEvents="box-none">
              <TouchableOpacity style={styles.touchableBackground} onPress={() => setShowLugarOptions(false)} />
              <View style={[styles.dropdown, { top: 140 }]}>
                {lugares.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setLugar(l);
                      setShowLugarOptions(false);
                    }}
                  >
                    <Text>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Categoría dropdown */}
          {showCategoriaOptions && (
            <View style={styles.globalOverlay} pointerEvents="box-none">
              <TouchableOpacity style={styles.touchableBackground} onPress={() => setShowCategoriaOptions(false)} />
              <View style={[styles.dropdown, { top: 60 }]}>
                {categorias.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCategoria(c);
                      setShowCategoriaOptions(false);
                    }}
                  >
                    <Text>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Subcategoría dropdown */}
          {showSubcategoriaOptions && (
            <View style={styles.globalOverlay} pointerEvents="box-none">
              <TouchableOpacity style={styles.touchableBackground} onPress={() => setShowSubcategoriaOptions(false)} />
              <View style={[styles.dropdown, { top: 140 }]}>
                {subcategorias.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSubcategoria(s);
                      setShowSubcategoriaOptions(false);
                    }}
                  >
                    <Text>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    marginBottom: 0,
    backgroundColor: "transparent",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: COLORS.darkLetter3,
    fontFamily: "OpenSans-Regular",
    marginBottom: 12,
    textAlign: "center",
  },
  studentName: {
    fontSize: 18,
    color: COLORS.darkLetter2,
    marginBottom: 4,
    textAlign: "center",
    fontFamily: "OpenSans-Regular",
  },

  segmentedContainer: {
    flexDirection: "row",
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  segment: { flex: 1, paddingVertical: 10, backgroundColor: COLORS.veryLightGreenColor, alignItems: "center" },
  segmentActive: { backgroundColor: COLORS.headerDate },
  segmentText: { color: COLORS.buttonClearLetter, fontFamily: "OpenSans-Regular", fontSize: 16 },
  segmentTextActive: { color: "#fff", fontFamily: "OpenSans-Regular", fontSize: 16 },
  input: { marginVertical: 4, borderRadius: 10 },
  globalOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9998,
  },
  touchableBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  dropdown: {
    position: "absolute",
    width: "90%",
    left: "5%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 9999,
    elevation: 20,
  },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  buttonsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  cancelButton: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, borderRadius: 8 },
  submitButton: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: COLORS.headerDate, borderRadius: 8 },
  buttonText: { color: COLORS.whiteLetter, fontSize: 17 },
  buttonTextCancelar: { color: COLORS.buttonClearLetter, fontSize: 17 },
  header: {
    alignItems: "center",
  },
});
