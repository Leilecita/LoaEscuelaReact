import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

// 🔹 Tipamos el parámetro size como number
export function normalize(size: number): number {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const FONT_SIZES = {
  xsmall: normalize(10),
  small: normalize(12),
  medium: normalize(16),
  name: normalize(16),
  dni: normalize(14),
  date: normalize(15),
  large: normalize(20),
  xlarge: normalize(24),
  title: normalize(28),
};

export const FONT_FAMILY = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }) as string,
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }) as string,
  italic: Platform.select({
    ios: 'System',
    android: 'Roboto-Italic',
  }) as string,
};
