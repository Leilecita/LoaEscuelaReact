import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "core/constants";

type FilterOption = "Todos" | "Escuela" | "Colonia" | "Highschool";

type Props = {
  filter: FilterOption;
  onChangeFilter: (value: FilterOption) => void;
};

export const CategoryFilter: React.FC<Props> = ({ filter, onChangeFilter }) => {
  const options: FilterOption[] = ["Todos", "Escuela", "Colonia", "Highschool"];
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

  const handleSelect = (value: FilterOption) => {
    onChangeFilter(value);
    toggleDropdown();
  };

  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, options.length * 40],
  });

  const getIcon = (option: FilterOption) => {
    switch (option) {
      case "Escuela":
        return "school";
      case "Colonia":
        return "home-city";
      case "Highschool":
        return "school-outline";
      default:
        return "filter";
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.chip} onPress={toggleDropdown}>
        <MaterialCommunityIcons name={getIcon(filter)} size={20} color={COLORS.darkLetter} />
        <Text style={styles.chipText}>{filter}</Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={COLORS.darkLetter}
        />
      </TouchableOpacity>

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
  container: { width: 145, marginRight: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.chipGreenColor,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: { color: COLORS.darkLetter, fontSize: 16, marginHorizontal: 4 },
  dropdown: { overflow: "hidden", backgroundColor: COLORS.chipGreenColor, borderRadius: 12, marginTop: 4 },
  dropdownItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 40 },
  dropdownText: { fontSize: 16, color: COLORS.darkLetter, marginLeft: 6 },
});
