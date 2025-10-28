import React from 'react'
import { View, Text, Linking, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import TextTicker from 'react-native-text-ticker'
import { COLORS } from 'core/constants'
import { FONT_SIZES } from 'core/constants/fonts'

type Props = {
  name: string
  phone?: string | null
}

export const ContactRow: React.FC<Props> = ({ name, phone }) => {
  const normalizedPhone = phone?.replace(/\D/g, '') || ''
  const colorButton = COLORS.buttonClearLetter

  return (
    <View style={styles.contactRow}>
      {/* Columna 1: Nombre (scroll automático si es largo) */}
      <View style={styles.nameContainer}>
        <TextTicker
          style={styles.contactName}
          duration={6000}         // velocidad del scroll (ms)
          loop                   // vuelve al inicio
          bounce={false}          // sin rebote
          repeatSpacer={100}       // espacio entre repeticiones
          marqueeDelay={1000}     // pausa inicial antes de moverse
          scrollSpeed={50}        // velocidad base del movimiento
        >
          {name}
        </TextTicker>
      </View>

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
              style={styles.iconButton}
              onPress={() => Linking.openURL(`tel:${phone}`)}
            />
            <IconButton
              icon="whatsapp"
              size={20}
              iconColor={colorButton}
              style={styles.iconButton}
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
  },
  nameContainer: {
    flex: 1,
    overflow: 'hidden', // evita superposición con otras columnas
  },
  contactName: {
    fontSize: FONT_SIZES.dni,
    fontFamily: 'OpenSans-Light',
    fontWeight: '500',
    color: COLORS.darkLetter,
  },
  phoneText: {
    flex: 1,
    fontSize: FONT_SIZES.dni,
    color: COLORS.darkLetter,
    fontFamily: 'OpenSans-Light',
    textAlign: 'right',
    marginRight: 10,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 0.8,
  },
  iconButton: {
    marginLeft: 10,
    padding: 0,
    width: 28,
    height: 28,
  },
})
