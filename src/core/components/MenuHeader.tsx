// src/components/MenuHeader.tsx
import React, { useState, useContext } from 'react'
import { Menu, IconButton } from 'react-native-paper'
import { AuthContext } from '../../../src/contexts/AuthContext'

export const MenuHeader = () => {
  const [visible, setVisible] = useState(false)
  const { signOut } = useContext(AuthContext)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}
    >
      <Menu.Item onPress={signOut} title="Cerrar sesión" />
    </Menu>
  )
}
