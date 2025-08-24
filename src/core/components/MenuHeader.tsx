// src/components/MenuHeader.tsx
import React, { useState, useContext } from 'react'
import { Menu, IconButton } from 'react-native-paper'
import { AuthContext } from '../../../src/contexts/AuthContext'

type MenuHeaderProps = {
  iconColor?: string; // opcional, default blanco
};

export const MenuHeader: React.FC<MenuHeaderProps> = ({ iconColor = '#fff' }) => {
  const [visible, setVisible] = useState(false)
  const { signOut } = useContext(AuthContext)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon="dots-vertical"
          onPress={openMenu}
          iconColor={iconColor} // ← aquí va iconColor, no color
        />
      }
    >
      <Menu.Item onPress={signOut} title="Cerrar sesión" />
    </Menu>
  )
}
