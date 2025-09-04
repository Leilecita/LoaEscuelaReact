import * as React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { HomeScreen, LoginScreen, ProfileScreen, RegisterScreen, StudentListScreen } from '@containers';
import CreateStudentScreen from '../../../src/containers/students/screens/CreateStudentScreen';
import InformationStudentScreen from '../../../src/containers/students/screens/InformationStudentScreen';
import { PaymentStudentListScreen } from 'containers/students/screens/PaymentStudentListScreen';
import IncomesListScreen from 'containers/incomes/screens/IncomesListScreen';

import { AuthContext } from '../../contexts/AuthContext';
import type { AuthStackParamList, RootStackParamList } from '../../types';
import { MenuHeader } from '../../../src/core/components/MenuHeader';
import { CustomDrawerContent } from '../../../src/core/components/CustomDrawerContent';
import { DailySummaryScreen } from '../../../src/core/screens/DailySummaryScreen';
import { AppTabs } from './AppTabs';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from 'core/constants';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const Drawer = createDrawerNavigator();

// 🎨 Tema con fondo transparente
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

// --- Auth stack ---
function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
    </AuthStackNav.Navigator>
  );
}

// --- Drawer Main App ---
function MainDrawer() {
  return (
    
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: true, headerStyle: { backgroundColor: COLORS.button },
      drawerStyle: {
        width: 200,                   // ancho del drawer
        backgroundColor: 'transparent', // fondo transparente
      },
      overlayColor: 'rgba(0,0,0,0.5)', // sombra sobre la pantalla
      headerTintColor: '#fff',
      headerTitleStyle: { fontFamily: 'OpenSans-Regular' }, }}
    >
     <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Loa Escuela',
          headerRight: () => <MenuHeader iconColor="#fff" />, // blanco
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerRight: () => <MenuHeader iconColor="#fff" />, // blanco
        }}
      />
    </Drawer.Navigator>
        
      );
}
 
export function NavigationApp() {
  const { userToken } = React.useContext(AuthContext);

  return (
    <ImageBackground
      source={require('../../../assets/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" backgroundColor={COLORS.button} />
      <NavigationContainer theme={MyTheme}>
        {userToken ? (
          <RootStack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: COLORS.button },
              headerTintColor: '#fff',
              headerTitleStyle: { fontFamily: 'OpenSans-Regular' },
            }}
          >
            <RootStack.Screen
              name="MainApp"
              component={MainDrawer}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Asistencias"
              component={AppTabs}
              options={{
                title: 'Asistencias',
                headerBackTitle: 'Volver',
                headerRight: () => <MenuHeader iconColor="#fff" />,
              }}
            />
            <RootStack.Screen
              name="ListaDeAlumnos"
              component={StudentListScreen}
              options={{ title: 'Todos los alumnos', headerRight: () => <MenuHeader iconColor="#fff" /> }}
            />
            <RootStack.Screen
              name="ListaDePagos"
              component={IncomesListScreen}
              options={{ title: 'Lista de pagos', headerRight: () => <MenuHeader iconColor="#fff" /> }}
            />
            <RootStack.Screen
              name="PaymentStudentList"
              component={PaymentStudentListScreen}
              options={{ title: 'Alumnos', headerRight: () => <MenuHeader iconColor="#fff" /> }}
            />
            <RootStack.Screen
              name="CreateStudent"
              component={CreateStudentScreen}
              options={{ headerRight: () => <MenuHeader iconColor="#fff" /> }}
            />
            <RootStack.Screen
              name="InformationStudent"
              component={InformationStudentScreen}
              options={{ title: 'Pagos y Clases', headerRight: () => <MenuHeader iconColor="#fff" /> }}
            />
             <RootStack.Screen
                name="DailySummaryScreen"
                component={DailySummaryScreen}
                options={{ title: 'Daily Summary' }}
              />
          </RootStack.Navigator>
        ) : (
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Authentication" component={AuthStack} />
          </RootStack.Navigator>
        )}
      </NavigationContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
