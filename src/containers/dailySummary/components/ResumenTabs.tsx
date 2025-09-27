// src/core/navigation/ResumenTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DailySummaryScreen } from "../screens/DailySummaryScreen";
import { PresentsSummaryScreen } from "../screens/PresentsSummaryScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from 'core/constants'
import { Platform } from 'react-native';

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
          height: Platform.OS === 'android' ? 60 : 80, // ⚡ Ajuste por plataforma
          paddingBottom: Platform.OS === 'android' ? 10 : 20, // opcional, para el safe area
        },
      }}
    >
      <Tab.Screen
        name="Pagos"
        component={DailySummaryScreen}
        options={{
          tabBarLabelStyle: {
            fontSize: 13, 
            marginTop: 2,
            fontFamily: 'OpenSans-Regular'  // 👈 también podés agrandar el texto debajo
          },
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
          tabBarLabelStyle: {
            fontSize: 13, 
            marginTop: 2,
            fontFamily: 'OpenSans-Regular'  // 👈 también podés agrandar el texto debajo
          },
          tabBarLabel: "Presentes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
