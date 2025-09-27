import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StudentAssistListScreen } from '../../containers/students/screens/StudentAssistListScreen'
import { Category, Subcategoria } from 'types'
import { COLORS } from 'core/constants'
import { AuthContext } from '../../contexts/AuthContext'
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator()
const ICON_COLOR = 'rgb(255, 255, 255)'

const tabs = [
  { title: 'Adultos', category: 'escuela' as Category, subcategoria: 'adultos' as Subcategoria, iconName: 'account' },
  { title: 'Intermedios', category: 'Escuela' as Category, subcategoria: 'intermedios' as Subcategoria, iconName: 'human' },
  { title: 'Mini', category: 'Colonia' as Category, subcategoria: 'mini' as Subcategoria, iconName: 'baby-face-outline' },
  { title: 'Kids', category: 'Colonia' as Category, subcategoria: 'kids' as Subcategoria, iconName: 'teddy-bear' },
  { title: 'High', category: 'Highschool' as Category, subcategoria: 'highschool' as Subcategoria, iconName: 'school' },
]

// función que decide tab inicial
const getInitialTab = (username: string) => {
  const lower = username.toLowerCase()
  if (['flor', 'marieta'].includes(lower)) return 'Mini'
  if (['delfi', 'gucho'].includes(lower)) return 'Kids'
  return 'Adultos' 
}

export const AppTabs = () => {
  const { userName } = useContext(AuthContext) // asumo que acá tenés el name
  const username = userName || ''        // ⚡ revisá el campo exacto
  const initialTab = getInitialTab(username)

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: ICON_COLOR,
        tabBarInactiveTintColor: COLORS.lightGreenColor,
        tabBarStyle: {
          backgroundColor: COLORS.darkGreenColor,
          borderTopColor: COLORS.darkGreenColor,
          height: Platform.OS === 'android' ? 60 : 80, // ⚡ Ajuste por plataforma
          paddingBottom: Platform.OS === 'android' ? 10 : 20, // opcional, para el safe area
        },
        tabBarIcon: ({ color }) => {
          const tab = tabs.find(t => t.title === route.name)
          const iconName = tab?.iconName || 'help-circle'
          return <MaterialCommunityIcons name={iconName} color={color} size={26} />
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
          fontFamily: 'OpenSans-Regular',
        },
      })}
    >
      {tabs.map(({ title, category, subcategoria }) => (
        <Tab.Screen
          key={title}
          name={title}
          children={() => (
            <StudentAssistListScreen category={category} subcategoria={subcategoria} />
          )}
        />
      ))}
    </Tab.Navigator>
  )
}
