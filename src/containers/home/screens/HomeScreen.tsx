import React, { useState, useCallback, useContext } from 'react';
import { Dimensions } from 'react-native';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../src/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../../core/services/axiosClient';
import { DateHeader } from '../../../core/components/DateHeader';
import { COLORS } from '@core';
import { AuthContext } from '../../../contexts/AuthContext';
import { FONT_SIZES } from 'core/constants/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ReportResumPlanilla = {
  cant_presentes: number;
  nombre_planilla: string;
};

type ReportResumAsist = {
  tot_incomes: number;
  tot_incomes_escuela: number;
  tot_incomes_highschool: number;
  tot_incomes_colonia: number;
  tot_presents: number;
  day: string;
  planillas: ReportResumPlanilla[];
};

export const HomeScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [resumen, setResumen] = useState<ReportResumAsist | null>(null);
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';

  const fetchResumen = async () => {
    try {
      const response = await api.get('/planillas_presentes.php', {
        params: { method: 'getDayResumPresents', page: 0 },
      });

      const dataArray = response.data.data;

      if (Array.isArray(dataArray) && dataArray.length > 0) {
        setResumen(dataArray[0]); // tomamos el primer día
      }
    } catch (error) {
      console.log('Error al cargar resumen', error);
    }
  };

  // 🔹 Se ejecuta cada vez que HomeScreen recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchResumen();
    }, [])
  );

  return (
    <ImageBackground
      source={require('../../../../assets/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
    <View style={styles.container}>
      {/* fila superior */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('Asistencias')} style={styles.button}>
          <Image source={require('../../../../assets/asistencia.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ListaDeAlumnos', {
              category: 'Todas',
              subcategoria: 'Todas',
              modo: 'cargarPago',
            })
          }
          style={styles.button}
        >
          <Image source={require('../../../../assets/crear_pago.png')} style={styles.icon} />
        </TouchableOpacity>

      
      </View>

      {/* botón central */}
      <View style={styles.center}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ListaDeAlumnos', {
              category: 'Todas',
              subcategoria: 'Todas',
              modo: 'lista',
            })
          }
          style={styles.bigButton}
        >
          <Image source={require('../../../../assets/alumnos.png')} style={styles.bigIcon} />
        </TouchableOpacity>
      </View>

      {/* fila inferior */}
      <View style={styles.row}>
       
        <TouchableOpacity
            onPress={() => {
              if (!isAdmin) {
                Alert.alert('Acceso restringido', 'Solo los administradores pueden acceder aquí');
                return;
              }
              navigation.navigate('ResumenTabs');
            }}
          style={styles.button}
        >
          <Image source={require('../../../../assets/resumen_diario.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ListaDePagos')} style={styles.button}>
          <Image source={require('../../../../assets/listado_pagos.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* recuadro transparente abajo */}
      <View style={styles.transparentBox}>
        {resumen ? (
          <>
            <View style={{ marginHorizontal: -5, marginTop:-18 }}>
              <DateHeader 
                date={
                  resumen.day.includes('T')
                    ? resumen.day
                    : resumen.day + 'T00:00:00'
                }
              />
            </View>

            <View style={styles.columnsContainer}>
              {resumen.planillas?.map((p) => (
                <View key={p.nombre_planilla} style={styles.columnItem}>
                  <View style={styles.rowItem}>
                    <Text style={styles.boxText}>{p.nombre_planilla}</Text>
                    <Text style={styles.boxText}>{p.cant_presentes}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.boxText}>Cargando resumen...</Text>
        )}
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '90%' },
  button: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
  bigButton: { alignItems: 'center', marginVertical: 4 },
  icon: { width: SCREEN_WIDTH * 0.30, height: SCREEN_WIDTH * 0.30, resizeMode: 'contain' },
  bigIcon: { width: SCREEN_WIDTH * 0.35, height: SCREEN_WIDTH * 0.35, resizeMode: 'contain' },
  center: { alignItems: 'center' },
  transparentBox: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 10 : 30,
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: 'flex-start',
  },
  boxText: { color: COLORS.darkLetter, fontFamily: 'OpenSans-Light',  fontSize: FONT_SIZES.dni },
  columnsContainer: { flexDirection: 'row', marginVertical: 1, flexWrap: 'wrap' },
  columnItem: { width: '50%', paddingRight: 10 },
  rowItem: { flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between' },
  background: { flex: 1 },
});
