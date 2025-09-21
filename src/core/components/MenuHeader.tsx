// src/components/MenuHeader.tsx
import React, { useState, useContext } from 'react'
import { Menu, IconButton } from 'react-native-paper'
import { AuthContext } from '../../../src/contexts/AuthContext'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../types' // Ajustá según tu tipo de stack

type MenuHeaderProps = {
  iconColor?: string
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ iconColor = '#fff' }) => {
  const [visible, setVisible] = useState(false)
  const { signOut } = useContext(AuthContext)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const goToDailySummary = () => {
    closeMenu()
    navigation.navigate('ResumenTabs') // <- nombre de la pantalla nueva
  }
  
  const goToAttendanceSheet = () => {
    closeMenu()
    navigation.navigate('AttendanceSheetScreen') // <- nombre de la pantalla nueva
  }

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon="dots-vertical"
          onPress={openMenu}
          iconColor={iconColor} 
        />
      }
    >
      <Menu.Item onPress={signOut} title="Cerrar sesión" />
      {/*<Menu.Item onPress={goToAttendanceSheet} title="Planillas" />
      <Menu.Item onPress={goToDailySummary} title="Daily Summary" /> */}
    </Menu>
  )
}
