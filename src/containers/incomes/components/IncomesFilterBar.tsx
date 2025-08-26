import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Chip } from "react-native-paper";
import { COLORS } from "core/constants";

type Props = {
  filter: "Todos" | "Playa" | "Negocio";
  onChangeFilter: (value: "Todos" | "Playa" | "Negocio") => void;
};

export const IncomesFilterBar: React.FC<Props> = ({ filter, onChangeFilter }) => {
  const options: ("Todos" | "Playa" | "Negocio")[] = ["Todos", "Playa", "Negocio"];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScrollContainer}
      >
        {options.map((option) => {
          let iconName = '';
          if (option === 'Playa') iconName = 'beach';
          else if (option === 'Negocio') iconName = 'store';
          else iconName = 'filter'; // para "Todos"

          return (
            <Chip
              key={option}
              mode="flat"
              selected={filter === option}
              onPress={() => onChangeFilter(option)}
              icon={iconName}
              style={[
                styles.chip,
                filter === option
                  ? { backgroundColor: COLORS.buttonClear }
                  : { backgroundColor: "#ede7f6" },
              ]}
              textStyle={{
                color: COLORS.darkLetter,
                fontFamily: "OpenSans-Light",
                fontSize: 16,
              }}
            >
              {option}
            </Chip>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 4,
  },
  chipScrollContainer: {
    paddingVertical: 4,
    paddingRight: 8,
    marginLeft: 0,
  },
  chip: {
    marginRight: 8,
    marginLeft: 0,
    paddingLeft: 2,
    borderRadius: 8,
  },
});
