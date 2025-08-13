import React from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Appbar, Avatar, Text, Button, Card, Divider } from 'react-native-paper';

export default function InformationStudentScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Fondo con avatar y nombre */}
        <ImageBackground
          style={styles.headerBackground}
          source={{ uri: 'https://via.placeholder.com/400x100.png?text=Background' }}
        >
          <Avatar.Text size={48} label="A" style={{ backgroundColor: '#80cbc4' }} />
          <Text style={styles.name}>Asdasd Add</Text>
        </ImageBackground>

        {/* Resumen */}
        <View style={styles.resumenHeader}>
           <Text style={styles.resumenTitle}>Resumen al 10 de Ago 2025</Text>
           <View style={styles.redDot} />
         </View>
        <View style={styles.resumenContainer}>
         
          <View style={styles.rowResumen}>
            <Text style={styles.label}>total clases compradas</Text>
            <Text style={styles.value}>0</Text>
          </View>
          <View style={styles.rowResumen}>
            <Text style={styles.label}>total clases tomadas</Text>
            <Text style={styles.value}>0</Text>
          </View>
          <Divider style={{ marginVertical: 4 }} />
          <View style={styles.rowResumen}>
            <Text style={styles.label}>total abonado</Text>
            <Text style={styles.value}>$ 0</Text>
          </View>
          <View style={styles.rowResumen}>
            <Text style={styles.label}>total deuda</Text>
            <Text style={styles.value}>$ 0</Text>
          </View>
        </View>

        {/* Tarjeta */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.dateBox}>
              <Text style={styles.month}>AGO</Text>
              <Text style={styles.day}>10</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Escuela</Text>
              <Text style={styles.cardSubtitle}>Pack</Text>
            </View>
            <Text style={styles.cardQty}>11cl</Text>
            <Text style={styles.cardPrice}>$ 10000</Text>
          </View>
          <Divider style={{ marginVertical: 4 }} />
          <View style={styles.rowResumen}>
            <Text style={styles.label}>total abonado</Text>
            <Text style={styles.value}>$ 10000</Text>
          </View>
          <View style={styles.rowResumen}>
            <Text style={styles.label}>total deuda</Text>
            <Text style={styles.value}>$ 0</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Botón flotante */}
      <Button
        mode="contained"
        style={styles.fab}
        onPress={() => {}}
      >
        crear curso nuevo
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d4e157' },
  headerBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12
  },
  name: { fontFamily:'OpenSans-Light',fontSize: 20, fontWeight: 'bold', color: '#000' },
  resumenContainer: {
    backgroundColor: '#f8bbd0',
    padding: 16,
  },
  resumenTitle: {fontFamily:'OpenSans-Regular', fontSize: 16, fontWeight: 'bold', color: '#ffff' },
  rowResumen: {
    flexDirection: 'row',
    fontFamily:'OpenSans-Light',
    justifyContent: 'space-between',
    marginVertical: 2
  },
  label: { fontFamily:'OpenSans-Regular',fontSize: 14, color: '#4e342e' },
  value: { fontFamily:'OpenSans-Regular', fontSize: 14, color: '#000' },
  card: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 8,
    borderRadius: 8
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dateBox: { width: 40, alignItems: 'center', marginRight: 8 },
  month: { fontSize: 12, fontWeight: 'bold', color: '#757575' },
  day: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  cardTitle: { fontFamily:'OpenSans-Light', fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14, color: '#757575' },
  cardQty: { fontSize: 14, color: '#000', marginHorizontal: 8 },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#ad1457'
  },
  resumenHeader: {
   flexDirection: 'row',
   alignItems: 'center',
   backgroundColor: '#aa7999',
   paddingHorizontal: 16,
   paddingVertical: 8,
 },
 redDot: {
   width: 10,
   height: 10,
   backgroundColor: '#d94f4f',
   marginLeft: 'auto',
 },
});
