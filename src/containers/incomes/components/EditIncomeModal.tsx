import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import Modal from "react-native-modal";
import { COLORS } from "core/constants";
import api from "../../../core/services/axiosClient";

export const EditIncomeModal = ({ visible, onClose, income, onSuccess }: any) => {
  const [activeSegment, setActiveSegment] = useState<"pago" | "categoria">("pago");

  // Campos de pago
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("");
  const [lugar, setLugar] = useState("");
  const [showMetodoOptions, setShowMetodoOptions] = useState(false);
  const [showLugarOptions, setShowLugarOptions] = useState(false);

  // Campos de categoría
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [showCategoriaOptions, setShowCategoriaOptions] = useState(false);
  const [showSubcategoriaOptions, setShowSubcategoriaOptions] = useState(false);

  const metodoRef = useRef<View>(null);
  const lugarRef = useRef<View>(null);

  const medios = ["efectivo", "mp", "transferencia"];
  const lugares = ["escuela", "negocio"];
  const categorias = ["escuela", "colonia", "highschool"];
  const subcategorias = ["adultos", "intermedios", "kids", "mini", "highschool"];

  const { width } = Dimensions.get("window");

  useEffect(() => {
    if (income) {
      setMonto(income.amount?.toString() || "");
      setMetodo(income.payment_method || "");
      setLugar(income.payment_place || "");
      setCategoria(income.category || "");
      setSubcategoria(income.sub_category || "");
    }
  }, [income]);

  const handleUpdate = async () => {
   console.log("class_course_id:", income.class_course_id);
    if (!income) return;

    try {
      if (activeSegment === "pago") {
        await api.put("/incomes.php", {
          id: income.income_id,
          amount: parseFloat(monto),
          payment_method: metodo,
          payment_place: lugar,
        });
      } else {
        await api.put("/class_courses.php", {
          id: income.class_course_id,
          category: categoria,
          sub_category: subcategoria,
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
      <View style={[styles.bottomSheet, { width, height: "80%" }]}>
        <View style={styles.dragHandle} />
        <Text style={styles.title}>Editar Registro</Text>

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
              />

              {/* Método de pago */}
              <View ref={metodoRef}>
                <TouchableOpacity onPress={() => setShowMetodoOptions(!showMetodoOptions)}>
                  <TextInput
                    label="Método de pago"
                    value={metodo}
                    mode="outlined"
                    editable={false}
                    pointerEvents="none"
                    style={styles.input}
                  />
                </TouchableOpacity>
              </View>
              {showMetodoOptions && (
                <TouchableWithoutFeedback onPress={() => setShowMetodoOptions(false)}>
                  <View style={styles.dropdownOverlay}>
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
                </TouchableWithoutFeedback>
              )}

              {/* Lugar de pago */}
              <View ref={lugarRef}>
                <TouchableOpacity onPress={() => setShowLugarOptions(!showLugarOptions)}>
                  <TextInput
                    label="Lugar de pago"
                    value={lugar}
                    mode="outlined"
                    editable={false}
                    pointerEvents="none"
                    style={styles.input}
                  />
                </TouchableOpacity>
              </View>
              {showLugarOptions && (
                <TouchableWithoutFeedback onPress={() => setShowLugarOptions(false)}>
                  <View style={styles.dropdownOverlay}>
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
                </TouchableWithoutFeedback>
              )}
            </>
          )}

          {/* Segmento Categoría */}
          {activeSegment === "categoria" && (
            <>
              <TouchableOpacity onPress={() => setShowCategoriaOptions(!showCategoriaOptions)}>
                <TextInput
                  label="Categoría"
                  value={categoria}
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  style={styles.input}
                />
              </TouchableOpacity>
              {showCategoriaOptions && (
                <TouchableWithoutFeedback onPress={() => setShowCategoriaOptions(false)}>
                  <View style={styles.dropdownOverlay}>
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
                </TouchableWithoutFeedback>
              )}

              <TouchableOpacity onPress={() => setShowSubcategoriaOptions(!showSubcategoriaOptions)}>
                <TextInput
                  label="Subcategoría"
                  value={subcategoria}
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  style={styles.input}
                />
              </TouchableOpacity>
              {showSubcategoriaOptions && (
                <TouchableWithoutFeedback onPress={() => setShowSubcategoriaOptions(false)}>
                  <View style={styles.dropdownOverlay}>
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
                </TouchableWithoutFeedback>
              )}
            </>
          )}

          {/* Botones */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: COLORS.backgroundVioletClear,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    marginBottom: 0,
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
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: COLORS.darkLetter,
  },
  segmentedContainer: { flexDirection: "row", borderRadius: 8, overflow: "hidden", marginBottom: 10 },
  segment: { flex: 1, paddingVertical: 10, backgroundColor: COLORS.buttonClear, alignItems: "center" },
  segmentActive: { backgroundColor: COLORS.button },
  segmentText: { color: COLORS.buttonClearLetter },
  segmentTextActive: { color: "#fff", fontWeight: "600" },
  input: { marginVertical: 4, borderRadius: 10 },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 9998,
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
  },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  buttonsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  cancelButton: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, borderRadius: 8 },
  submitButton: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: COLORS.buttonClear, borderRadius: 8 },
  buttonText: { color: COLORS.buttonClearLetter, fontSize: 14 },
});
