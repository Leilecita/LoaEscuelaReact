import React, { useState } from 'react'
import { View, Text, useWindowDimensions } from 'react-native'  // <-- agregá Text aquí
import { TabView, TabBar } from 'react-native-tab-view'
import { StudentListScreen } from './StudentListScreen'
import { Category, Subcategoria } from 'types'

const subcategoriasPorTab: Record<string, string> = {
  adultos: 'adultos',
  intermedios: 'intermedios',
  mini: 'mini',
  kids: 'kids',
  high: 'high',
}

export const StudentTabsScreen = () => {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'adultos', title: 'Adultos' },
    { key: 'intermedios', title: 'Intermedios' },
    { key: 'mini', title: 'Mini' },
    { key: 'kids', title: 'Kids' },
    { key: 'high', title: 'High' },
  ])

  const categoriasPorTab: Record<string, string> = {
    adultos: 'escuela',
    intermedios: 'escuela',
    mini: 'colonia',
    kids: 'colonia',
    high: 'highschool',
  }

  const renderScene = ({ route }: { route: { key: string } }) => {
    const categoria = (categoriasPorTab[route.key] || 'Escuela') as Category
    const subcategoria = (subcategoriasPorTab[route.key] || 'adultos') as Subcategoria
    return (
      <StudentListScreen
        category={categoria}
        subcategoria={subcategoria}
      />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'black' }}
            style={{ backgroundColor: 'white' }}
            renderLabel={({ route, focused }) => (
              <Text style={{ color: focused ? 'black' : 'gray', fontWeight: focused ? 'bold' : 'normal', margin: 8 }}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  )
}
