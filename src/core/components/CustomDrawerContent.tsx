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
        <Text style={styles.menuText}>Pagos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          if (!isAdmin) {
            Alert.alert('Acceso restringido', 'Solo los administradores pueden acceder aquí');
            return;
          }
          navigation.navigate('ResumenTabs');
        }}
      >
        <MaterialCommunityIcons name="chart-bar" size={22} color="#fff" />
        <Text style={styles.menuText}>Resumen diario</Text>
      </TouchableOpacity>


      <Text style={styles.sectionTitle}>Admin</Text>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          if (!isAdmin) {
            Alert.alert('Acceso restringido', 'Solo los administradores pueden acceder aquí');
            return;
          }
          navigation.navigate('AttendanceSheetScreen');
        }}
      >
        <MaterialCommunityIcons name="book-open" size={22} color="#fff" />
        <Text style={styles.menuText}>Planillas</Text>
      </TouchableOpacity>
      
     
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          if (!isAdmin) {
            Alert.alert('Acceso restringido', 'Solo los administradores pueden acceder aquí');
            return;
          }
          navigation.navigate('CreateUserScreen'); 
        }}
      >
        <MaterialCommunityIcons name="account-plus" size={22} color="#fff" />
        <Text style={styles.menuText}>Crear usuario</Text>
      </TouchableOpacity>


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
    marginLeft: 16,
    color: COLORS.backgroundGreenClear,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 16,
  },
  menuText: {
    marginLeft: 12,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'OpenSans-Light',
  },
});
