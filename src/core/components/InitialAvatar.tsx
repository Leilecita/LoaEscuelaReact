// src/components/InitialAvatar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from 'core/constants';

type Props = {
  letra: string;
  size?: number;
};

export const InitialAvatar: React.FC<Props> = ({ letra, size = 40 }) => {
  return (
    <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.avatarText}>{letra.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarCircle: {
    backgroundColor: COLORS.lightGreenColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
  },
});
