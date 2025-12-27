// core/components/AutorizadosList.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import TextTicker from 'react-native-text-ticker'
import { COLORS } from 'core/constants'
import { FONT_SIZES } from 'core/constants/fonts'
import { formatDNI } from '../../helpers/formatDNIHelper'

type Autorizado = {
  nombre?: string | null
  dni?: string | null
  parentesco?: string | null
}

type Props = {
  student: {
    autorizado1_nombre?: string | null
    autorizado1_dni?: string | null
    autorizado1_parentesco?: string | null
    autorizado2_nombre?: string | null
    autorizado2_dni?: string | null
    autorizado2_parentesco?: string | null
    autorizado3_nombre?: string | null
    autorizado3_dni?: string | null
    autorizado3_parentesco?: string | null
  }
}

export const AuthorizedList: React.FC<Props> = ({ student }) => {
  const autorizados: Autorizado[] = [
    { nombre: student.autorizado1_nombre, dni: student.autorizado1_dni, parentesco: student.autorizado1_parentesco },
    { nombre: student.autorizado2_nombre, dni: student.autorizado2_dni, parentesco: student.autorizado2_parentesco },
    { nombre: student.autorizado3_nombre, dni: student.autorizado3_dni, parentesco: student.autorizado3_parentesco },
  ].filter(a => a.nombre || a.dni || a.parentesco)

  if (autorizados.length === 0) return null

  return (
    <View>
      {autorizados.map((a, index) => (
        <View key={index} style={styles.row}>
          {/* Columna 1: Nombre */}
          <View style={styles.nameContainer}>
            <TextTicker
              style={styles.text}
              duration={6000}
              loop
              bounce={false}
              repeatSpacer={100}
              marqueeDelay={1000}
              scrollSpeed={50}
            >
              {a.nombre || '-'}
            </TextTicker>
          </View>

          {/* Columna 2: DNI */}
          <Text style={[styles.text, styles.dniText]}>
            {a.dni ? formatDNI(a.dni) : '-'}
          </Text>

          {/* Columna 3: Parentesco */}
          <Text style={[styles.text, styles.parentescoText]}>
            ({a.parentesco || '-'})
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  nameContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  text: {
    fontSize: FONT_SIZES.dni,
    fontFamily: 'OpenSans-Light',
    color: COLORS.darkLetter,
  },
  dniText: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  parentescoText: {
    flex: 0.8,
    textAlign: 'right',
  },
})
