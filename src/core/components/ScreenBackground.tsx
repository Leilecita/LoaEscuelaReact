import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

type ScreenBackgroundProps = {
  children: React.ReactNode; // 👈 acá tipás los children
};

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../../assets/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)', // opcional
  },
});
