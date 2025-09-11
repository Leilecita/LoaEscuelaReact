// src/core/navigation/ResumenTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DailySummaryScreen } from "../screens/DailySummaryScreen";
import { PresentsSummaryScreen } from "../screens/PresentsSummaryScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from 'core/constants'

const Tab = createBottomTabNavigator();
const ICON_COLOR = 'rgb(255, 255, 255)'

export const ResumenTabs = () => {
  return (
  
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ICON_COLOR,
        tabBarInactiveTintColor: COLORS.lightGreenColor,
        tabBarStyle: {
          backgroundColor: COLORS.darkGreenColor,        // 👈 Fondo de la barra bottom tabs
          borderTopColor: COLORS.darkGreenColor,           // Borde superior
          height: 80,                        // Altura del tab bar
        },
      }}
    >
      <Tab.Screen
        name="Pagos"
        component={DailySummaryScreen}
        options={{
          tabBarLabel: "Pagos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-multiple" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Presentes"
        component={PresentsSummaryScreen}
        options={{
          tabBarLabel: "Presentes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
