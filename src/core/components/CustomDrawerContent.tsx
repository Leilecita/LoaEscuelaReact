import React, { useContext } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS } from 'core/constants';
import { AuthContext } from '../../contexts/AuthContext';


export function CustomDrawerContent(props: any) {
  const { navigation } = props;
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';

  const { signOut } = useContext(AuthContext)

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: COLORS.darkGreenColor, width: 200 }}>
      <View style={styles.header}>
        <Text style={styles.userName}>Leila</Text>
      </View>

      {/* Sección General */}
      <Text style={styles.sectionTitle}>General</Text>

      
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Asistencias')}>
        <MaterialCommunityIcons name="account-check" size={22} color="#fff" />
        <Text style={styles.menuText}>Asistencias</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ListaDePagos')}>
        <MaterialCommunityIcons name="hand-coin" size={22} color="#fff" />
        <Text style={styles.menuText}>Lista pagos</Text>
      </TouchableOpacity>


      {isAdmin && (
        <>
          <Text style={styles.sectionTitle}>Resumen diario</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ResumenTabs', { screen: 'Trabajos' })}
          >
            <MaterialCommunityIcons name="briefcase-check" size={22} color="#fff" />
            <Text style={styles.menuText}>Trabajos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ResumenTabs', { screen: 'Pagos' })}
          >
            <MaterialCommunityIcons name="cash-multiple" size={22} color="#fff" />
            <Text style={styles.menuText}>Cajas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ResumenTabs', { screen: 'Presentes' })}
          >
            <MaterialCommunityIcons name="account-group" size={22} color="#fff" />
            <Text style={styles.menuText}>Presentes</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.sectionTitle}>Profes</Text>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          
          navigation.navigate('DailyJobsScreen');
        }}
      >
        <MaterialCommunityIcons name="clipboard-plus" size={22} color="#fff" />
        <Text style={styles.menuText}>Carga trabajos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ListaDeTrabajos')}>
        <MaterialCommunityIcons name="briefcase-check" size={22} color="#fff" />
        <Text style={styles.menuText}>Lista de trabajos</Text>
      </TouchableOpacity>
      

      <Text style={styles.sectionTitle}>Admin</Text>
      {isAdmin && (
        <>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate('AttendanceSheetScreen');
        }}
      >
        <MaterialCommunityIcons name="book-open" size={22} color="#fff" />
        <Text style={styles.menuText}>Planillas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate('CreateUserScreen'); 
        }}
      >
        <MaterialCommunityIcons name="account-plus" size={22} color="#fff" />
        <Text style={styles.menuText}>Crear usuario</Text>
      </TouchableOpacity>
      </>
      )}

      <TouchableOpacity style={styles.menuItem} onPress={signOut}>
        <MaterialCommunityIcons name="logout" size={22} color="#fff" />
        <Text style={styles.menuText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#fff',
  },
  userName: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'OpenSans-Bold',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 4,
    marginLeft: 16,
    color: COLORS.backgroundGreenClear,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginLeft: 8,
    paddingLeft: 16,
  },
  menuText: {
    marginLeft: 12,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'OpenSans-Light',
  },
});
