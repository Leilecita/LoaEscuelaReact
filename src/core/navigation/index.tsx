import * as React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen, LoginScreen, ProfileScreen, RegisterScreen, StudentListScreen } from '@containers';
import CreateStudentScreen from '../../../src/containers/students/screens/CreateStudentScreen';
import InformationStudentScreen from '../../../src/containers/students/screens/InformationStudentScreen';

import { AuthContext } from '../../contexts/AuthContext';
import type { AuthStackParamList, RootStackParamList } from '../../types';
import { MenuHeader } from '../../../src/core/components/MenuHeader';
import { AppTabs } from './AppTabs';
import { PaymentStudentListScreen } from 'containers/students/screens/PaymentStudentListScreen';
import IncomesListScreen from 'containers/incomes/screens/IncomesListScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

// 🎨 Tema con fondo transparente
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
    </AuthStackNav.Navigator>
  );
}

function MainApp() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#c48edc' }, // 💜 violeta claro
        headerTintColor: '#fff', // texto de la barra en blanco
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <RootStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerRight: () => <MenuHeader />,
        }}
      />
      <RootStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerRight: () => <MenuHeader />,
        }}
      />
    </RootStack.Navigator>
  );
}

export function NavigationApp() {
  const { userToken } = React.useContext(AuthContext);

  return (
    <ImageBackground
      source={require('../../../assets/fondo.jpg')}
      style={styles.background}
    >
      <NavigationContainer theme={MyTheme}>
        {userToken ? (
          <RootStack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#c48edc' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <RootStack.Screen
              name="MainApp"
              component={MainApp}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Asistencias"
              component={AppTabs}
              options={{
                title: 'Asistencias',
                headerBackTitle: 'Volver',
                headerRight: () => <MenuHeader />,
              }}
            />
            <RootStack.Screen
              name="ListaDeAlumnos"
              component={StudentListScreen}
              options={{ title: 'Todos los alumnos' }}
            />
            <RootStack.Screen
              name="ListaDePagos"
              component={IncomesListScreen}
              options={{ title: 'Lista de pagos' }}
            />
            <RootStack.Screen
              name="PaymentStudentList"
              component={PaymentStudentListScreen}
              options={{ title: 'Alumnos' }}
            />
            <RootStack.Screen name="CreateStudent" component={CreateStudentScreen} />
            <RootStack.Screen
              name="InformationStudent"
              component={InformationStudentScreen}
              options={{ title: 'Pagos y Clases' }}
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
    resizeMode: 'cover',
  },
});
