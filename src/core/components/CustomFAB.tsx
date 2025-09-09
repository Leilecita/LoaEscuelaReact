import React from 'react';
import { TouchableOpacity, ImageBackground, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type CustomFABProps = {
  onPress: () => void;
  iconName?: string;
  iconColor?: string;
  size?: number;
  imageSource: any; // require o uri
};

export const CustomFAB: React.FC<CustomFABProps> = ({
  onPress,
  iconName = 'plus',
  iconColor = '#fff',
  size = 60,
  imageSource,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ position: 'absolute', bottom: 30, right: 30 }}
    >
      <ImageBackground
        source={imageSource}
        style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}
      >
        <MaterialCommunityIcons name={iconName} size={size * 0.5} color={iconColor} />
      </ImageBackground>
    </TouchableOpacity>
  );
};
