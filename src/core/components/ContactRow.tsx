import React from 'react'
import { View, Text, Linking, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import { COLORS } from 'core/constants'

type Props = {
  name: string
  phone?: string | null
}

export const ContactRow: React.FC<Props> = ({ name, phone }) => {
  const normalizedPhone = phone?.replace(/\D/g, '') || ''
  const colorButton = COLORS.buttonClearLetter

  return (
    <View style={styles.contactRow}>
      {/* Columna 1: Nombre */}
      <Text style={styles.contactName}>{name}</Text>

      {/* Columna 2: Teléfono */}
      <Text style={styles.phoneText}>{phone ?? 'Sin teléfono'}</Text>

      {/* Columna 3: Botones */}
      <View style={styles.icons}>
        {phone && (
          <>
            <IconButton
              icon="phone"
              size={20}
              iconColor={colorButton}
              onPress={() => Linking.openURL(`tel:${phone}`)}
            />
            <IconButton
              icon="whatsapp"
              size={20}
              iconColor={colorButton}
              onPress={() => Linking.openURL(`https://wa.me/${normalizedPhone}`)}
            />
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingBottom: 4,
  },
  contactName: {
    flex: 1, // Ocupa espacio proporcional
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
    fontWeight: '500',
    color: COLORS.darkLetter,
  },
  phoneText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkLetter,
    fontFamily: 'OpenSans-Light',
    
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 0.6, // ocupa menos espacio
  },
})
