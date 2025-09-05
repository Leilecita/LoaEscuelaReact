import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "core/constants";

type PaymentMethodOption = "Todos" | "Efectivo" | "MP" | "Transferencia";

type Props = {
  filter: PaymentMethodOption;
  onChangeFilter: (value: PaymentMethodOption) => void;
};

export const PaymentMethodFilter: React.FC<Props> = ({ filter, onChangeFilter }) => {
  const options: PaymentMethodOption[] = ["Todos", "Efectivo", "MP", "Transferencia"];
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    Animated.timing(animation, {
      toValue: open ? 0 : 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  const handleSelect = (value: PaymentMethodOption) => {
    onChangeFilter(value);
    toggleDropdown();
  };

  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, options.length * 40],
  });

  const getIcon = (option: PaymentMethodOption) => {
    switch (option) {
      case "Efectivo":
        return "cash";
      case "MP":
        return "cellphone";
      case "Transferencia":
        return "bank-transfer";
      default:
        return "filter";
    }
  };

  return (
    <View style={styles.container}>
      {/* Chip principal */}
      <TouchableOpacity style={styles.chip} onPress={toggleDropdown}>
        <MaterialCommunityIcons name={getIcon(filter)} size={20} color={COLORS.darkLetter} />
        <Text style={styles.chipText}>{filter}</Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={COLORS.darkLetter}
        />
      </TouchableOpacity>

      {/* Dropdown */}
      <Animated.View style={[styles.dropdown, { height: dropdownHeight }]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.dropdownItem}
            onPress={() => handleSelect(option)}
          >
            <MaterialCommunityIcons name={getIcon(option)} size={18} color={COLORS.darkLetter} />
            <Text style={styles.dropdownText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 140, marginRight: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor:  COLORS.chipGreenColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: { color: COLORS.darkLetter, fontSize: 16, marginHorizontal: 6 },
  dropdown: { overflow: "hidden", backgroundColor:  COLORS.chipGreenColor, borderRadius: 12, marginTop: 4 },
  dropdownItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 40 },
  dropdownText: { fontSize: 16, color: COLORS.darkLetter, marginLeft: 6 },
});
