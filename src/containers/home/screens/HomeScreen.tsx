// src/containers/home/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../src/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../../core/services/axiosClient';

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

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await api.get('/planillas_presentes.php', {
          params: { method: 'getDayResumPresents', page: 0 },
        });
  
        // La data real está en response.data.data
        const dataArray = response.data.data;
  
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          setResumen(dataArray[0]); // tomamos el primer día
        }
      } catch (error) {
        console.log('Error al cargar resumen', error);
      }
    };
  
    fetchResumen();
  }, []);
  
  

  return (
    <View style={styles.container}>
      {/* fila superior */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('Asistencias')} style={styles.button}>
          <Image source={require('../../../../assets/asistencia.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ListaDePagos')} style={styles.button}>
          <Image source={require('../../../../assets/pagos.png')} style={styles.icon} />
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
          onPress={() =>
            navigation.navigate('ListaDeAlumnos', {
              category: 'Todas',
              subcategoria: 'Todas',
              modo: 'cargarPago',
            })
          }
          style={styles.button}
        >
          <Image source={require('../../../../assets/pagos.png')} style={styles.icon} />
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
          <Image source={require('../../../../assets/estadisticas.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* recuadro transparente abajo */}
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 10 }}
      >
        <View style={styles.transparentBox}>
          {resumen ? (
            <>
              <Text style={styles.boxText}>{resumen.day}</Text>


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
      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#d8e219',
    paddingTop: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bigButton: {
    alignItems: 'center',
    marginVertical: 20,
  },
  icon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  bigIcon: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  center: {
    alignItems: 'center',
  },
  transparentBox: {
    bottom: 20,
    top: 20,
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'flex-start',
  },
  boxText: {
    color: '#000',
    fontFamily: 'OpenSans-Light',
    fontSize: 16,
  },
  columnsContainer: {
    flexDirection: 'row',
    marginVertical: 13,
    flexWrap: 'wrap',
  },
  columnItem: {
    width: '50%', // dos columnas
    paddingRight: 10,
  },
  rowItem: {
    flexDirection: 'row',
    marginVertical: 5,
    
    justifyContent: 'space-between',
  },

});
