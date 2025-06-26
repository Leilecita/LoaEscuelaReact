import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { StudentListScreen } from '../../containers/students/screens/StudentListScreen'
import { StudentAssistListScreen } from '../../containers/students/screens/StudentAssistListScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Category, Subcategoria } from 'types'


const Tab = createBottomTabNavigator()
const ICON_COLOR = '#9161d4'
const tabs = [
  { title: 'Adultos', category: 'escuela' as Category, subcategoria: 'adultos' as Subcategoria, iconName: 'account' },
  { title: 'Intermedios', category: 'Escuela' as Category, subcategoria: 'intermedios' as Subcategoria, iconName: 'human' },
  { title: 'Mini', category: 'Colonia' as Category, subcategoria: 'mini' as Subcategoria, iconName: 'baby-face-outline' },
  { title: 'Kids', category: 'Colonia' as Category, subcategoria: 'kids' as Subcategoria, iconName: 'teddy-bear' },
  { title: 'High', category: 'Highschool' as Category, subcategoria: 'highschool' as Subcategoria, iconName: 'school' },
]

export const AppTabs = () => {
  return (
    <Tab.Navigator 
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: ICON_COLOR,
      tabBarInactiveTintColor: '#aaa',
      tabBarIcon: ({ color, size }) => {
        const tab = tabs.find(t => t.title === route.name)
        const iconName = tab?.iconName || 'help-circle'
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />
      },
    })}
  >
    {tabs.map(({ title, category, subcategoria }) => (
      console.log('Renderizando tab:', title),
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
