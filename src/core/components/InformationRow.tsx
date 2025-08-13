import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from 'core/constants'

type Props = {
  texto: string
  numero: string | number
}

export const InformationRow: React.FC<Props> = ({ texto, numero }) => {
  return (
    <View style={styles.row}>
      {/* Columna izquierda: texto */}
      <Text style={styles.textLeft}>{texto}</Text>

      {/* Columna derecha: número */}
      <Text style={styles.textRight}>{numero}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingBottom: 4,
  },
  textLeft: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
    fontWeight: '500',
    color: COLORS.darkLetter,
  },
  textRight: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
    textAlign: 'right',
    marginRight: 16,
  },
})
