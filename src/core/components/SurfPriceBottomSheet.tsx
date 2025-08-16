// SurfPriceBottomSheet.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  visible: boolean;
  onClose: () => void;
  price?: number; // opcional, si querés pasar el valor de la clase
};

export const SurfPriceBottomSheet: React.FC<Props> = ({ visible, onClose, price = 5000 }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      swipeDirection="down"
      onSwipeComplete={onClose}
    >
      <View style={styles.sheet}>
        <Text style={styles.title}>Valor de las clases de surf</Text>
        <Text style={styles.value}>${price} / clase</Text>
        <Button title="Cerrar" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 180,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
