import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

type BadgeBubbleProps = {
  count: number | null
  loading: boolean
}

export const BadgeBubble: React.FC<BadgeBubbleProps> = ({ count, loading }) => {
  if (loading) {
    return (
      <View style={styles.bubble}>
        <ActivityIndicator color="white" size="small" />
      </View>
    )
  }

  if (!count || count === 0) {
    return null
  }

  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>{count}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
})
