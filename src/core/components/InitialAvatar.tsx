// src/components/InitialAvatar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from 'core/constants';
import { getCategoryColor } from 'helpers/categoryColorHelper';

type Props = {
  letra: string;
  size?: number;
  category? : string;
};

export const InitialAvatar: React.FC<Props> = ({ letra, size = 40, category }) => {
  return (
    <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: getCategoryColor(category) }]}>
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
